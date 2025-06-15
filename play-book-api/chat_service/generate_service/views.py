from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from embed_service.vectorstore_service import vector_store_service

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""


@csrf_exempt
def generate(request):
    if request.method == "POST":
        try:
            # Ensure JSON content type
            if request.content_type != "application/json":
                return JsonResponse({"error": "Unsupported content type. Use application/json."}, status=415)

            # Parse JSON body
            data = json.loads(request.body)
            text = data.get("text", "")

            if not text:
                return JsonResponse({"error": "No text provided"}, status=400)

            # Search for related chunks using vector store
            related_chunks = vector_store_service.search_documents_with_langchain(text)

            if not related_chunks:
                return JsonResponse({"error": "No relevant context found"}, status=404)

            # Format context from retrieved chunks
            # related_chunks is a list of tuples: [(Document, score), (Document, score), ...]
            context_parts = []
            for doc, score in related_chunks:
                # Extract text content from Document object
                content = doc.page_content if hasattr(doc, 'page_content') else str(doc)
                context_parts.append(content)

            # Join all context parts
            context = "\n\n".join(context_parts)

            # Format the prompt using the template
            formatted_prompt = PROMPT_TEMPLATE.format(
                context=context,
                question=text
            )

            # Prepare request to Ollama
            mistral_payload = {
                "model": "llama3:latest",
                "messages": [
                    {"role": "user", "content": formatted_prompt}
                ],
                "stream": False
            }

            mistral_response = requests.post(
                "http://localhost:11434/api/chat",
                json=mistral_payload,
                headers={"Content-Type": "application/json"},
                timeout=60  # 60 second timeout
            )

            if mistral_response.status_code != 200:
                return JsonResponse({
                    "error": f"Ollama API error: {mistral_response.status_code}"
                }, status=500)

            ollama_data = mistral_response.json()
            answer = ollama_data.get("message", {}).get("content", "")

            return JsonResponse({
                "answer": answer,
                "context_used": len(related_chunks),
                "chunks": [
                    {
                        "content": doc.page_content if hasattr(doc, 'page_content') else str(doc),
                        "score": score
                    }
                    for doc, score in related_chunks
                ]
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)
        except requests.exceptions.Timeout:
            return JsonResponse({"error": "Request to LLM timed out"}, status=408)
        except requests.exceptions.ConnectionError:
            return JsonResponse({"error": "Could not connect to LLM service"}, status=503)
        except Exception as e:
            # Handle unexpected errors
            return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)