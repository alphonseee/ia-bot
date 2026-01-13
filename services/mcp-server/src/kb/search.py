import logging
from supabase import create_client
from ..config import settings
from ..ollama.client import ollama_client

logger = logging.getLogger(__name__)

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


async def search_knowledge_base(query: str, k: int = 8, min_similarity: float = 0.5) -> list:
    try:
        query_embedding = await ollama_client.embed(query)
        
        result = supabase.rpc(
            "match_chunks",
            {
                "query_embedding": query_embedding,
                "match_count": k,
                "min_similarity": min_similarity
            }
        ).execute()
        
        return result.data or []
    
    except Exception as e:
        logger.error(f"Knowledge base search error: {e}")
        return []
