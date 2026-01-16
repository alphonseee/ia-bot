# 🔥 Hephaestus

**Assistant IA Coach Musculation** — Projet Epitech 4ème année


---

## 📋 Sommaire

- [Présentation](#-présentation)
- [Architecture](#-architecture)
- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Lancement](#-lancement)
- [Ingestion des données](#-ingestion-des-données)
- [Structure du projet](#-structure-du-projet)
- [API Reference](#-api-reference)
- [Fonctionnalités](#-fonctionnalités)
- [Équipe](#-équipe)

---

## 🎯 Présentation

**Hephaestus** est un assistant IA spécialisé dans la musculation et l'entraînement de force.

### Le problème

- L'information sur la musculation est fragmentée et souvent peu fiable
- Les coachs coûtent cher
- Les IA génériques (ChatGPT, etc.) hallucinent sur les sujets sportifs

### Notre solution

- Une IA spécialisée **uniquement** sur la musculation
- Une base de connaissances vérifiée (sites francophones de référence)
- Des réponses **sourcées** avec citations
- 100% local (Ollama), aucune donnée envoyée à des serveurs externes

### Comment ça marche ?

On utilise la technique **RAG** (Retrieval-Augmented Generation) :

1. On scrape des sites de musculation francophones
2. On découpe le contenu en chunks et on génère des embeddings (vecteurs)
3. Quand l'utilisateur pose une question, on cherche les chunks les plus pertinents
4. On injecte ce contexte dans le prompt du LLM
5. Le LLM génère une réponse basée sur des sources réelles

---

## 📐 Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────┐
│   Next.js App   │────▶│  FastAPI MCP Server  │────▶│   Ollama    │
│   (Frontend)    │◀────│  (Backend + RAG)     │◀────│  (Mistral)  │
└─────────────────┘     └──────────────────────┘     └─────────────┘
       SSE                         │
    streaming                      ▼
                        ┌──────────────────────┐
                        │  Supabase PostgreSQL │
                        │  + pgvector          │
                        └──────────────────────┘
```

### Flux de données

**Phase 1 — Ingestion (one-shot)**

```
Sites web ──▶ Playwright (crawl) ──▶ BeautifulSoup (extract)
                                              │
                                              ▼
Supabase ◀── Ollama (embed) ◀── tiktoken (chunk ~1000 tokens)
```

**Phase 2 — Chat (runtime)**

```
Question ──▶ Embed ──▶ Recherche vectorielle ──▶ Top 5 chunks
                                                      │
                                                      ▼
Réponse ◀── Ollama (Mistral) ◀── Prompt + contexte RAG
```

---

## 🧰 Stack technique

| Composant | Technologies |
|-----------|--------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| **Backend** | FastAPI, Python 3.11+, Pydantic |
| **LLM** | Ollama — Mistral (chat), nomic-embed-text (embeddings) |
| **Base de données** | Supabase PostgreSQL + pgvector (HNSW index) |
| **Scraping** | Playwright (headless browser), BeautifulSoup4 |
| **Protocole** | JSON-RPC over HTTP, SSE streaming |
| **Monorepo** | pnpm workspaces |

---

## 🛠 Prérequis

| Outil | Version | Installation |
|-------|---------|--------------|
| Node.js | 20+ LTS | [nodejs.org](https://nodejs.org) |
| Python | 3.11+ | [python.org](https://python.org) |
| pnpm | 8+ | `npm install -g pnpm` |
| Ollama | latest | [ollama.ai](https://ollama.ai) |
| Supabase | — | Compte gratuit sur [supabase.com](https://supabase.com) |

### Modèles Ollama requis

```bash
ollama pull mistral
ollama pull nomic-embed-text
```

---

## 🚀 Installation

### 1. Clone le repo

```bash
git clone https://github.com/alphonseee/hephaestus.git
cd ia-bot
```

### 2. Configuration environnement

```bash
cp .env.example .env
```

Édite `.env` avec tes credentials Supabase :

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### 3. Setup la base de données

Dans **Supabase Dashboard → SQL Editor**, exécute ce script :

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL UNIQUE,
    domain TEXT NOT NULL,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    content_text TEXT,
    content_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    token_count INTEGER,
    embedding VECTOR(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX chunks_embedding_idx ON chunks 
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX documents_hash_idx ON documents 
USING hash (content_hash);

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

### 4. Setup le backend

```powershell
cd services/mcp-server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 5. Setup le script d'ingestion

```powershell
cd scripts/ingest
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
```

### 6. Setup le frontend

```bash
cd apps/web
pnpm install
```

---

## ▶️ Lancement

**Terminal 1 — Backend**

```powershell
cd services/mcp-server
.venv\Scripts\activate
uvicorn src.main:app --reload --port 8000
```

**Terminal 2 — Frontend**

```bash
cd apps/web
pnpm dev
```

**Accès** : http://localhost:3000

---

## 📥 Ingestion des données

Avant d'utiliser l'IA, il faut remplir la knowledge base.

### 1. Configure les sources

Édite `scripts/ingest/src/config.py` :

```python
SEED_URLS = [
    "https://www.superphysique.org/articles/",
    "https://www.espace-musculation.com/",
    "https://www.musculaction.com/",
]
```

### 2. Lance le scraping

```powershell
cd scripts/ingest
.venv\Scripts\activate
python -m src.main
```

### Paramètres configurables

| Variable | Défaut | Description |
|----------|--------|-------------|
| `MAX_PAGES_PER_DOMAIN` | 50 | Nombre max de pages par site |
| `MAX_DEPTH` | 2 | Profondeur de crawl |
| `REQUEST_DELAY_SECONDS` | 1.5 | Délai entre requêtes (respectueux) |
| `CHUNK_SIZE_TOKENS` | 1000 | Taille des chunks |
| `CHUNK_OVERLAP_TOKENS` | 150 | Overlap entre chunks |

---

## 📁 Structure du projet

```
hephaestus/
├── .env                          # Variables d'environnement (centralisé)
├── .env.example                  # Template
├── package.json                  # Config pnpm workspace
├── pnpm-workspace.yaml
│
├── apps/
│   └── web/                      # Frontend Next.js
│       ├── src/
│       │   ├── app/              # Pages (App Router)
│       │   │   ├── page.tsx      # Landing page
│       │   │   └── chat/         # Interface chat
│       │   ├── components/       # Composants React
│       │   └── lib/              # Client MCP, utils
│       ├── package.json
│       └── tailwind.config.js
│
├── services/
│   └── mcp-server/               # Backend FastAPI
│       ├── src/
│       │   ├── main.py           # Entry point
│       │   ├── config.py         # Settings Pydantic
│       │   ├── models.py         # Schemas
│       │   ├── mcp/
│       │   │   ├── router.py     # Endpoints JSON-RPC + SSE
│       │   │   └── tools.py      # Tools MCP
│       │   ├── chat/
│       │   │   ├── service.py    # Logique RAG
│       │   │   ├── sessions.py   # Mémoire de session (TTL)
│       │   │   └── prompts.py    # System prompt
│       │   ├── kb/
│       │   │   └── search.py     # Recherche vectorielle
│       │   └── ollama/
│       │       └── client.py     # Client Ollama
│       └── requirements.txt
│
├── scripts/
│   └── ingest/                   # Pipeline d'ingestion
│       ├── src/
│       │   ├── main.py           # Orchestrateur
│       │   ├── config.py         # Config + SEED_URLS
│       │   ├── crawler.py        # Playwright
│       │   ├── extractor.py      # BeautifulSoup
│       │   ├── chunker.py        # tiktoken
│       │   ├── embedder.py       # Ollama embeddings
│       │   ├── robots.py         # Respect robots.txt
│       │   └── db.py             # Client Supabase
│       └── requirements.txt
│
└── supabase/
    └── migrations/               # Scripts SQL
```

---

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
      "arguments":{"query":"squat technique","k":5}
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
curl "http://localhost:8000/mcp/stream?session_id=test-123&message=Exercices%20dos"
```

---

## ✨ Fonctionnalités

| Feature | Description |
|---------|-------------|
| **RAG** | Réponses basées sur une knowledge base, avec sources citées |
| **Streaming SSE** | Affichage token par token en temps réel |
| **Mémoire de session** | Historique de conversation côté serveur (TTL 1h) |
| **Filtrage thématique** | Refuse les questions hors-sujet (politique, médical...) |
| **Anti-hallucination** | Prompt strict pour citer uniquement les sources KB |
| **100% local** | Tout tourne en local avec Ollama, pas d'API externe |
| **Respect robots.txt** | Le crawler respecte les règles des sites |

---

## 📄 Licence

MIT — Projet éducatif Epitech
