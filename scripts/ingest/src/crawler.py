import asyncio
import hashlib
import logging
from urllib.parse import urlparse, urljoin
from typing import Set, List, Dict
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from .config import settings
from .robots import can_fetch
from .extractor import extract_text

logger = logging.getLogger(__name__)


async def crawl_domain(seed_url: str) -> List[Dict]:
    """
    Crawl a domain starting from seed URL.
    Respects robots.txt, rate limits, and page/depth limits.
    Returns list of document dicts with url, title, content, content_hash, domain.
    """
    parsed_seed = urlparse(seed_url)
    domain = parsed_seed.netloc
    
    visited: Set[str] = set()
    to_visit: List[tuple] = [(seed_url, 0)]  # (url, depth)
    results: List[Dict] = []
    
    logger.info(f"Starting crawl of {domain} (max {settings.MAX_PAGES_PER_DOMAIN} pages, depth {settings.MAX_DEPTH})")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=settings.USER_AGENT,
            viewport={"width": 1280, "height": 720}
        )
        page = await context.new_page()
        
        # Block unnecessary resources for faster crawling
        await page.route("**/*.{png,jpg,jpeg,gif,svg,ico,woff,woff2,ttf,eot}", 
                        lambda route: route.abort())
        
        while to_visit and len(visited) < settings.MAX_PAGES_PER_DOMAIN:
            url, depth = to_visit.pop(0)
            
            # Normalize URL
            url = url.split("#")[0]  # Remove fragments
            url = url.rstrip("/")
            
            if url in visited:
                continue
            
            if depth > settings.MAX_DEPTH:
                continue
            
            # Check robots.txt
            if not await can_fetch(url):
                logger.debug(f"Blocked by robots.txt: {url}")
                continue
            
            try:
                logger.info(f"[{len(visited)+1}/{settings.MAX_PAGES_PER_DOMAIN}] Crawling: {url}")
                
                response = await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                
                if response is None or response.status >= 400:
                    logger.warning(f"Failed to load {url}: status {response.status if response else 'None'}")
                    continue
                
                # Rate limiting
                await asyncio.sleep(settings.REQUEST_DELAY_SECONDS)
                
                html = await page.content()
                soup = BeautifulSoup(html, "html.parser")
                
                # Extract title
                title = ""
                if soup.title and soup.title.string:
                    title = soup.title.string.strip()
                if not title:
                    h1 = soup.find("h1")
                    if h1:
                        title = h1.get_text(strip=True)
                if not title:
                    title = url
                
                # Extract content
                content = extract_text(soup)
                content_hash = hashlib.sha256(content.encode()).hexdigest()
                
                # Only keep pages with substantial content
                if content and len(content) > 300:
                    results.append({
                        "url": url,
                        "title": title[:500],  # Limit title length
                        "content": content,
                        "content_hash": content_hash,
                        "domain": domain
                    })
                    logger.info(f"  -> Extracted {len(content)} chars from: {title[:50]}...")
                else:
                    logger.debug(f"  -> Skipped (too short): {url}")
                
                visited.add(url)
                
                # Find links for next level
                if depth < settings.MAX_DEPTH:
                    for link in soup.find_all("a", href=True):
                        href = link["href"]
                        
                        # Skip non-http links
                        if href.startswith(("javascript:", "mailto:", "tel:", "#")):
                            continue
                        
                        full_url = urljoin(url, href)
                        parsed = urlparse(full_url)
                        
                        # Same domain only
                        if parsed.netloc != domain:
                            continue
                        
                        # Skip common non-content paths
                        skip_patterns = ["/tag/", "/category/", "/author/", "/page/", 
                                       "/search", "/login", "/register", "/cart", "/checkout"]
                        if any(p in parsed.path.lower() for p in skip_patterns):
                            continue
                        
                        # Clean URL
                        clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}".rstrip("/")
                        
                        if clean_url not in visited:
                            to_visit.append((clean_url, depth + 1))
            
            except Exception as e:
                logger.error(f"Error crawling {url}: {e}")
                visited.add(url)  # Mark as visited to avoid retrying
                continue
        
        await browser.close()
    
    logger.info(f"Crawl complete: {len(results)} pages extracted from {domain}")
    return results
