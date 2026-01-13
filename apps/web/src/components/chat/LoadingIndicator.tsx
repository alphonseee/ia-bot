export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 text-text-muted">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm">Réflexion...</span>
    </div>
  );
}
