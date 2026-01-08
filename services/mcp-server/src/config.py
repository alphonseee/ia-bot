from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Ollama
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_CHAT_MODEL: str = "mistral"
    OLLAMA_EMBED_MODEL: str = "nomic-embed-text"
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # Server
    CORS_ORIGINS: str = "http://localhost:3000"
    SESSION_TTL_SECONDS: int = 3600  # 1 hour
    
    class Config:
        env_file = ".env"


settings = Settings()
