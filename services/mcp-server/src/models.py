from pydantic import BaseModel
from typing import Any, Optional, List


class JsonRpcRequest(BaseModel):
    jsonrpc: str = "2.0"
    id: str
    method: str
    params: dict = {}


class JsonRpcResponse(BaseModel):
    jsonrpc: str = "2.0"
    id: str
    result: Optional[Any] = None
    error: Optional[dict] = None


class ChatParams(BaseModel):
    session_id: str
    message: str
    stream: bool = False


class SearchParams(BaseModel):
    query: str
    k: int = 8


class Citation(BaseModel):
    title: str
    url: str


class ChatMessage(BaseModel):
    role: str
    content: str
    citations: List[Citation] = []
