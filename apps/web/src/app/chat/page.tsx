import Link from 'next/link';
import { ChatContainer } from '@/components/chat/ChatContainer';

interface ChatPageProps {
  searchParams: { q?: string };
}

export default function ChatPage({ searchParams }: ChatPageProps) {
  return (
    
    <div className="h-screen flex flex-col bg-bg">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <Link 
          href="/" 
          className="font-bold hover:text-accent transition-colors"
        >
          IronCoach
        </Link>
      </header>

      <main className="flex-1 overflow-hidden">
        <ChatContainer initialQuery={searchParams.q} />
      </main>
    </div>
  );
}
