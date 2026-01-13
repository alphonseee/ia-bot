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
          <div className="text-6xl mb-4">🏋️</div>
          <h2 className="text-2xl font-bold mb-2">Prêt à T&apos;Entraîner Plus Intelligemment ?</h2>
          <p className="text-[var(--text-secondary)]">
            Pose-moi tes questions sur les programmes d&apos;entraînement, la technique, 
            la récupération ou tout ce qui touche à la musculation et la force.
          </p>
          <div className="mt-6 text-sm text-[var(--text-secondary)]">
            <p className="mb-2">Essaie de demander :</p>
            <ul className="space-y-1 text-left inline-block">
              <li>• &quot;Crée-moi un programme full body sur 3 jours&quot;</li>
              <li>• &quot;Comment améliorer ma profondeur au squat ?&quot;</li>
              <li>• &quot;Quelle fourchette de reps pour l&apos;hypertrophie ?&quot;</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
