-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Sources table (seed URLs / domains)
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT UNIQUE NOT NULL,
    title TEXT,
    domain TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table (individual pages)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    url TEXT UNIQUE NOT NULL,
    title TEXT,
    content_text TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chunks table with embeddings
CREATE TABLE IF NOT EXISTS chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    token_count INTEGER NOT NULL,
    embedding VECTOR(768),  -- nomic-embed-text dimension
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(document_id, chunk_index)
);

-- Create HNSW index for fast similarity search
CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Index for content deduplication
CREATE INDEX IF NOT EXISTS documents_content_hash_idx ON documents(content_hash);

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_chunks(
    query_embedding VECTOR(768),
    match_count INTEGER DEFAULT 5,
    min_similarity FLOAT DEFAULT 0.5
)
RETURNS TABLE (
    chunk_id UUID,
    chunk_text TEXT,
    document_id UUID,
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
        d.id AS document_id,
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
