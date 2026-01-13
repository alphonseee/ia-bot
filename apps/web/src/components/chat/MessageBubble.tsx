import { Message } from '@/types';
import { SourceCard } from './SourceCard';
import { LoadingIndicator } from './LoadingIndicator';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] ${
          isUser
            ? 'bg-red-600 text-white rounded-2xl rounded-br-md'
            : 'bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl rounded-bl-md'
        } px-4 py-3`}
      >
        {message.isStreaming && !message.content ? (
          <LoadingIndicator />
        ) : (
          <>
            <div 
              className={`whitespace-pre-wrap break-words ${
                message.isStreaming ? 'typing-cursor' : ''
              }`}
            >
              {message.content}
            </div>
            
            {!isUser && message.citations && message.citations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-secondary)] mb-2">Sources :</p>
                <div className="flex flex-wrap gap-2">
                  {message.citations.map((citation, idx) => (
                    <SourceCard key={`${citation.url}-${idx}`} citation={citation} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
