'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, Citation } from '@/types';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { streamChatMessage } from '@/lib/mcp-client';
import { generateId, getSessionId } from '@/lib/utils';

interface ChatContainerProps {
  initialQuery?: string;
}

export function ChatContainer({ initialQuery }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const initialQuerySent = useRef(false);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  useEffect(() => {
    if (initialQuery && sessionId && !initialQuerySent.current && messages.length === 0) {
      initialQuerySent.current = true;
      handleSend(initialQuery);
    }
  }, [initialQuery, sessionId, messages.length]);

  const handleSend = useCallback((content: string) => {
    if (!sessionId || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
    };

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      citations: [],
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);

    const cleanup = streamChatMessage(sessionId, content, {
      onCitations: (citations: Citation[]) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id 
              ? { ...msg, citations } 
              : msg
          )
        );
      },
      onToken: (token: string) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: msg.content + token }
              : msg
          )
        );
      },
      onDone: () => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id 
              ? { ...msg, isStreaming: false } 
              : msg
          )
        );
        setIsLoading(false);
      },
      onError: (error: string) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { 
                  ...msg, 
                  content: msg.content || `Erreur : ${error}`, 
                  isStreaming: false 
                }
              : msg
          )
        );
        setIsLoading(false);
      },
    });

    return cleanup;
  }, [sessionId, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} />
      <div className="p-4 border-t border-[var(--border-color)]">
        <ChatInput 
          onSend={handleSend} 
          disabled={isLoading || !sessionId} 
        />
        <p className="text-xs text-[var(--text-secondary)] text-center mt-2">
          IronCoach peut faire des erreurs. Vérifie les informations importantes.
        </p>
      </div>
    </div>
  );
}
