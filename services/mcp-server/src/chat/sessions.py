from cachetools import TTLCache
from typing import List, Dict
from ..config import settings


class SessionStore:
    
    def __init__(self):
        self._store: TTLCache = TTLCache(
            maxsize=1000,
            ttl=settings.SESSION_TTL_SECONDS
        )
    
    def get_history(self, session_id: str) -> List[Dict]:
        return list(self._store.get(session_id, []))
    
    def add_message(self, session_id: str, role: str, content: str):
        history = self.get_history(session_id)
        history.append({"role": role, "content": content})
        self._store[session_id] = history[-20:]
    
    def clear(self, session_id: str):
        self._store.pop(session_id, None)


session_store = SessionStore()
