import tiktoken
import re
from typing import List, Dict
from .config import settings

# Use cl100k_base encoding (GPT-4 / modern models)
encoder = tiktoken.get_encoding("cl100k_base")


def count_tokens(text: str) -> int:
    """Count tokens in text."""
    return len(encoder.encode(text))


def chunk_text(text: str) -> List[Dict]:
    """
    Heading-aware chunking with overlap.
    Tries to split by headings first, then by paragraphs.
    Returns list of {text, tokens} dicts.
    """
    chunks = []
    
    # Split by headings first (## markers added by extractor)
    sections = re.split(r"(\n## [^\n]+\n)", text)
    
    current_chunk = ""
    current_heading = ""
    
    for section in sections:
        # Check if this is a heading
        if section.startswith("\n## "):
            current_heading = section.strip()
            continue
        
        # Split section into paragraphs
        paragraphs = section.split("\n\n")
        
        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            
            # Test if adding this paragraph exceeds chunk size
            test_chunk = current_chunk + "\n\n" + para if current_chunk else para
            
            if count_tokens(test_chunk) <= settings.CHUNK_SIZE_TOKENS:
                current_chunk = test_chunk
            else:
                # Save current chunk if it has content
                if current_chunk and count_tokens(current_chunk) > 50:
                    chunk_with_heading = (
                        current_heading + "\n" + current_chunk 
                        if current_heading else current_chunk
                    )
                    chunks.append({
                        "text": chunk_with_heading.strip(),
                        "tokens": count_tokens(chunk_with_heading)
                    })
                
                # Start new chunk with overlap from previous
                overlap_text = get_overlap_text(current_chunk)
                current_chunk = overlap_text + "\n\n" + para if overlap_text else para
    
    # Don't forget the last chunk
    if current_chunk and count_tokens(current_chunk) > 50:
        chunk_with_heading = (
            current_heading + "\n" + current_chunk 
            if current_heading else current_chunk
        )
        chunks.append({
            "text": chunk_with_heading.strip(),
            "tokens": count_tokens(chunk_with_heading)
        })
    
    return chunks


def get_overlap_text(text: str) -> str:
    """Get last ~150 tokens of text for overlap."""
    if not text:
        return ""
    
    tokens = encoder.encode(text)
    if len(tokens) <= settings.CHUNK_OVERLAP_TOKENS:
        return text
    
    overlap_tokens = tokens[-settings.CHUNK_OVERLAP_TOKENS:]
    return encoder.decode(overlap_tokens)
