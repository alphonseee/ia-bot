from ..kb.search import search_knowledge_base

TOOLS = [
    {
        "name": "search_knowledge_base",
        "description": "Recherche dans la base de connaissances pour des informations sur les exercices, programmes, techniques et concepts d'entraînement.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "La requête de recherche"
                },
                "k": {
                    "type": "integer",
                    "description": "Nombre de résultats à retourner",
                    "default": 8
                }
            },
            "required": ["query"]
        }
    }
]


async def execute_tool(name: str, arguments: dict) -> dict:
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
