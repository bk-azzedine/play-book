# embed_service/tasks.py

from celery import shared_task
import logging
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from datetime import datetime
from typing import Dict, Any, List

# Import our vectorstore service
from .vectorstore_service import vector_store_service

logger = logging.getLogger(__name__)


@shared_task(name='embed_service.tasks.vectorize_document')
def vectorize_document(document_data):
    """
    Consumes a document message from RabbitMQ and converts to LangChain Document.
    Then, it generates embeddings and stores them in ChromaDB via VectorStoreService.
    """
    logger.info(f"Received document data for vectorization. Type: {type(document_data)}")

    document_id = document_data.get('id')
    if not document_id:
        logger.error("Received document data with no ID.")
        return {"status": "failure", "reason": "No document ID provided."}

    # Check if vectorstore service is ready
    if not vector_store_service.is_ready():
        logger.error(f"Cannot process document {document_id}: VectorStore service not ready.")
        return {"status": "failure",
                "reason": "VectorStore service not ready (embedding model or DB connection failed)."}

    logger.info(f"Processing document with ID: {document_id}")

    try:
        # Convert to LangChain Document
        langchain_doc = convert_to_langchain_document(document_data)
        logger.info(f"Converted to LangChain document. Content length: {len(langchain_doc.page_content)}")

        # Split into chunks for better embedding
        chunks = split_document_into_chunks(langchain_doc)
        logger.info(f"Split document into {len(chunks)} chunks")

        # Store embeddings using the vectorstore service
        success = vector_store_service.store_document_embeddings(chunks, document_id)

        if success:
            logger.info(f"Successfully vectorized and stored document ID: {document_id}")
            return {"status": "success", "document_id": document_id, "chunks": len(chunks)}
        else:
            logger.error(f"Failed to store embeddings for document ID: {document_id}")
            return {"status": "failure", "reason": "Failed to store embeddings in vector database"}

    except Exception as e:
        logger.error(f"An error occurred during vectorization for document ID {document_id}: {e}")
        logger.exception("Full traceback:")
        raise  # Re-raise the exception to allow Celery to handle retries if configured


@shared_task(name='embed_service.tasks.search_documents')
def search_documents(query: str, n_results: int = 10, filters: dict = None):
    """
    Search for documents similar to the given query

    Args:
        query: Search query string
        n_results: Number of results to return
        filters: Optional metadata filters

    Returns:
        dict: Search results
    """
    logger.info(f"Searching documents with query: '{query}', n_results: {n_results}")

    if not vector_store_service.is_ready():
        logger.error("Cannot search documents: VectorStore service not ready.")
        return {"status": "failure", "reason": "VectorStore service not ready"}

    try:
        results = vector_store_service.search_documents(query, n_results, filters)
        if results:
            logger.info(f"Search completed successfully")
            return {"status": "success", "results": results}
        else:
            logger.warning("Search returned no results")
            return {"status": "success", "results": {}}

    except Exception as e:
        logger.error(f"Error during search: {e}")
        logger.exception("Full traceback:")
        return {"status": "failure", "reason": str(e)}


@shared_task(name='embed_service.tasks.delete_document')
def delete_document(document_id: str):
    """
    Delete all chunks for a specific document from the vector database

    Args:
        document_id: ID of the document to delete

    Returns:
        dict: Deletion result
    """
    logger.info(f"Deleting document with ID: {document_id}")

    if not vector_store_service.is_ready():
        logger.error(f"Cannot delete document {document_id}: VectorStore service not ready.")
        return {"status": "failure", "reason": "VectorStore service not ready"}

    try:
        success = vector_store_service.delete_document(document_id)
        if success:
            logger.info(f"Successfully deleted document ID: {document_id}")
            return {"status": "success", "document_id": document_id}
        else:
            logger.error(f"Failed to delete document ID: {document_id}")
            return {"status": "failure", "reason": "Failed to delete document from vector database"}

    except Exception as e:
        logger.error(f"Error deleting document {document_id}: {e}")
        logger.exception("Full traceback:")
        return {"status": "failure", "reason": str(e)}


@shared_task(name='embed_service.tasks.get_vectorstore_stats')
def get_vectorstore_stats():
    """
    Get statistics about the vector store

    Returns:
        dict: Vector store statistics
    """
    logger.info("Getting vectorstore statistics")

    try:
        stats = vector_store_service.get_collection_stats()
        health = vector_store_service.health_check()

        return {
            "status": "success",
            "stats": stats,
            "health": health
        }

    except Exception as e:
        logger.error(f"Error getting vectorstore stats: {e}")
        logger.exception("Full traceback:")
        return {"status": "failure", "reason": str(e)}


# --- Helper Functions (Document Processing) ---

def convert_to_langchain_document(document_data: Dict[str, Any]) -> Document:
    """Convert raw document data to LangChain Document"""
    document_data.get('id')
    title = document_data.get('title', '')
    description = document_data.get('description', '')
    content = document_data.get('content', {})


    content_parts = []
    if title and title.strip():
        content_parts.append(f"Title: {title.strip()}")
    if description and description.strip():
        content_parts.append(f"Description: {description.strip()}")
    if content:
        content_parts.append(content)

    final_content = "\n\n".join(content_parts)
    metadata = create_metadata(document_data)
    langchain_doc = Document(page_content=final_content, metadata=metadata)
    return langchain_doc




def create_metadata(document_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create metadata dictionary for LangChain Document"""
    metadata = {}

    # Basic fields
    if 'id' in document_data:
        metadata['document_id'] = document_data['id']

    if 'title' in document_data:
        metadata['title'] = document_data['title']

    if 'description' in document_data:
        metadata['description'] = document_data['description']

    # Organization and space info
    if 'organization' in document_data:
        metadata['organization'] = document_data['organization']

    if 'space' in document_data:
        metadata['space'] = document_data['space']

    # Authors - Convert list to a comma-separated string
    if 'authors' in document_data and document_data['authors']:
        authors_list = [str(author) for author in document_data['authors']]
        metadata['authors'] = ", ".join(authors_list)
        metadata['author_count'] = len(document_data['authors'])

    # Tags - Convert list to a comma-separated string
    if 'tags' in document_data and document_data['tags']:
        tags_list = [str(tag) for tag in document_data['tags']]
        metadata['tags'] = ", ".join(tags_list)
        metadata['tag_count'] = len(document_data['tags'])

    # Timestamps - handle the array format [year, month, day, hour, minute, second]
    if 'createdAt' in document_data:
        created_at = document_data['createdAt']
        if isinstance(created_at, list) and len(created_at) >= 6:
            try:
                dt = datetime(created_at[0], created_at[1], created_at[2],
                              created_at[3], created_at[4], created_at[5])
                metadata['created_at'] = dt.isoformat()
                metadata['created_date'] = dt.date().isoformat()
            except Exception as e:
                logger.warning(f"Could not parse createdAt timestamp: {e}")

    if 'lastUpdated' in document_data:
        last_updated = document_data['lastUpdated']
        if isinstance(last_updated, list) and len(last_updated) >= 6:
            try:
                dt = datetime(last_updated[0], last_updated[1], last_updated[2],
                              last_updated[3], last_updated[4], last_updated[5])
                metadata['last_updated'] = dt.isoformat()
                metadata['last_updated_date'] = dt.date().isoformat()
            except Exception as e:
                logger.warning(f"Could not parse lastUpdated timestamp: {e}")

    # Draft status
    if 'draft' in document_data:
        metadata['is_draft'] = document_data['draft']

    # Version
    if 'version' in document_data:
        metadata['version'] = document_data['version']

    # Content stats
    content = document_data.get('content', {})
    if content and isinstance(content, dict):
        blocks = content.get('blocks', [])
        metadata['block_count'] = len(blocks)

        block_types = {}
        for block in blocks:
            block_type = block.get('type', 'unknown')
            block_types[block_type] = block_types.get(block_type, 0) + 1

        metadata['block_types'] = str(block_types)

    return metadata


def split_document_into_chunks(langchain_doc: Document,
                               chunk_size: int = 1000,
                               chunk_overlap: int = 200) -> List[Document]:
    """Split document into smaller chunks for better embedding"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = text_splitter.split_documents([langchain_doc])
    for i, chunk in enumerate(chunks):
        chunk.metadata['chunk_index'] = i
        chunk.metadata['total_chunks'] = len(chunks)
        chunk.metadata['chunk_size'] = len(chunk.page_content)
    return chunks


# --- Utility function to test the conversion (optional, for local testing) ---
def test_document_conversion(document_data):
    """Test function to see how your document gets converted"""
    langchain_doc = convert_to_langchain_document(document_data)
    print(f"Document ID: {langchain_doc.metadata.get('document_id')}")
    print(f"Title: {langchain_doc.metadata.get('title')}")
    print(f"Content length: {len(langchain_doc.page_content)}")
    print(f"First 200 chars: {langchain_doc.page_content[:200]}...")
    print(f"Metadata keys: {list(langchain_doc.metadata.keys())}")
    return langchain_doc