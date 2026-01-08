import json
import logging
from urllib.parse import unquote
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from ..models import JsonRpcRequest, ChatParams
from ..chat.service import chat_completion
from .tools import TOOLS, execute_tool

logger = logging.getLogger(__name__)
router = APIRouter()


def make_error(id: str, code: int, message: str) -> dict:
    """Create a JSON-RPC error response."""
    return {
        "jsonrpc": "2.0",
        "id": id,
        "error": {"code": code, "message": message}
    }


def make_result(id: str, result: any) -> dict:
    """Create a JSON-RPC success response."""
    return {
        "jsonrpc": "2.0",
        "id": id,
        "result": result
    }


@router.post("/mcp")
async def mcp_endpoint(request: JsonRpcRequest):
    """Main MCP JSON-RPC endpoint."""
    try:
        method = request.method
        params = request.params
        
        # List available tools
        if method == "tools/list":
            return make_result(request.id, {"tools": TOOLS})
        
        # Execute a tool
        elif method == "tools/call":
            tool_name = params.get("name")
            arguments = params.get("arguments", {})
            
            if not tool_name:
                return make_error(request.id, -32602, "Missing tool name")
            
            result = await execute_tool(tool_name, arguments)
            return make_result(request.id, result)
        
        # Chat completion
        elif method == "chat":
            chat_params = ChatParams(**params)
            
            if chat_params.stream:
                # For streaming, return URL to SSE endpoint
                return make_result(request.id, {
                    "streaming": True,
                    "message": "Connect to SSE endpoint for streaming response"
                })
            else:
                response, sources = await chat_completion(
                    session_id=chat_params.session_id,
                    user_message=chat_params.message,
                    stream=False
                )
                return make_result(request.id, {
                    "message": response,
                    "citations": [
                        {"title": s["title"], "url": s["url"]}
                        for s in sources if s["url"]
                    ]
                })
        
        else:
            return make_error(request.id, -32601, f"Method not found: {method}")
    
    except Exception as e:
        logger.exception("MCP error")
        return make_error(request.id, -32000, str(e))


@router.get("/mcp/stream")
async def mcp_stream(session_id: str, message: str):
    """SSE endpoint for streaming chat responses."""
    # URL decode the message
    decoded_message = unquote(message)
    
    async def event_generator():
        try:
            result = await chat_completion(
                session_id=session_id,
                user_message=decoded_message,
                stream=True
            )
            
            # Unpack the tuple (generator, sources)
            stream_gen, sources = result
            
            # Send citations first
            if sources:
                yield {
                    "event": "citations",
                    "data": json.dumps([
                        {"title": s["title"], "url": s["url"]}
                        for s in sources if s.get("url")
                    ])
                }
            
            # Stream tokens
            async for token in stream_gen:
                yield {
                    "event": "token",
                    "data": token
                }
            
            # Signal completion
            yield {
                "event": "done",
                "data": ""
            }
        
        except Exception as e:
            logger.exception("Stream error")
            yield {
                "event": "error",
                "data": str(e)
            }
    
    return EventSourceResponse(event_generator())
