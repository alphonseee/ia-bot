import re
from bs4 import BeautifulSoup


def extract_text(soup: BeautifulSoup) -> str:
    for tag in soup(["script", "style", "nav", "footer", "header", 
                     "aside", "form", "noscript", "iframe", "svg",
                     "button", "input", "select", "textarea"]):
        tag.decompose()
    
    for selector in [
        '[class*="nav"]', '[class*="menu"]', '[class*="sidebar"]',
        '[class*="footer"]', '[class*="header"]', '[class*="comment"]',
        '[class*="share"]', '[class*="social"]', '[class*="related"]',
        '[class*="advertisement"]', '[class*="ad-"]', '[class*="popup"]',
        '[id*="nav"]', '[id*="menu"]', '[id*="sidebar"]', '[id*="footer"]'
    ]:
        for element in soup.select(selector):
            element.decompose()
    
    main_content = (
        soup.find("main") or 
        soup.find("article") or 
        soup.find(class_=re.compile(r"(content|article|post|entry|body)", re.I)) or
        soup.find(id=re.compile(r"(content|article|post|entry|main)", re.I)) or
        soup.find("body")
    )
    
    if not main_content:
        return ""
    
    lines = []
    for element in main_content.find_all(["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "td", "th", "blockquote"]):
        text = element.get_text(strip=True)
        if text and len(text) > 10:
            if element.name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
                lines.append(f"\n## {text}\n")
            else:
                lines.append(text)
    
    content = "\n".join(lines)
    
    content = re.sub(r"\n{3,}", "\n\n", content)
    content = re.sub(r" {2,}", " ", content)
    content = re.sub(r"\t+", " ", content)
    
    return content.strip()
