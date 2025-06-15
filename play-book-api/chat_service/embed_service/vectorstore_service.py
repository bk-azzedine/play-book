import logging
from typing import List, Optional, Dict, Any
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
import chromadb
# Correct import for LangChain's HuggingFace embeddings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma  # This is correct for the wrapper

# Import ChromaDB's specific Sentence Transformer embedding function utility
from chromadb.utils import embedding_functions

logger = logging.getLogger(__name__)


class VectorStoreService:
    """Service class to handle all ChromaDB operations"""

    def __init__(self, host: str = 'localhost', port: int = 8001, collection_name: str = "documents_embeddings"):
        self.host = host
        self.port = port
        self.collection_name = collection_name
        self.client: Optional[chromadb.HttpClient] = None
        self.collection: Optional[chromadb.api.models.Collection.Collection] = None

        # We will now have TWO embedding function instances:
        # 1. For LangChain's Chroma wrapper (LangChain-compatible Embeddings)
        self.langchain_embedding_model: Optional[HuggingFaceEmbeddings] = None
        # 2. For direct ChromaDB collection creation (ChromaDB-compatible EmbeddingFunction)
        self.chroma_embedding_function: Optional[embedding_functions.SentenceTransformerEmbeddingFunction] = None

        # This will be LangChain's Chroma wrapper for search
        self.langchain_chroma: Optional[Chroma] = None

        # Text splitter for chunking content
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )

        self._initialize()

    def _initialize(self):
        """Initialize the ChromaDB client, embedding functions, and collection"""
        try:
            # 1. Initialize the LangChain-compatible embedding model
            self.langchain_embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
            logger.info("LangChain HuggingFaceEmbeddings model loaded successfully.")

            # 2. Initialize ChromaDB's specific Sentence Transformer embedding function
            # This is the one that correctly matches ChromaDB's internal `EmbeddingFunction` type hint.
            # It uses the same 'sentence-transformers/all-MiniLM-L6-v2' model by default,
            # so the embeddings generated will be consistent.
            self.chroma_embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            logger.info("ChromaDB SentenceTransformerEmbeddingFunction loaded successfully.")

            # 3. Initialize the ChromaDB client
            self.client = chromadb.HttpClient(host=self.host, port=self.port)
            logger.info(f"ChromaDB client connected to {self.host}:{self.port}")

            # 4. Get or create the collection using ChromaDB's specific embedding function
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name,
                embedding_function=self.chroma_embedding_function  # Use ChromaDB's own embedding function here
            )
            logger.info(f"ChromaDB collection '{self.collection_name}' initialized successfully.")

            # 5. Initialize LangChain's Chroma wrapper
            # This must use the LangChain-compatible embedding model
            self._initialize_langchain_chroma()
            logger.info("LangChain Chroma wrapper initialized successfully.")

        except Exception as e:
            logger.error(f"Failed to initialize VectorStoreService: {e}")
            self.client = None
            self.collection = None
            self.langchain_embedding_model = None
            self.chroma_embedding_function = None
            self.langchain_chroma = None
            raise  # Re-raise to signal fatal initialization error

    def process_document_message(self, document_data: dict) -> bool:
        """
        Process a document message with simplified content structure.

        Args:
            document_data: Dictionary containing title, description, content (as string),
                          organization, space, authors, tags

        Returns:
            bool: True if successful, False otherwise
        """
        if not self.is_ready():
            logger.error(f"Cannot process document: VectorStoreService is not ready.")
            return False

        try:
            # Extract document info
            title = document_data.get('title', 'Untitled')
            description = document_data.get('description', '')
            content = document_data.get('content', '')
            organization = document_data.get('organization', '')
            space = document_data.get('space', '')
            authors = document_data.get('authors', [])
            tags = document_data.get('tags', [])

            # Generate a document ID (you might want to pass this from Java)
            document_id = f"{organization}_{space}_{hash(title + content) % 1000000}"

            if not content.strip():
                logger.warning(f"Document {document_id} has no content to process.")
                return True

            # Combine title, description, and content for processing
            full_text = f"{title}\n\n{description}\n\n{content}".strip()

            # Split text into chunks
            text_chunks = self.text_splitter.split_text(full_text)

            # Convert to LangChain Document objects
            chunks = []
            for i, chunk_text in enumerate(text_chunks):
                chunk_metadata = {
                    'document_id': document_id,
                    'chunk_index': i,
                    'title': title,
                    'description': description,
                    'organization': organization,
                    'space': space,
                    'authors': ', '.join(authors) if authors else '',
                    'tags': ', '.join(tags) if tags else '',
                    'chunk_type': 'text',
                    'total_chunks': len(text_chunks)
                }

                chunks.append(Document(
                    page_content=chunk_text,
                    metadata=chunk_metadata
                ))

            logger.info(f"Created {len(chunks)} chunks for document {document_id}")

            # Store the chunks
            return self.store_document_embeddings(chunks, document_id)

        except Exception as e:
            logger.error(f"Error processing document message: {e}")
            logger.exception("Full traceback:")
            return False

    def is_ready(self) -> bool:
        """Check if the service is ready to process documents"""
        # Ensure all core components are initialized
        return all([self.client, self.collection, self.langchain_embedding_model,
                    self.chroma_embedding_function, self.langchain_chroma])

    def store_document_embeddings(self, chunks: List[Document], document_id: str) -> bool:
        """
        Stores document chunks and their embeddings in ChromaDB.
        The embeddings are generated by ChromaDB using its configured embedding_function.

        Args:
            chunks: List of LangChain Document chunks
            document_id: ID of the source document

        Returns:
            bool: True if successful, False otherwise
        """
        if not self.is_ready():
            logger.error(f"Cannot store embeddings for document {document_id}: VectorStoreService is not ready.")
            return False

        logger.info(f"Preparing to add {len(chunks)} chunks for document {document_id} to ChromaDB.")

        documents_to_add = []
        metadatas_to_add = []
        ids_to_add = []

        for chunk in chunks:
            documents_to_add.append(chunk.page_content)
            processed_metadata = self._process_metadata_for_chroma(chunk.metadata)
            metadatas_to_add.append(processed_metadata)
            ids_to_add.append(f"{chunk.metadata['document_id']}_{chunk.metadata['chunk_index']}")

        try:
            # Delete existing chunks for this document first (in case of updates)
            self.delete_document(document_id)

            self.collection.add(
                documents=documents_to_add,
                metadatas=metadatas_to_add,
                ids=ids_to_add
            )
            logger.info(f"Successfully added {len(chunks)} chunks for document {document_id} to ChromaDB.")
            return True

        except Exception as e:
            logger.error(f"Error adding chunks for document {document_id} to ChromaDB: {e}")
            logger.exception("Full traceback:")
            return False

    def _process_metadata_for_chroma(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Helper to ensure metadata values are compatible with ChromaDB.
        ChromaDB expects metadata values to be str, int, float, bool, or None.
        This function handles potential lists or dicts by converting them to strings.
        """
        processed_metadata = {}
        for key, value in metadata.items():
            if isinstance(value, (str, int, float, bool)) or value is None:
                processed_metadata[key] = value
            elif isinstance(value, list):
                # Join list items into a comma-separated string
                processed_metadata[key] = ", ".join(map(str, value))
            elif isinstance(value, dict):
                # Convert dictionary to a string representation
                processed_metadata[key] = str(value)
            else:
                # Fallback for any other complex type, convert to string
                processed_metadata[key] = str(value)
                logger.warning(f"Metadata key '{key}' has unsupported type {type(value)}. Converted to string.")
        return processed_metadata

    def _initialize_langchain_chroma(self):
        """Initialize LangChain's Chroma wrapper using the same client and embedding model."""
        if self.client and self.collection and self.langchain_embedding_model:  # Use langchain_embedding_model
            self.langchain_chroma = Chroma(
                client=self.client,
                collection_name=self.collection_name,
                embedding_function=self.langchain_embedding_model  # Use LangChain's Embeddings instance here
            )
        else:
            logger.warning("Attempted to initialize LangChain Chroma wrapper, but core components are not ready.")

    def search_documents_with_langchain(self, query: str, n_results: int = 10) -> List[tuple]:
        """Search using LangChain's similarity_search_with_relevance_scores"""
        if not self.langchain_chroma:
            logger.error("LangChain Chroma wrapper is not initialized. Cannot perform search.")
            return []
        try:
            return self.langchain_chroma.similarity_search_with_relevance_scores(
                query, k=n_results
            )
        except Exception as e:
            logger.error(f"Error during LangChain search: {e}")
            logger.exception("Full traceback:")
            return []

    def delete_document(self, document_id: str) -> bool:
        """
        Delete all chunks for a specific document

        Args:
            document_id: ID of the source document

        Returns:
            bool: True if successful, False otherwise
        """
        if not self.is_ready():
            logger.error(f"Cannot delete document {document_id}: VectorStoreService is not ready.")
            return False

        try:
            results = self.collection.get(
                where={"document_id": document_id},
                include=[]
            )

            if results and results['ids']:
                self.collection.delete(ids=results['ids'])
                logger.info(f"Successfully deleted {len(results['ids'])} chunks for document {document_id}")
                return True
            else:
                logger.info(f"No chunks found for document {document_id} to delete.")
                return True

        except Exception as e:
            logger.error(f"Error deleting document {document_id}: {e}")
            logger.exception("Full traceback:")
            return False

    def get_document_content(self, document_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves a document's full content and metadata by reconstructing it from its chunks.

        Args:
            document_id: The unique ID of the document to retrieve.

        Returns:
            Optional[Dict[str, Any]]: A dictionary containing the document's metadata
                                     and its full reconstructed content, or None if not found.
        """
        if not self.is_ready():
            logger.error(f"Cannot retrieve document {document_id}: VectorStoreService is not ready.")
            return None

        try:
            # Retrieve all chunks belonging to the document_id, including metadata and documents (content)
            results = self.collection.get(
                where={"document_id": document_id},
                include=['metadatas', 'documents']
            )

            if not results or not results['ids']:
                logger.info(f"Document with ID '{document_id}' not found in the collection.")
                return None

            # Sort chunks by their index to reconstruct the document correctly
            sorted_chunks = sorted(
                zip(results['documents'], results['metadatas']),
                key=lambda x: x[1].get('chunk_index', 0)
            )

            full_content_parts = []
            # Initialize with metadata from the first chunk
            document_metadata = sorted_chunks[0][1] if sorted_chunks else {}

            for content_part, metadata_part in sorted_chunks:
                full_content_parts.append(content_part)

            # Reconstruct the full content
            full_content = "\n\n".join(full_content_parts)

            # Ensure metadata from the original document structure is captured,
            # not just chunk-specific metadata like 'chunk_index'.
            # We can use the metadata from the first chunk as the primary document metadata.
            # Remove chunk-specific keys if they are not relevant for the whole document view.
            if 'chunk_index' in document_metadata:
                del document_metadata['chunk_index']
            if 'total_chunks' in document_metadata:
                del document_metadata['total_chunks']

            return {
                "document_id": document_id,
                "metadata": document_metadata,
                "content": full_content
            }

        except Exception as e:
            logger.error(f"Error retrieving content for document {document_id}: {e}")
            logger.exception("Full traceback:")
            return None


    def get_collection_stats(self) -> dict:
        """
        Get statistics about the collection

        Returns:
            dict: Collection statistics
        """
        if not self.is_ready():
            logger.error("Cannot get collection stats: VectorStoreService is not ready.")
            return {"status": "error", "message": "VectorStoreService is not ready."}

        try:
            count = self.collection.count()
            return {
                "collection_name": self.collection_name,
                "total_chunks": count,
                "status": "ready"
            }
        except Exception as e:
            logger.error(f"Error getting collection stats: {e}")
            return {"status": "error", "message": str(e)}

    def health_check(self) -> dict:
        """
        Perform a health check on the service

        Returns:
            dict: Health check results
        """
        try:
            if not self.client:
                return {"status": "error", "message": "ChromaDB client not initialized or failed to connect."}

            self.client.heartbeat()

            if not self.collection:
                return {"status": "error", "message": "ChromaDB collection not initialized."}

            if not self.langchain_embedding_model:
                return {"status": "error", "message": "LangChain embedding model not initialized."}

            if not self.chroma_embedding_function:
                return {"status": "error", "message": "ChromaDB embedding function not initialized."}

            if not self.langchain_chroma:
                return {"status": "error", "message": "LangChain Chroma wrapper not initialized."}

            count = self.collection.count()

            return {
                "status": "healthy",
                "client_connected": True,
                "collection_ready": True,
                "langchain_embedding_model_ready": True,
                "chroma_embedding_function_ready": True,
                "langchain_chroma_ready": True,
                "total_chunks_in_collection": count
            }

        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {"status": "error", "message": str(e), "full_traceback": logger.exception("Health check traceback:")}


# Global instance - initialized once when the module is imported
vector_store_service = VectorStoreService()