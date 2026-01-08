from cachetools import TTLCache
from typing import List, Dict
from ..config import settings


class SessionStore:
    """In-memory session store with TTL for conversation history."""
    
    def __init__(self):
        self._store: TTLCache = TTLCache(
            maxsize=1000,
            ttl=settings.SESSION_TTL_SECONDS
        )
    
    def get_history(self, session_id: str) -> List[Dict]:
        """Get conversation history for a session."""
        return list(self._store.get(session_id, []))
    
    def add_message(self, session_id: str, role: str, content: str):
        """Add a message to session history."""
        history = self.get_history(session_id)
        history.append({"role": role, "content": content})
        # Keep last 20 messages to prevent context overflow
        self._store[session_id] = history[-20:]
    
    def clear(self, session_id: str):
        """Clear a session's history."""
        self._store.pop(session_id, None)


# Singleton instance
session_store = SessionStore()
