import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .mcp.router import router as mcp_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Training Coach MCP Server",
    description="Serveur MCP pour assistant musculation/entraînement de force",
    version="1.0.0"
)

origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mcp_router)


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "mcp-server"}


@app.on_event("startup")
async def startup_event():
    logger.info("MCP Server starting up...")
    logger.info(f"CORS origins: {origins}")
    logger.info(f"Ollama URL: {settings.OLLAMA_BASE_URL}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
