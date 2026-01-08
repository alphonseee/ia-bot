import { Citation } from '@/types';
import { getDomainFromUrl } from '@/lib/utils';

interface SourceCardProps {
  citation: Citation;
}

export function SourceCard({ citation }: SourceCardProps) {
  const domain = getDomainFromUrl(citation.url);

  return (
    <a
      href={citation.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--bg-tertiary)] 
                 border border-[var(--border-color)] rounded-lg hover:border-red-900/50 
                 transition-colors text-sm group"
    >
      <span className="w-4 h-4 rounded bg-red-600/20 flex items-center justify-center text-xs text-red-500">
        ↗
      </span>
      <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] truncate max-w-[200px]">
        {citation.title || domain}
      </span>
      <span className="text-[var(--text-secondary)] opacity-50 text-xs hidden sm:inline">
        {domain}
      </span>
    </a>
  );
}
