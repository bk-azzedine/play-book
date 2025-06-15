#!/usr/bin/env python3
"""
ChromaDB Document Viewer
A command-line tool to view and explore documents stored in ChromaDB.
"""

import argparse
import json
import sys
from typing import List, Dict, Any, Optional
import chromadb
from chromadb.utils import embedding_functions
import pandas as pd
from tabulate import tabulate


class ChromaDBViewer:
    def __init__(self, host: str = 'localhost', port: int = 8001, collection_name: str = "documents_embeddings"):
        self.host = host
        self.port = port
        self.collection_name = collection_name
        self.client = None
        self.collection = None

        try:
            self.client = chromadb.HttpClient(host=self.host, port=self.port)
            self.collection = self.client.get_collection(name=self.collection_name)
            print(f"✅ Connected to ChromaDB at {host}:{port}")
            print(f"✅ Collection '{collection_name}' loaded successfully")
        except Exception as e:
            print(f"❌ Failed to connect to ChromaDB: {e}")
            sys.exit(1)

    def get_collection_info(self):
        """Get basic information about the collection"""
        try:
            count = self.collection.count()
            print(f"\n📊 Collection Information:")
            print(f"   Name: {self.collection_name}")
            print(f"   Total chunks: {count}")
            return count
        except Exception as e:
            print(f"❌ Error getting collection info: {e}")
            return 0

    def list_all_documents(self, limit: Optional[int] = None):
        """List all unique documents in the collection"""
        try:
            # Get all items
            results = self.collection.get(include=['metadatas'])

            if not results or not results['metadatas']:
                print("📭 No documents found in the collection.")
                return

            # Extract unique documents
            documents = {}
            for metadata in results['metadatas']:
                doc_id = metadata.get('document_id', 'Unknown')
                if doc_id not in documents:
                    documents[doc_id] = {
                        'title': metadata.get('title', 'Untitled'),
                        'organization': metadata.get('organization', ''),
                        'space': metadata.get('space', ''),
                        'authors': metadata.get('authors', ''),
                        'tags': metadata.get('tags', ''),
                        'total_chunks': metadata.get('total_chunks', 0),
                        'description': metadata.get('description', '')[:100] + '...' if len(
                            metadata.get('description', '')) > 100 else metadata.get('description', '')
                    }

            # Sort by title
            sorted_docs = sorted(documents.items(), key=lambda x: x[1]['title'])

            # Apply limit if specified
            if limit:
                sorted_docs = sorted_docs[:limit]

            print(f"\n📚 Documents in Collection ({len(sorted_docs)} shown):")
            print("=" * 80)

            table_data = []
            for doc_id, doc_info in sorted_docs:
                table_data.append([
                    doc_id[:20] + '...' if len(doc_id) > 20 else doc_id,
                    doc_info['title'][:30] + '...' if len(doc_info['title']) > 30 else doc_info['title'],
                    doc_info['organization'],
                    doc_info['space'],
                    doc_info['total_chunks'],
                    doc_info['authors'][:20] + '...' if len(doc_info['authors']) > 20 else doc_info['authors']
                ])

            headers = ['Document ID', 'Title', 'Organization', 'Space', 'Chunks', 'Authors']
            print(tabulate(table_data, headers=headers, tablefmt='grid'))

        except Exception as e:
            print(f"❌ Error listing documents: {e}")

    def show_document_details(self, document_id: str):
        """Show detailed information about a specific document, including its reconstructed content."""
        try:
            results = self.collection.get(
                where={"document_id": document_id},
                include=['metadatas', 'documents']
            )

            if not results or not results['metadatas']:
                print(f"❌ Document '{document_id}' not found.")
                return

            # Sort chunks by their index to reconstruct the document correctly
            sorted_chunks = sorted(
                zip(results['documents'], results['metadatas']),
                key=lambda x: x[1].get('chunk_index', 0)
            )

            full_content_parts = []
            # Get primary document metadata from the first chunk
            first_metadata = sorted_chunks[0][1] if sorted_chunks else {}

            for content_part, metadata_part in sorted_chunks:
                full_content_parts.append(content_part)

            # Reconstruct the full content
            full_content = "\n\n".join(full_content_parts)


            print(f"\n📄 Document Details: {document_id}")
            print("=" * 60)
            print(f"Title: {first_metadata.get('title', 'Untitled')}")
            print(f"Description: {first_metadata.get('description', 'No description')}")
            print(f"Organization: {first_metadata.get('organization', 'N/A')}")
            print(f"Space: {first_metadata.get('space', 'N/A')}")
            print(f"Authors: {first_metadata.get('authors', 'N/A')}")
            print(f"Tags: {first_metadata.get('tags', 'N/A')}")
            print(f"Total Chunks: {len(results['metadatas'])}")

            print(f"\n📝 Full Document Content:")
            print("-" * 60)
            print(full_content)
            print("-" * 60) # Visual separator for content end

        except Exception as e:
            print(f"❌ Error showing document details: {e}")

    def search_documents(self, query: str, n_results: int = 5):
        """Search documents using similarity search"""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results,
                include=['metadatas', 'documents', 'distances']
            )

            if not results or not results['metadatas'][0]:
                print(f"🔍 No results found for query: '{query}'")
                return

            print(f"\n🔍 Search Results for: '{query}'")
            print("=" * 60)

            for i, (metadata, content, distance) in enumerate(zip(
                    results['metadatas'][0],
                    results['documents'][0],
                    results['distances'][0]
            )):
                print(f"Result {i + 1} (Similarity: {1 - distance:.3f}):")
                print(f"  Document: {metadata.get('title', 'Untitled')}")
                print(f"  Organization: {metadata.get('organization', 'N/A')}")
                print(f"  Content: {content[:300]}{'...' if len(content) > 300 else ''}")
                print("-" * 40)

        except Exception as e:
            print(f"❌ Error searching documents: {e}")

    def export_to_json(self, output_file: str, document_id: Optional[str] = None):
        """Export documents to JSON file"""
        try:
            if document_id:
                results = self.collection.get(
                    where={"document_id": document_id},
                    include=['metadatas', 'documents']
                )
            else:
                results = self.collection.get(include=['metadatas', 'documents'])

            if not results:
                print("❌ No data to export.")
                return

            export_data = {
                'collection_name': self.collection_name,
                'total_items': len(results['metadatas']),
                'items': []
            }

            for metadata, content in zip(results['metadatas'], results['documents']):
                export_data['items'].append({
                    'metadata': metadata,
                    'content': content
                })

            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(export_data, f, indent=2, ensure_ascii=False)

            print(f"✅ Data exported to {output_file}")
            print(f"   Exported {len(export_data['items'])} items")

        except Exception as e:
            print(f"❌ Error exporting data: {e}")

    def get_statistics(self):
        """Get detailed statistics about the collection"""
        try:
            results = self.collection.get(include=['metadatas'])

            if not results or not results['metadatas']:
                print("📊 No data available for statistics.")
                return

            # Analyze metadata
            organizations = {}
            spaces = {}
            authors = {}
            total_chunks = 0
            unique_docs = set()

            for metadata in results['metadatas']:
                # Count organizations
                org = metadata.get('organization', 'Unknown')
                organizations[org] = organizations.get(org, 0) + 1

                # Count spaces
                space = metadata.get('space', 'Unknown')
                spaces[space] = spaces.get(space, 0) + 1

                # Count authors
                author = metadata.get('authors', 'Unknown')
                if author and author.strip():
                    authors[author] = authors.get(author, 0) + 1

                # Count unique documents
                doc_id = metadata.get('document_id')
                if doc_id:
                    unique_docs.add(doc_id)

                total_chunks += 1

            print(f"\n📊 Collection Statistics:")
            print("=" * 50)
            print(f"Total Chunks: {total_chunks}")
            print(f"Unique Documents: {len(unique_docs)}")
            print(f"Average Chunks per Document: {total_chunks / max(len(unique_docs), 1):.1f}")

            print(f"\n🏢 Top Organizations:")
            for org, count in sorted(organizations.items(), key=lambda x: x[1], reverse=True)[:5]:
                print(f"  {org}: {count} chunks")

            print(f"\n📁 Top Spaces:")
            for space, count in sorted(spaces.items(), key=lambda x: x[1], reverse=True)[:5]:
                print(f"  {space}: {count} chunks")

            print(f"\n👥 Top Authors:")
            for author, count in sorted(authors.items(), key=lambda x: x[1], reverse=True)[:5]:
                print(f"  {author}: {count} chunks")

        except Exception as e:
            print(f"❌ Error getting statistics: {e}")

    def delete_all_documents(self):
        """Deletes all documents from the collection after confirmation."""
        try:
            count_before_delete = self.collection.count()
            if count_before_delete == 0:
                print("📭 Collection is already empty. Nothing to delete.")
                return

            print(f"\n⚠️ WARNING: You are about to delete ALL {count_before_delete} documents from the collection '{self.collection_name}'.")
            confirmation = input("Type 'DELETE' to confirm: ")

            if confirmation == 'DELETE':
                self.client.delete_collection(name=self.collection_name)
                # Re-create the collection to ensure it's usable again
                self.collection = self.client.create_collection(name=self.collection_name)
                print(f"✅ Successfully deleted all documents from '{self.collection_name}'. Collection is now empty.")
            else:
                print("Action cancelled. No documents were deleted.")
        except Exception as e:
            print(f"❌ Error deleting all documents: {e}")


def main():
    parser = argparse.ArgumentParser(description='ChromaDB Document Viewer')
    parser.add_argument('--host', default='localhost', help='ChromaDB host (default: localhost)')
    parser.add_argument('--port', type=int, default=8001, help='ChromaDB port (default: 8001)')
    parser.add_argument('--collection', default='documents_embeddings',
                        help='Collection name (default: documents_embeddings)')

    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # List command
    list_parser = subparsers.add_parser('list', help='List all documents')
    list_parser.add_argument('--limit', type=int, help='Limit number of documents to show')

    # Show command (renamed to 'details' for clarity on content)
    details_parser = subparsers.add_parser('details', help='Show document details and content')
    details_parser.add_argument('document_id', help='Document ID to show details for')

    # New 'view' command (points to the same functionality as 'details')
    view_parser = subparsers.add_parser('view', help='View a document\'s full content by ID')
    view_parser.add_argument('document_id', help='Document ID to view')

    # Search command
    search_parser = subparsers.add_parser('search', help='Search documents')
    search_parser.add_argument('query', help='Search query')
    search_parser.add_argument('--limit', type=int, default=5, help='Number of results (default: 5)')

    # Export command
    export_parser = subparsers.add_parser('export', help='Export documents to JSON')
    export_parser.add_argument('output_file', help='Output JSON file')
    export_parser.add_argument('--document-id', help='Export specific document only')

    # Stats command
    subparsers.add_parser('stats', help='Show collection statistics')

    # Info command
    subparsers.add_parser('info', help='Show collection information')

    # Delete All command
    delete_all_parser = subparsers.add_parser('delete-all', help='Delete all documents from the collection (requires confirmation)')


    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    # Initialize viewer
    viewer = ChromaDBViewer(args.host, args.port, args.collection)

    # Execute command
    if args.command == 'info':
        viewer.get_collection_info()
    elif args.command == 'list':
        viewer.list_all_documents(args.limit)
    elif args.command == 'details' or args.command == 'view': # Handle both 'details' and 'view'
        viewer.show_document_details(args.document_id)
    elif args.command == 'search':
        viewer.search_documents(args.query, args.limit)
    elif args.command == 'export':
        viewer.export_to_json(args.output_file, getattr(args, 'document_id', None))
    elif args.command == 'stats':
        viewer.get_statistics()
    elif args.command == 'delete-all':
        viewer.delete_all_documents()


if __name__ == '__main__':
    main()