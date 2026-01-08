from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_EMBED_MODEL: str = "nomic-embed-text"
    
    # Crawl settings
    MAX_PAGES_PER_DOMAIN: int = 50
    MAX_DEPTH: int = 2
    REQUEST_DELAY_SECONDS: float = 1.5
    USER_AGENT: str = "TrainingCoachBot/1.0 (Educational; Respectful Crawler)"
    
    # Chunking
    CHUNK_SIZE_TOKENS: int = 1000
    CHUNK_OVERLAP_TOKENS: int = 150
    
    class Config:
        env_file = ".env"


settings = Settings()


# ============================================
# SEED URLs TO CRAWL - FILL THIS LIST MANUALLY
# ============================================
# Add training/bodybuilding content sites here.
# Example:
#   "https://www.strongerbyscience.com/",
#   "https://www.t-nation.com/",
# ============================================

SEED_URLS: List[str] = [
    # Add your URLs here, one per line:
    "https://www.docteur-fitness.com/",
    "https://www.fitadium.com/",
    "https://www.superphysique.org/",
]
