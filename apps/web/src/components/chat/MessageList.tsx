'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🏋️</div>
          <h2 className="text-2xl font-bold mb-2">Ready to Train Smarter?</h2>
          <p className="text-[var(--text-secondary)]">
            Ask me about training programs, exercise technique, recovery strategies, 
            or anything related to strength training and bodybuilding.
          </p>
          <div className="mt-6 text-sm text-[var(--text-secondary)]">
            <p className="mb-2">Try asking:</p>
            <ul className="space-y-1 text-left inline-block">
              <li>• &quot;Create a 3-day full body routine&quot;</li>
              <li>• &quot;How to improve my squat depth?&quot;</li>
              <li>• &quot;What&apos;s the best rep range for hypertrophy?&quot;</li>
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
