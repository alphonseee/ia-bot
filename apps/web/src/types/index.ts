export interface Citation {
  title: string;
  url: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
}

export interface McpRequest {
  jsonrpc: '2.0';
  id: string;
  method: string;
  params: Record<string, unknown>;
}

export interface McpResponse {
  jsonrpc: '2.0';
  id: string;
  result?: unknown;
  error?: {
    code: number;
    message: string;
  };
}

export interface ChatResult {
  message: string;
  citations: Citation[];
}

export interface StreamingChatResult {
  streaming: true;
  stream_url: string;
}
