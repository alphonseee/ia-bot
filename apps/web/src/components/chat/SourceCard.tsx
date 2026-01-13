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
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-bg border border-border rounded-md hover:border-accent/50 transition-colors group"
    >
      <span className="text-text-muted group-hover:text-accent">↗</span>
      <span className="text-text-muted group-hover:text-text truncate max-w-[150px]">
        {domain}
      </span>
    </a>
  );
}
