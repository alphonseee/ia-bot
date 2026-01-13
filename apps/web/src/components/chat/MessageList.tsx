'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold mb-3">Salut 👋</h2>
          <p className="text-text-muted mb-6">
            Pose-moi tes questions sur l&apos;entraînement, la nutrition, 
            les programmes... Je suis là pour t&apos;aider.
          </p>
          <div className="text-sm text-text-muted text-left space-y-2">
            <p className="font-medium text-text">Exemples :</p>
            <p>• &quot;Crée-moi un programme débutant&quot;</p>
            <p>• &quot;Comment améliorer mon squat ?&quot;</p>
            <p>• &quot;Combien de protéines par jour ?&quot;</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
