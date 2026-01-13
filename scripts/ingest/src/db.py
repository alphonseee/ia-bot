import logging
from typing import List, Dict, Optional
from supabase import create_client
from .config import settings

logger = logging.getLogger(__name__)

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


async def get_or_create_source(url: str, domain: str, title: Optional[str] = None) -> str:
    result = supabase.table("sources").select("id").eq("url", url).execute()
    
    if result.data:
        return result.data[0]["id"]
    
    insert_result = supabase.table("sources").insert({
        "url": url,
        "domain": domain,
        "title": title or domain
    }).execute()
    
    logger.info(f"Created new source: {domain}")
    return insert_result.data[0]["id"]


async def document_exists(content_hash: str) -> bool:
    result = supabase.table("documents").select("id").eq("content_hash", content_hash).execute()
    return len(result.data) > 0


async def insert_document(
    source_id: str,
    url: str,
    title: str,
    content_text: str,
    content_hash: str
) -> str:
    result = supabase.table("documents").insert({
        "source_id": source_id,
        "url": url,
        "title": title,
        "content_text": content_text,
        "content_hash": content_hash
    }).execute()
    
    return result.data[0]["id"]


async def insert_chunks(document_id: str, chunks: List[Dict]) -> int:
    if not chunks:
        return 0
    
    rows = []
    for idx, chunk in enumerate(chunks):
        rows.append({
            "document_id": document_id,
            "chunk_index": idx,
            "chunk_text": chunk["text"],
            "token_count": chunk["tokens"],
            "embedding": chunk["embedding"]
        })
    
    batch_size = 50
    total_inserted = 0
    
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        result = supabase.table("chunks").insert(batch).execute()
        total_inserted += len(result.data)
    
    return total_inserted


async def get_stats() -> Dict:
    sources = supabase.table("sources").select("id", count="exact").execute()
    documents = supabase.table("documents").select("id", count="exact").execute()
    chunks = supabase.table("chunks").select("id", count="exact").execute()
    
    return {
        "sources": sources.count or 0,
        "documents": documents.count or 0,
        "chunks": chunks.count or 0
    }
