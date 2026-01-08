from ..kb.search import search_knowledge_base

TOOLS = [
    {
        "name": "search_knowledge_base",
        "description": "Search the training knowledge base for relevant information about exercises, programs, techniques, and training concepts.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query"
                },
                "k": {
                    "type": "integer",
                    "description": "Number of results to return",
                    "default": 8
                }
            },
            "required": ["query"]
        }
    }
]


async def execute_tool(name: str, arguments: dict) -> dict:
    """Execute a tool by name with given arguments."""
    if name == "search_knowledge_base":
        results = await search_knowledge_base(
            query=arguments["query"],
            k=arguments.get("k", 8)
        )
        return {
            "results": [
                {
                    "text": r["chunk_text"],
                    "title": r.get("document_title", ""),
                    "url": r.get("document_url", ""),
                    "similarity": r.get("similarity", 0)
                }
                for r in results
            ]
        }
    else:
        raise ValueError(f"Unknown tool: {name}")
