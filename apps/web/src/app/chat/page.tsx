import Link from 'next/link';
import { ChatContainer } from '@/components/chat/ChatContainer';

interface ChatPageProps {
  searchParams: { q?: string };
}

export default function ChatPage({ searchParams }: ChatPageProps) {
  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] flex-shrink-0">
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">🏋️</span>
          <span className="font-bold text-gradient">IronCoach</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-secondary)] px-2 py-1 bg-[var(--bg-tertiary)] rounded-full border border-[var(--border-color)]">
            Coach IA
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ChatContainer initialQuery={searchParams.q} />
      </main>
    </div>
  );
}
