# IronCoach AI - Strength Training Assistant

An AI-powered bodybuilding and strength training coach built with Next.js, FastAPI, and RAG (Retrieval-Augmented Generation).

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────┐
│   Next.js App   │────▶│  FastAPI MCP Server  │────▶│   Ollama    │
│   (Frontend)    │     │  (Backend + RAG)     │     │  (LLM/Embed)│
└─────────────────┘     └──────────────────────┘     └─────────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │  Supabase PostgreSQL │
                        │  (pgvector)          │
                        └──────────────────────┘
```

### Data Flow

1. **Ingestion (one-time)**: Playwright crawls sites → Extract text → Chunk → Embed via Ollama → Store in Supabase
2. **Chat (runtime)**: User query → Embed query → Vector search → RAG prompt → Ollama completion → Stream response

## Prerequisites

- **Node.js 20+** LTS
- **Python 3.11+**
- **pnpm** (`npm install -g pnpm`)
- **Ollama** running locally with models:
  - `mistral` (chat)
  - `nomic-embed-text` (embeddings)
- **Supabase** project with pgvector enabled

## Quick Start

### 1. Clone and Setup

```bash
git clone <repo-url>
cd ia-bot

# Install frontend dependencies
pnpm install
```

### 2. Setup Backend (MCP Server)

```powershell
cd services/mcp-server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Setup Ingestion Script

```powershell
cd scripts/ingest
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
```

### 4. Configure Environment

```bash
# Copy env examples
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp services/mcp-server/.env.example services/mcp-server/.env
cp scripts/ingest/.env.example scripts/ingest/.env
```

Edit each `.env` file with your Supabase credentials:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_KEY` - Your anon key (or service_role for ingestion)

### 5. Setup Ollama Models

```bash
ollama pull mistral
ollama pull nomic-embed-text
```

### 6. Database Setup

Run the migration in Supabase SQL Editor:
- Open `supabase/migrations/20260108000000_init.sql`
- Execute in Supabase Dashboard → SQL Editor

### 7. Run Ingestion (Optional)

Edit `scripts/ingest/src/config.py` to add seed URLs:

```python
SEED_URLS = [
    "https://www.example-training-site.com/",
]
```

Then run:

```powershell
cd scripts/ingest
.venv\Scripts\activate
python -m src.main
```

### 8. Start Development Servers

**Terminal 1 - Backend:**
```powershell
cd services/mcp-server
.venv\Scripts\activate
uvicorn src.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
pnpm dev
```

Visit http://localhost:3000

## Project Structure

```
ia-bot/
├── apps/web/              # Next.js 14 frontend
│   ├── src/app/           # App Router pages
│   ├── src/components/    # React components
│   └── src/lib/           # Utilities & MCP client
├── services/mcp-server/   # FastAPI backend
│   └── src/
│       ├── mcp/           # JSON-RPC router
│       ├── chat/          # RAG + sessions
│       ├── kb/            # Knowledge base search
│       └── ollama/        # Ollama client
├── scripts/ingest/        # Data ingestion pipeline
│   └── src/
│       ├── crawler.py     # Playwright crawler
│       ├── chunker.py     # Text chunking
│       ├── embedder.py    # Ollama embeddings
│       └── db.py          # Supabase client
└── supabase/migrations/   # Database schema
```

## API Reference

### Health Check
```bash
curl http://localhost:8000/health
```

### List Tools
```bash
curl -X POST http://localhost:8000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}'
```

### Search Knowledge Base
```bash
curl -X POST http://localhost:8000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"2",
    "method":"tools/call",
    "params":{
      "name":"search_knowledge_base",
      "arguments":{"query":"squat technique","k":5}
    }
  }'
```

### Chat (Non-Streaming)
```bash
curl -X POST http://localhost:8000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"3",
    "method":"chat",
    "params":{
      "session_id":"test-123",
      "message":"How do I improve my bench press?",
      "stream":false
    }
  }'
```

### Chat (SSE Streaming)
```bash
curl "http://localhost:8000/mcp/stream?session_id=test-123&message=Best%20exercises%20for%20back"
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | FastAPI, Python 3.11+ |
| LLM | Ollama (Mistral for chat, nomic-embed-text for embeddings) |
| Database | Supabase PostgreSQL + pgvector |
| Scraping | Playwright |
| Protocol | MCP-like JSON-RPC over HTTP with SSE streaming |

## Features

- **RAG-Enhanced Chat**: Responses cite sources from the knowledge base
- **SSE Streaming**: Real-time token streaming for responsive UX
- **Session Memory**: Server-side conversation history with TTL
- **Topic Filtering**: Politely refuses off-topic questions
- **Multi-language**: Responds in the user's language
- **Evidence-Based**: Crawled from trusted training resources

## License

MIT
