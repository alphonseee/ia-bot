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
    parsed_seed = urlparse(seed_url)
    domain = parsed_seed.netloc
    
    visited: Set[str] = set()
    to_visit: List[tuple] = [(seed_url, 0)]
    results: List[Dict] = []
    
    logger.info(f"Starting crawl of {domain} (max {settings.MAX_PAGES_PER_DOMAIN} pages, depth {settings.MAX_DEPTH})")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=settings.USER_AGENT,
            viewport={"width": 1280, "height": 720}
        )
        page = await context.new_page()
        
        await page.route("**/*.{png,jpg,jpeg,gif,svg,ico,woff,woff2,ttf,eot}", 
                        lambda route: route.abort())
        
        while to_visit and len(visited) < settings.MAX_PAGES_PER_DOMAIN:
            url, depth = to_visit.pop(0)
            
            url = url.split("#")[0]
            url = url.rstrip("/")
            
            if url in visited:
                continue
            
            if depth > settings.MAX_DEPTH:
                continue
            
            if not await can_fetch(url):
                logger.debug(f"Blocked by robots.txt: {url}")
                continue
            
            try:
                logger.info(f"[{len(visited)+1}/{settings.MAX_PAGES_PER_DOMAIN}] Crawling: {url}")
                
                response = await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                
                if response is None or response.status >= 400:
                    logger.warning(f"Failed to load {url}: status {response.status if response else 'None'}")
                    continue
                
                await asyncio.sleep(settings.REQUEST_DELAY_SECONDS)
                
                html = await page.content()
                soup = BeautifulSoup(html, "html.parser")
                
                title = ""
                if soup.title and soup.title.string:
                    title = soup.title.string.strip()
                if not title:
                    h1 = soup.find("h1")
                    if h1:
                        title = h1.get_text(strip=True)
                if not title:
                    title = url
                
                content = extract_text(soup)
                content_hash = hashlib.sha256(content.encode()).hexdigest()
                
                if content and len(content) > 300:
                    results.append({
                        "url": url,
                        "title": title[:500],
                        "content": content,
                        "content_hash": content_hash,
                        "domain": domain
                    })
                    logger.info(f"  -> Extracted {len(content)} chars from: {title[:50]}...")
                else:
                    logger.debug(f"  -> Skipped (too short): {url}")
                
                visited.add(url)
                
                if depth < settings.MAX_DEPTH:
                    for link in soup.find_all("a", href=True):
                        href = link["href"]
                        
                        if href.startswith(("javascript:", "mailto:", "tel:", "#")):
                            continue
                        
                        full_url = urljoin(url, href)
                        parsed = urlparse(full_url)
                        
                        if parsed.netloc != domain:
                            continue
                        
                        skip_patterns = ["/tag/", "/category/", "/author/", "/page/", 
                                       "/search", "/login", "/register", "/cart", "/checkout"]
                        if any(p in parsed.path.lower() for p in skip_patterns):
                            continue
                        
                        clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}".rstrip("/")
                        
                        if clean_url not in visited:
                            to_visit.append((clean_url, depth + 1))
            
            except Exception as e:
                logger.error(f"Error crawling {url}: {e}")
                visited.add(url)
                continue
        
        await browser.close()
    
    logger.info(f"Crawl complete: {len(results)} pages extracted from {domain}")
    return results
