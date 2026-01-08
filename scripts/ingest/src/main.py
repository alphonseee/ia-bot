import asyncio
import logging
from urllib.parse import urlparse
from .config import settings, SEED_URLS
from .crawler import crawl_domain
from .chunker import chunk_text
from .embedder import generate_embedding
from .db import (
    get_or_create_source, 
    document_exists, 
    insert_document, 
    insert_chunks,
    get_stats
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


async def process_document(doc: dict, source_id: str) -> bool:
    """Process a single document: chunk, embed, store. Returns True if processed."""
    # Check for duplicate content
    if await document_exists(doc["content_hash"]):
        logger.info(f"Skipping duplicate: {doc['url']}")
        return False
    
    # Chunk the content
    chunks = chunk_text(doc["content"])
    logger.info(f"Created {len(chunks)} chunks for: {doc['title'][:50]}...")
    
    if not chunks:
        logger.warning(f"No chunks created for: {doc['url']}")
        return False
    
    # Generate embeddings for each chunk
    logger.info(f"Generating embeddings for {len(chunks)} chunks...")
    for i, chunk in enumerate(chunks):
        try:
            embedding = await generate_embedding(chunk["text"])
            chunk["embedding"] = embedding
        except Exception as e:
            logger.error(f"Failed to embed chunk {i}: {e}")
            return False
    
    # Insert document
    try:
        doc_id = await insert_document(
            source_id=source_id,
            url=doc["url"],
            title=doc["title"],
            content_text=doc["content"],
            content_hash=doc["content_hash"]
        )
        
        # Insert chunks
        inserted = await insert_chunks(doc_id, chunks)
        logger.info(f"Inserted document with {inserted} chunks: {doc['title'][:50]}...")
        return True
        
    except Exception as e:
        logger.error(f"Failed to insert document {doc['url']}: {e}")
        return False


async def ingest_seed_url(seed_url: str):
    """Ingest all pages from a seed URL."""
    parsed = urlparse(seed_url)
    domain = parsed.netloc
    
    logger.info(f"\n{'='*60}")
    logger.info(f"Starting ingestion of: {domain}")
    logger.info(f"{'='*60}")
    
    # Get or create source
    source_id = await get_or_create_source(
        url=seed_url,
        domain=domain,
        title=domain
    )
    
    # Crawl the domain
    documents = await crawl_domain(seed_url)
    logger.info(f"Crawled {len(documents)} pages from {domain}")
    
    if not documents:
        logger.warning(f"No documents found for {domain}")
        return
    
    # Process each document
    processed = 0
    failed = 0
    
    for i, doc in enumerate(documents):
        logger.info(f"\nProcessing document {i+1}/{len(documents)}")
        try:
            if await process_document(doc, source_id):
                processed += 1
            # Small delay between documents
            await asyncio.sleep(0.5)
        except Exception as e:
            logger.error(f"Error processing {doc['url']}: {e}")
            failed += 1
    
    logger.info(f"\nDomain {domain} complete: {processed} processed, {failed} failed")


async def main():
    """Main ingestion entry point."""
    logger.info("="*60)
    logger.info("TRAINING COACH KNOWLEDGE BASE INGESTION")
    logger.info("="*60)
    
    if not SEED_URLS:
        logger.warning("\n⚠️  No SEED_URLS configured!")
        logger.info("Edit scripts/ingest/src/config.py and add URLs to SEED_URLS list.")
        logger.info("Example:")
        logger.info('  SEED_URLS = ["https://www.strongerbyscience.com/"]')
        return
    
    logger.info(f"\nWill ingest {len(SEED_URLS)} seed URL(s):")
    for url in SEED_URLS:
        logger.info(f"  - {url}")
    
    # Process each seed URL
    for seed_url in SEED_URLS:
        try:
            await ingest_seed_url(seed_url)
        except Exception as e:
            logger.error(f"Error ingesting {seed_url}: {e}")
    
    # Print final stats
    stats = await get_stats()
    logger.info("\n" + "="*60)
    logger.info("INGESTION COMPLETE")
    logger.info("="*60)
    logger.info(f"Total sources:   {stats['sources']}")
    logger.info(f"Total documents: {stats['documents']}")
    logger.info(f"Total chunks:    {stats['chunks']}")


if __name__ == "__main__":
    asyncio.run(main())
