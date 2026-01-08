import re
from bs4 import BeautifulSoup


def extract_text(soup: BeautifulSoup) -> str:
    """Extract main content text from HTML, removing nav/footer/scripts."""
    # Remove unwanted elements
    for tag in soup(["script", "style", "nav", "footer", "header", 
                     "aside", "form", "noscript", "iframe", "svg",
                     "button", "input", "select", "textarea"]):
        tag.decompose()
    
    # Remove elements by common non-content classes/ids
    for selector in [
        '[class*="nav"]', '[class*="menu"]', '[class*="sidebar"]',
        '[class*="footer"]', '[class*="header"]', '[class*="comment"]',
        '[class*="share"]', '[class*="social"]', '[class*="related"]',
        '[class*="advertisement"]', '[class*="ad-"]', '[class*="popup"]',
        '[id*="nav"]', '[id*="menu"]', '[id*="sidebar"]', '[id*="footer"]'
    ]:
        for element in soup.select(selector):
            element.decompose()
    
    # Try to find main content area
    main_content = (
        soup.find("main") or 
        soup.find("article") or 
        soup.find(class_=re.compile(r"(content|article|post|entry|body)", re.I)) or
        soup.find(id=re.compile(r"(content|article|post|entry|main)", re.I)) or
        soup.find("body")
    )
    
    if not main_content:
        return ""
    
    # Get text with some structure preserved
    lines = []
    for element in main_content.find_all(["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "td", "th", "blockquote"]):
        text = element.get_text(strip=True)
        if text and len(text) > 10:  # Skip very short fragments
            # Add heading markers for chunking hints
            if element.name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
                lines.append(f"\n## {text}\n")
            else:
                lines.append(text)
    
    content = "\n".join(lines)
    
    # Clean up whitespace
    content = re.sub(r"\n{3,}", "\n\n", content)
    content = re.sub(r" {2,}", " ", content)
    content = re.sub(r"\t+", " ", content)
    
    return content.strip()
