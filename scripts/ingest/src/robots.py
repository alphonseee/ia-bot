import httpx
import logging
from urllib.parse import urlparse
from robotexclusionrulesparser import RobotExclusionRulesParser
from .config import settings

logger = logging.getLogger(__name__)

_robots_cache: dict = {}


async def can_fetch(url: str) -> bool:
    """Check if URL is allowed by robots.txt."""
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    
    if robots_url not in _robots_cache:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(robots_url, timeout=10.0)
                parser = RobotExclusionRulesParser()
                if response.status_code == 200:
                    parser.parse(response.text)
                else:
                    parser.parse("")  # Allow all if no robots.txt
                _robots_cache[robots_url] = parser
        except Exception as e:
            logger.warning(f"Could not fetch robots.txt for {parsed.netloc}: {e}")
            # If can't fetch robots.txt, assume allowed
            parser = RobotExclusionRulesParser()
            parser.parse("")
            _robots_cache[robots_url] = parser
    
    return _robots_cache[robots_url].is_allowed(settings.USER_AGENT, url)
