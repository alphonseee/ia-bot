# Documentation Technique - Hephaestus

**Projet Epitech 4ème année - IA BOT**  
**Date :** Janvier 2026

---

## Table des matières

1. [Présentation générale du projet](#1-présentation-générale-du-projet)
2. [Architecture globale](#2-architecture-globale)
3. [Frontend](#3-frontend)
4. [Backend](#4-backend)
5. [Serveur MCP et Tooling](#5-serveur-mcp-et-tooling)
6. [Limites du projet et améliorations](#6-limites-du-projet-et-améliorations)
7. [Conclusion](#7-conclusion)

---

## 1. Présentation générale du projet

### 1.1 Contexte

Dans le cadre du module IA de 4ème année à Epitech, nous avons développé **Hephaestus**, un assistant conversationnel spécialisé dans le domaine de la musculation et du fitness. Le projet s'inscrit dans la tendance actuelle des systèmes RAG (Retrieval-Augmented Generation) qui permettent d'augmenter les capacités des LLM avec des connaissances externes vérifiables.

Le nom "Hephaestus" fait référence au dieu grec du feu et de la forge, symbolisant la transformation et le travail sur soi à travers l'entraînement physique.

### 1.2 Objectif

L'objectif principal est de concevoir un chatbot capable de :

- **Répondre à des questions** sur l'entraînement, la nutrition sportive et les exercices de musculation
- **Générer des programmes** personnalisés adaptés au profil de l'utilisateur (débutant, intermédiaire, avancé)
- **Citer ses sources** de manière fiable grâce à une base de connaissances alimentée par du contenu web scrapé
- **Refuser les sujets hors périmètre** pour maintenir la spécialisation du bot

### 1.3 Périmètre fonctionnel

| Fonctionnalité | Description |
|----------------|-------------|
| Chat conversationnel | Interface de discussion en temps réel avec streaming des réponses |
| RAG (Retrieval-Augmented Generation) | Enrichissement des réponses avec des sources vérifiables |
| Gestion de session | Conservation de l'historique de conversation côté serveur |
| Topic filtering | Filtrage automatique des questions hors sujet (politique, médecine générale, etc.) |
| Programmes adaptatifs | Génération de programmes selon le niveau et les contraintes de l'utilisateur |
| Scraping automatisé | Pipeline d'ingestion de contenu depuis des sites spécialisés |

**Hors périmètre :** Authentification utilisateur, stockage persistant des conversations, conseil médical.

---

## 2. Architecture globale

### 2.1 Vue d'ensemble

Le projet suit une architecture **monorepo** gérée avec pnpm workspaces, séparant clairement les responsabilités entre trois composants principaux.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              UTILISATEUR                                     │
│                           (Navigateur Web)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 15)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Landing   │  │    Chat     │  │ MCP Client  │  │   Session   │        │
│  │    Page     │  │  Interface  │  │   (HTTP)    │  │  (localStorage)      │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                         Port 3000                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP JSON-RPC + SSE
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND MCP SERVER (FastAPI)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Router    │  │    Chat     │  │   Session   │  │     KB      │        │
│  │  JSON-RPC   │  │   Service   │  │   Manager   │  │   Search    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                         Port 8000                                            │
└─────────────────────────────────────────────────────────────────────────────┘
              │                                           │
              │ HTTP                                      │ HTTP
              ▼                                           ▼
┌────────────────────────┐                 ┌────────────────────────────────┐
│      OLLAMA (LLM)      │                 │    SUPABASE (PostgreSQL)       │
│  ┌──────────────────┐  │                 │  ┌──────────────────────────┐  │
│  │  mistral (chat)  │  │                 │  │   pgvector (embeddings)  │  │
│  │  nomic-embed-text│  │                 │  │   sources, documents,    │  │
│  │   (embeddings)   │  │                 │  │   chunks tables          │  │
│  └──────────────────┘  │                 │  └──────────────────────────┘  │
│       Port 11434       │                 │         Cloud/Local            │
└────────────────────────┘                 └────────────────────────────────┘
```

### 2.2 Flux de données

#### Flux de conversation (requête utilisateur)

```
1. Utilisateur tape un message
         │
         ▼
2. Frontend envoie POST /mcp/stream
   {method: "chat", params: {session_id, message}}
         │
         ▼
3. Backend vérifie le topic (filtrage)
         │
         ├─── Hors sujet ──► Réponse de refus
         │
         ▼
4. Génération embedding du message (Ollama nomic-embed-text)
         │
         ▼
5. Recherche vectorielle dans Supabase (match_chunks RPC)
         │
         ▼
6. Construction du prompt RAG avec contexte
         │
         ▼
7. Appel streaming à Ollama (mistral)
         │
         ▼
8. SSE stream vers le frontend (tokens progressifs)
         │
         ▼
9. Affichage en temps réel + sources citées
```

#### Flux d'ingestion (scraping)

```
1. Définition des SEED_URLS dans config.py
         │
         ▼
2. Crawler Playwright parcourt les pages
   (respect robots.txt, délai entre requêtes)
         │
         ▼
3. Extraction du contenu (BeautifulSoup4)
         │
         ▼
4. Chunking intelligent (tiktoken, ~1000 tokens/chunk)
         │
         ▼
5. Génération embeddings (Ollama nomic-embed-text)
         │
         ▼
6. Stockage dans Supabase (sources → documents → chunks)
```

### 2.3 Structure du monorepo

```
ia-bot/
├── apps/
│   └── web/                    # Frontend Next.js
├── services/
│   └── mcp-server/             # Backend FastAPI
├── scripts/
│   └── ingest/                 # Pipeline de scraping
├── supabase/
│   └── migrations/             # Schéma SQL
├── .env                        # Variables d'environnement centralisées
├── pnpm-workspace.yaml         # Configuration monorepo
└── package.json                # Scripts racine
```

---

## 3. Frontend

### 3.1 Technologies utilisées

| Technologie | Version | Rôle |
|-------------|---------|------|
| Next.js | 15.x | Framework React avec App Router |
| React | 19.x | Bibliothèque UI |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 3.x | Framework CSS utility-first |
| Inter / JetBrains Mono | - | Typographies (Google Fonts) |

### 3.2 Organisation du code

```
apps/web/src/
├── app/
│   ├── globals.css          # Styles globaux + variables CSS
│   ├── layout.tsx           # Layout racine (metadata, fonts)
│   ├── page.tsx             # Landing page
│   └── chat/
│       └── page.tsx         # Interface de chat
├── components/
│   └── chat/
│       ├── ChatContainer.tsx    # Conteneur principal du chat
│       ├── ChatInput.tsx        # Zone de saisie
│       ├── MessageList.tsx      # Liste des messages
│       ├── MessageBubble.tsx    # Bulle de message individuelle
│       ├── LoadingIndicator.tsx # Indicateur de chargement
│       └── SourceCard.tsx       # Carte de citation
├── lib/
│   ├── mcp-client.ts        # Client HTTP pour le backend
│   └── utils.ts             # Utilitaires (getSessionId, cn)
└── types/
    └── index.ts             # Définitions TypeScript
```

### 3.3 Communication avec le backend

Le frontend communique avec le backend via un protocole **JSON-RPC over HTTP**, inspiré du Model Context Protocol (MCP).

**Endpoint principal :** `POST /mcp/stream`

```typescript
interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: string;
  params: Record<string, unknown>;
  id: string;
}
```

**Gestion du streaming :**

Le client utilise l'API `fetch` avec un `ReadableStream` pour consommer les événements SSE (Server-Sent Events) :

```typescript
const response = await fetch(`${baseUrl}/mcp/stream`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(request),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Parsing des événements SSE
}
```

**Gestion de session :**

Un `session_id` unique est généré côté client et stocké dans `localStorage`. Il est envoyé avec chaque requête pour maintenir le contexte de conversation.

---

## 4. Backend

### 4.1 Technologies et modèles utilisés

| Technologie | Version | Rôle |
|-------------|---------|------|
| FastAPI | 0.115.x | Framework web asynchrone |
| Uvicorn | 0.34.x | Serveur ASGI |
| Pydantic | 2.x | Validation des données |
| httpx | 0.28.x | Client HTTP asynchrone |
| sse-starlette | 2.2.x | Support Server-Sent Events |
| supabase-py | 2.x | Client Supabase |
| cachetools | 5.x | Cache TTL pour sessions |

**Modèles IA (Ollama) :**

| Modèle | Rôle | Caractéristiques |
|--------|------|------------------|
| mistral | Chat/Génération | LLM polyvalent, bon en français |
| nomic-embed-text | Embeddings | 768 dimensions, optimisé pour la recherche sémantique |

### 4.2 Logique de l'agent

L'agent suit un pipeline RAG (Retrieval-Augmented Generation) :

```python
async def process_chat(session_id: str, message: str):
    # 1. Vérification du topic
    if not is_topic_allowed(message):
        return "Je suis spécialisé dans l'entraînement..."
    
    # 2. Récupération de l'historique
    history = session_store.get(session_id, [])
    
    # 3. Recherche dans la base de connaissances
    chunks = await search_knowledge_base(message, limit=5)
    
    # 4. Construction du prompt enrichi
    prompt = build_rag_prompt(message, chunks)
    
    # 5. Génération avec contexte
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *history,
        {"role": "user", "content": prompt}
    ]
    
    # 6. Streaming de la réponse
    async for token in ollama.chat_stream(messages):
        yield token
```

**Filtrage des sujets :**

Le système utilise une liste de mots-clés autorisés pour déterminer si une question est dans le périmètre :

```python
TRAINING_KEYWORDS = [
    "musculation", "exercice", "programme", "entrainement",
    "poids", "série", "répétition", "muscle", "biceps",
    "dos", "pec", "épaule", "bras", "jambe", "abdos",
    "fessier", "douleur", "mal", "blessure", "gainage",
    # ...
]
```

### 4.3 Gestion du contexte

Les sessions sont gérées en mémoire avec un cache TTL (Time-To-Live) :

```python
from cachetools import TTLCache

session_store: TTLCache[str, List[Message]] = TTLCache(
    maxsize=1000,      # Maximum 1000 sessions simultanées
    ttl=3600           # Expiration après 1 heure d'inactivité
)
```

**Avantages :**
- Pas de dépendance externe pour le stockage de session
- Nettoyage automatique des sessions expirées
- Performance optimale (accès O(1))

**Inconvénients :**
- Perte des sessions au redémarrage du serveur
- Non scalable horizontalement (pas de partage entre instances)

---

## 5. Serveur MCP et Tooling

### 5.1 Rôle du serveur MCP

Le serveur MCP (Model Context Protocol) agit comme une **couche d'abstraction** entre le frontend et les différents services IA. Il expose une API JSON-RPC qui permet :

- L'invocation de méthodes de manière standardisée
- Le streaming des réponses via SSE
- L'exposition d'outils (tools) utilisables par l'agent

### 5.2 Endpoints exposés

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/health` | GET | Vérification de l'état du serveur |
| `/mcp` | POST | Requêtes JSON-RPC synchrones |
| `/mcp/stream` | POST | Requêtes JSON-RPC avec réponse streaming (SSE) |

### 5.3 Liste et détails des tools

#### Tool: `search_knowledge_base`

**Description :** Recherche sémantique dans la base de connaissances vectorielle.

**Paramètres :**

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| query | string | Oui | Texte de recherche |
| limit | integer | Non | Nombre max de résultats (défaut: 5) |
| threshold | float | Non | Score minimum de similarité (défaut: 0.7) |

**Fonctionnement interne :**

```python
async def search_knowledge_base(query: str, limit: int = 5):
    # 1. Génération de l'embedding de la requête
    embedding = await ollama.embed(query)
    
    # 2. Recherche vectorielle via RPC Supabase
    results = supabase.rpc(
        "match_chunks",
        {
            "query_embedding": embedding,
            "match_threshold": 0.7,
            "match_count": limit
        }
    ).execute()
    
    return results.data
```

**Retour :**

```json
[
  {
    "id": "uuid",
    "content": "Texte du chunk...",
    "similarity": 0.85,
    "source_title": "Guide des exercices",
    "source_url": "https://example.com/guide"
  }
]
```

### 5.4 Méthodes JSON-RPC

#### Méthode: `chat`

**Description :** Envoie un message et reçoit une réponse de l'assistant.

**Requête :**

```json
{
  "jsonrpc": "2.0",
  "method": "chat",
  "params": {
    "session_id": "abc123",
    "message": "Donne-moi un programme pour débutant"
  },
  "id": "req_001"
}
```

**Réponse (streaming SSE) :**

```
event: token
data: {"content": "Voici"}

event: token
data: {"content": " un"}

event: token
data: {"content": " programme"}

event: sources
data: {"sources": [{"title": "...", "url": "..."}]}

event: done
data: {}
```

#### Méthode: `tools/list`

**Description :** Liste les outils disponibles.

**Réponse :**

```json
{
  "jsonrpc": "2.0",
  "result": {
    "tools": [
      {
        "name": "search_knowledge_base",
        "description": "Recherche dans la base de connaissances",
        "inputSchema": { ... }
      }
    ]
  },
  "id": "req_002"
}
```

---

## 6. Limites du projet et améliorations

### 6.1 Limites actuelles

| Limite | Impact | Criticité |
|--------|--------|-----------|
| Sessions en mémoire | Perte au redémarrage, non scalable | Moyenne |
| Pas d'authentification | Tous les utilisateurs partagent les mêmes droits | Faible (contexte démo) |
| Temps de réponse LLM | 10-30 secondes selon la complexité | Haute |
| Qualité du scraping | Dépend des sites sources, contenu parfois générique | Moyenne |
| Pas de fine-tuning | Le modèle n'est pas spécialisé musculation | Moyenne |

### 6.2 Améliorations court terme (1-2 semaines)

| Amélioration | Description | Effort |
|--------------|-------------|--------|
| Persistance Redis | Stocker les sessions dans Redis pour la scalabilité | 2 jours |
| Cache des embeddings | Éviter de recalculer les embeddings des requêtes fréquentes | 1 jour |
| Amélioration du scraping | Ajouter plus de sources qualitatives, filtrer le contenu e-commerce | 2 jours |
| Tests unitaires | Couvrir les services critiques (chat, search) | 3 jours |
| Rate limiting | Protéger l'API contre les abus | 1 jour |

### 6.3 Améliorations moyen terme (1-3 mois)

| Amélioration | Description | Effort |
|--------------|-------------|--------|
| Authentification | JWT + OAuth (Google, GitHub) | 1 semaine |
| Historique persistant | Sauvegarder les conversations en base | 1 semaine |
| Fine-tuning du modèle | Entraîner sur un dataset musculation curé | 2 semaines |
| Multi-modal | Support des images (analyse de forme, posture) | 3 semaines |
| Analytics | Dashboard d'usage, questions fréquentes | 1 semaine |
| Déploiement cloud | Docker + Kubernetes, CI/CD | 2 semaines |

---

## 7. Conclusion

### 7.1 Bilan rapide

Le projet Hephaestus démontre la faisabilité d'un assistant IA spécialisé utilisant une architecture RAG moderne. Malgré les contraintes de temps, nous avons réussi à implémenter :

- ✅ Un pipeline RAG complet (scraping → embeddings → recherche → génération)
- ✅ Une interface utilisateur responsive et agréable
- ✅ Un backend robuste avec gestion de session et streaming
- ✅ Un système de citation des sources fiable
- ✅ Un filtrage des sujets hors périmètre

Le projet est fonctionnel et démontre les concepts clés de l'IA générative augmentée.

### 7.2 Compétences acquises

| Domaine | Compétences |
|---------|-------------|
| **IA/ML** | RAG, embeddings vectoriels, prompt engineering, LLM local (Ollama) |
| **Backend** | FastAPI, async Python, SSE streaming, JSON-RPC |
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **Data** | PostgreSQL, pgvector, recherche sémantique |
| **DevOps** | Monorepo (pnpm), gestion d'environnement, Supabase |
| **Scraping** | Playwright, BeautifulSoup4, respect robots.txt |

### 7.3 Lien avec des concepts IA modernes

| Concept | Application dans le projet |
|---------|---------------------------|
| **RAG (Retrieval-Augmented Generation)** | Cœur de l'architecture, permet de réduire les hallucinations en ancrant les réponses dans des sources vérifiables |
| **Vector Embeddings** | Représentation sémantique des textes pour la recherche par similarité (nomic-embed-text, pgvector) |
| **Model Context Protocol (MCP)** | Inspiration pour l'API JSON-RPC, standardisation de la communication frontend-backend |
| **Prompt Engineering** | System prompt structuré avec instructions de citation et de filtrage |
| **Streaming Generation** | Amélioration de l'UX via SSE, affichage progressif des tokens |
| **LLM Local** | Utilisation d'Ollama pour l'inférence locale, confidentialité des données |
| **Chunking Strategies** | Découpage intelligent des documents pour optimiser la qualité du RAG |

---

**Rédigé par l'équipe Hephaestus - Epitech Promo 2027**
