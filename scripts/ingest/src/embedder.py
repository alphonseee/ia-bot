import httpx
import logging
from typing import List
from .config import settings

logger = logging.getLogger(__name__)


async def generate_embedding(text: str) -> List[float]:
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/embeddings",
                json={
                    "model": settings.OLLAMA_EMBED_MODEL,
                    "prompt": text
                }
            )
            response.raise_for_status()
            return response.json()["embedding"]
    except httpx.HTTPError as e:
        logger.error(f"Embedding generation failed: {e}")
        raise


async def batch_embeddings(texts: List[str], batch_size: int = 10) -> List[List[float]]:
    embeddings = []
    total = len(texts)
    
    for i, text in enumerate(texts):
        embedding = await generate_embedding(text)
        embeddings.append(embedding)
        
        if (i + 1) % batch_size == 0:
            logger.info(f"Embedded {i + 1}/{total} chunks")
    
    return embeddings
