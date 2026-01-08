import logging
from typing import AsyncGenerator, List, Tuple, Union
from ..kb.search import search_knowledge_base
from ..ollama.client import ollama_client
from .sessions import session_store
from .prompts import SYSTEM_PROMPT, REFUSAL_MESSAGE, build_rag_prompt

logger = logging.getLogger(__name__)

# Training-related keywords for topic filtering
TRAINING_KEYWORDS = [
    "train", "workout", "exercise", "muscle", "strength", "gym",
    "weight", "rep", "set", "program", "routine", "lift", "squat",
    "deadlift", "bench", "press", "curl", "hypertrophy", "bulk",
    "cut", "protein", "recovery", "sleep", "rest", "injury",
    "form", "technique", "progression", "split", "cardio", "warmup",
    "stretching", "mobility", "bodybuilding", "powerlifting", "fitness",
    "gains", "pump", "volume", "intensity", "failure", "drop set",
    "superset", "compound", "isolation", "barbell", "dumbbell", "cable",
    "machine", "free weight", "calisthenics", "pull", "push", "leg",
    "back", "chest", "shoulder", "bicep", "tricep", "core", "abs",
    "glute", "hamstring", "quad", "calf", "forearm", "grip",
    # French keywords
    "entrainement", "musculation", "exercice", "programme", "séance",
    "récupération", "nutrition", "protéine", "masse", "sèche",
    "poids", "haltère", "barre", "série", "répétition"
]


async def is_topic_allowed(message: str) -> bool:
    """Check if the topic is training-related using keyword heuristics."""
    message_lower = message.lower()
    
    # Allow if contains training keywords
    if any(kw in message_lower for kw in TRAINING_KEYWORDS):
        return True
    
    # Allow short messages (likely follow-ups, greetings, or clarifications)
    if len(message.split()) < 6:
        return True
    
    return False


async def chat_completion(
    session_id: str,
    user_message: str,
    stream: bool = False
) -> Union[AsyncGenerator[str, None], Tuple[str, List[dict]]]:
    """Process chat with RAG and return response with citations."""
    
    # Topic check
    if not await is_topic_allowed(user_message):
        if stream:
            async def stream_refusal():
                yield REFUSAL_MESSAGE
            return stream_refusal(), []
        return REFUSAL_MESSAGE, []
    
    # Get conversation history
    history = session_store.get_history(session_id)
    
    # Search knowledge base
    kb_results = await search_knowledge_base(user_message, k=6)
    
    # Build context from KB results
    context_chunks = [r["chunk_text"] for r in kb_results]
    sources = [
        {"title": r.get("document_title", ""), "url": r.get("document_url", "")} 
        for r in kb_results
    ]
    # Remove duplicates while preserving order
    seen_urls = set()
    unique_sources = []
    for s in sources:
        if s["url"] and s["url"] not in seen_urls:
            seen_urls.add(s["url"])
            unique_sources.append(s)
    sources = unique_sources[:5]  # Top 5 unique sources
    
    # Build messages for Ollama
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    if context_chunks:
        rag_context = build_rag_prompt(context_chunks, sources)
        messages.append({"role": "system", "content": rag_context})
    
    # Add conversation history
    messages.extend(history)
    messages.append({"role": "user", "content": user_message})
    
    # Save user message to history
    session_store.add_message(session_id, "user", user_message)
    
    if stream:
        async def stream_response() -> AsyncGenerator[str, None]:
            full_response = ""
            try:
                async for chunk in ollama_client.chat_stream(messages):
                    full_response += chunk
                    yield chunk
            finally:
                # Save assistant response after streaming completes
                if full_response:
                    session_store.add_message(session_id, "assistant", full_response)
        
        return stream_response(), sources
    else:
        response = await ollama_client.chat(messages)
        session_store.add_message(session_id, "assistant", response)
        return response, sources
