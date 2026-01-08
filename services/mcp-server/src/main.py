import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .mcp.router import router as mcp_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Training Coach MCP Server",
    description="MCP-like server for bodybuilding/strength training assistant",
    version="1.0.0"
)

# CORS configuration
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include MCP router
app.include_router(mcp_router)


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "mcp-server"}


@app.on_event("startup")
async def startup_event():
    logger.info("MCP Server starting up...")
    logger.info(f"CORS origins: {origins}")
    logger.info(f"Ollama URL: {settings.OLLAMA_BASE_URL}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
