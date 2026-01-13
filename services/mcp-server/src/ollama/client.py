import httpx
import json
import logging
from typing import AsyncGenerator, List
from ..config import settings

logger = logging.getLogger(__name__)


class OllamaClient:
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.chat_model = settings.OLLAMA_CHAT_MODEL
        self.embed_model = settings.OLLAMA_EMBED_MODEL
    
    async def chat(self, messages: List[dict]) -> str:
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/chat",
                    json={
                        "model": self.chat_model,
                        "messages": messages,
                        "stream": False
                    }
                )
                response.raise_for_status()
                return response.json()["message"]["content"]
        except httpx.HTTPError as e:
            logger.error(f"Ollama chat error: {e}")
            raise RuntimeError(f"Failed to get response from Ollama: {e}")
    
    async def chat_stream(self, messages: List[dict]) -> AsyncGenerator[str, None]:
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/api/chat",
                    json={
                        "model": self.chat_model,
                        "messages": messages,
                        "stream": True
                    }
                ) as response:
                    async for line in response.aiter_lines():
                        if line:
                            try:
                                data = json.loads(line)
                                if "message" in data and "content" in data["message"]:
                                    yield data["message"]["content"]
                            except json.JSONDecodeError:
                                continue
        except httpx.HTTPError as e:
            logger.error(f"Ollama stream error: {e}")
            raise RuntimeError(f"Failed to stream from Ollama: {e}")
    
    async def embed(self, text: str) -> List[float]:
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/embeddings",
                    json={
                        "model": self.embed_model,
                        "prompt": text
                    }
                )
                response.raise_for_status()
                return response.json()["embedding"]
        except httpx.HTTPError as e:
            logger.error(f"Ollama embedding error: {e}")
            raise RuntimeError(f"Failed to generate embedding: {e}")


ollama_client = OllamaClient()
