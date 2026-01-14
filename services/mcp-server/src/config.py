from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_CHAT_MODEL: str = "mistral"
    OLLAMA_EMBED_MODEL: str = "nomic-embed-text"
    
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    CORS_ORIGINS: str = "http://localhost:3000"
    SESSION_TTL_SECONDS: int = 3600
    
    class Config:
        env_file = Path(__file__).resolve().parents[3] / ".env"
        extra = "ignore"


settings = Settings()
