# 🏋️ IronCoach - Coach Musculation IA

Projet Epitech - Assistant IA spécialisé dans la musculation et le renforcement musculaire.

Stack : **Next.js** + **FastAPI** + **RAG** (Retrieval-Augmented Generation) + **Ollama**

## 📐 Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────┐
│   Next.js App   │────▶│  FastAPI MCP Server  │────▶│   Ollama    │
│   (Frontend)    │     │  (Backend + RAG)     │     │  (LLM local)│
└─────────────────┘     └──────────────────────┘     └─────────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │  Supabase PostgreSQL │
                        │  (pgvector)          │
                        └──────────────────────┘
```

### Comment ça marche ?

**Phase 1 - Ingestion (une seule fois)** :
1. Playwright crawl les sites de musculation
2. BeautifulSoup extrait le contenu texte
3. tiktoken découpe en chunks de ~1000 tokens
4. Ollama génère les embeddings (vecteurs 768D)
5. Stockage dans Supabase avec pgvector

**Phase 2 - Chat (runtime)** :
1. L'utilisateur pose une question
2. On embed la question → vecteur
3. Recherche des chunks les plus similaires (cosine similarity)
4. On injecte le contexte dans le prompt
5. Ollama génère la réponse en streaming
6. Le frontend affiche en temps réel + sources

## 🛠️ Prérequis

- **Node.js 20+** (LTS)
- **Python 3.11+**
- **pnpm** → `npm install -g pnpm`
- **Ollama** avec les modèles :
  ```bash
  ollama pull mistral
  ollama pull nomic-embed-text
  ```
- **Supabase** avec l'extension pgvector activée

## 🚀 Installation

### 1. Clone le repo

```bash
git clone https://github.com/alphonseee/ia-bot.git
cd ia-bot
```

### 2. Configure l'environnement

Copie le fichier d'exemple et remplis tes credentials :

```bash
cp .env.example .env
```

Modifie `.env` avec tes infos Supabase :
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=ta-anon-key
```

### 3. Setup le backend (MCP Server)

```powershell
cd services/mcp-server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Setup le script d'ingestion

```powershell
cd scripts/ingest
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
```

### 5. Setup le frontend

```bash
cd apps/web
pnpm install
```

### 6. Setup la base de données

Va dans Supabase Dashboard → SQL Editor et exécute :

```sql
-- Active pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Table sources (sites scrapés)
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL UNIQUE,
    domain TEXT NOT NULL,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table documents (pages)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    content_text TEXT,
    content_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table chunks (morceaux de texte + embeddings)
CREATE TABLE chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    token_count INTEGER,
    embedding VECTOR(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour la recherche vectorielle
CREATE INDEX chunks_embedding_idx ON chunks 
USING hnsw (embedding vector_cosine_ops);

-- Index pour éviter les doublons
CREATE INDEX documents_hash_idx ON documents 
USING hash (content_hash);

-- Fonction de recherche
CREATE OR REPLACE FUNCTION match_chunks(
    query_embedding VECTOR(768),
    match_count INT DEFAULT 5,
    min_similarity FLOAT DEFAULT 0.5
)
RETURNS TABLE (
    chunk_id UUID,
    chunk_text TEXT,
    document_url TEXT,
    document_title TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id AS chunk_id,
        c.chunk_text,
        d.url AS document_url,
        d.title AS document_title,
        1 - (c.embedding <=> query_embedding) AS similarity
    FROM chunks c
    JOIN documents d ON c.document_id = d.id
    WHERE 1 - (c.embedding <=> query_embedding) >= min_similarity
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
```

## ▶️ Lancement

### Terminal 1 - Backend

```powershell
cd services/mcp-server
.venv\Scripts\activate
uvicorn src.main:app --reload --port 8000
```

### Terminal 2 - Frontend

```bash
cd apps/web
pnpm dev
```

Ouvre http://localhost:3000 🎉

## 📥 Ingestion des données

Pour remplir la knowledge base, modifie les URLs dans `scripts/ingest/src/config.py` :

```python
SEED_URLS = [
    "https://www.superphysique.org/articles/",
    "https://www.espace-musculation.com/",
    # Ajoute tes sites ici
]
```

Puis lance :

```powershell
cd scripts/ingest
.venv\Scripts\activate
python -m src.main
```

Le script va :
- Crawler jusqu'à 50 pages par domaine (configurable)
- Respecter le robots.txt
- Attendre 1.5s entre chaque requête
- Chunker et embedder tout le contenu

## 📁 Structure du projet

```
ia-bot/
├── .env                      # Config centralisée (un seul fichier!)
├── apps/web/                 # Frontend Next.js 14
│   ├── src/app/              # Pages (App Router)
│   ├── src/components/       # Composants React
│   └── src/lib/              # Client MCP + utils
├── services/mcp-server/      # Backend FastAPI
│   └── src/
│       ├── mcp/              # Router JSON-RPC
│       ├── chat/             # RAG + sessions + prompts
│       ├── kb/               # Recherche vectorielle
│       └── ollama/           # Client Ollama
├── scripts/ingest/           # Pipeline d'ingestion
│   └── src/
│       ├── crawler.py        # Playwright
│       ├── extractor.py      # BeautifulSoup
│       ├── chunker.py        # tiktoken
│       ├── embedder.py       # Ollama embeddings
│       └── db.py             # Supabase client
└── supabase/                 # Migrations SQL
```

## 🔌 API Reference

### Health Check
```bash
curl http://localhost:8000/health
```

### Lister les tools MCP
```bash
curl -X POST http://localhost:8000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}'
```

### Recherche dans la KB
```bash
curl -X POST http://localhost:8000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"2",
    "method":"tools/call",
    "params":{
      "name":"search_knowledge_base",
      "arguments":{"query":"technique squat","k":5}
    }
  }'
```

### Chat (sans streaming)
```bash
curl -X POST http://localhost:8000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"3",
    "method":"chat",
    "params":{
      "session_id":"test-123",
      "message":"Comment améliorer mon développé couché ?",
      "stream":false
    }
  }'
```

### Chat (SSE streaming)
```bash
curl "http://localhost:8000/mcp/stream?session_id=test-123&message=Meilleurs%20exercices%20dos"
```

## 🧰 Stack technique

| Composant | Techno |
|-----------|--------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | FastAPI, Python 3.11+ |
| LLM | Ollama (Mistral chat, nomic-embed-text embeddings) |
| BDD | Supabase PostgreSQL + pgvector |
| Scraping | Playwright + BeautifulSoup4 |
| Protocole | JSON-RPC over HTTP + SSE streaming |

## ✨ Features

- **RAG** : Les réponses citent les sources de la knowledge base
- **Streaming SSE** : Affichage token par token en temps réel
- **Mémoire de session** : Historique de conversation côté serveur (TTL 1h)
- **Filtrage thématique** : Refuse poliment les questions hors-sujet
- **100% local** : Tout tourne sur ta machine, pas d'API externe

## 📄 License

MIT
