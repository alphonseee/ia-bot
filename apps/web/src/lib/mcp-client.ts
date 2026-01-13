import { McpRequest, McpResponse, ChatResult, Citation } from '@/types';
import { generateId } from './utils';

const MCP_URL = process.env.NEXT_PUBLIC_MCP_URL || 'http://localhost:8000';

export async function mcpCall<T = unknown>(
  method: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const request: McpRequest = {
    jsonrpc: '2.0',
    id: generateId(),
    method,
    params,
  };

  const response = await fetch(`${MCP_URL}/mcp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`MCP request failed: ${response.statusText}`);
  }

  const data: McpResponse = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result as T;
}

export async function sendChatMessage(
  sessionId: string,
  message: string
): Promise<ChatResult> {
  return mcpCall<ChatResult>('chat', {
    session_id: sessionId,
    message,
    stream: false,
  });
}

export interface StreamCallbacks {
  onCitations: (citations: Citation[]) => void;
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export function streamChatMessage(
  sessionId: string,
  message: string,
  callbacks: StreamCallbacks
): () => void {
  const streamUrl = `${MCP_URL}/mcp/stream?session_id=${encodeURIComponent(
    sessionId
  )}&message=${encodeURIComponent(message)}`;

  const eventSource = new EventSource(streamUrl);

  eventSource.addEventListener('citations', (event) => {
    try {
      const citations = JSON.parse(event.data);
      callbacks.onCitations(citations);
    } catch (e) {
      console.error('Failed to parse citations:', e);
    }
  });

  eventSource.addEventListener('token', (event) => {
    callbacks.onToken(event.data);
  });

  eventSource.addEventListener('done', () => {
    eventSource.close();
    callbacks.onDone();
  });

  eventSource.addEventListener('error', (event) => {
    eventSource.close();
    if (event instanceof MessageEvent && event.data) {
      callbacks.onError(event.data);
    } else {
      callbacks.onError('Connexion perdue. Veuillez réessayer.');
    }
  });

  eventSource.onerror = () => {
    eventSource.close();
    callbacks.onError('Impossible de se connecter au serveur.');
  };

  return () => {
    eventSource.close();
  };
}
