export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
      <div className="flex gap-1">
        <span 
          className="w-2 h-2 bg-red-500 rounded-full animate-bounce" 
          style={{ animationDelay: '0ms' }} 
        />
        <span 
          className="w-2 h-2 bg-red-500 rounded-full animate-bounce" 
          style={{ animationDelay: '150ms' }} 
        />
        <span 
          className="w-2 h-2 bg-red-500 rounded-full animate-bounce" 
          style={{ animationDelay: '300ms' }} 
        />
      </div>
      <span className="text-sm">Réflexion en cours...</span>
    </div>
  );
}
