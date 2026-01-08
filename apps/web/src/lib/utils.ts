import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return generateId();
  
  let sessionId = localStorage.getItem('mcp_session_id');
  if (!sessionId) {
    sessionId = generateId();
    localStorage.setItem('mcp_session_id', sessionId);
  }
  return sessionId;
}

export function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
