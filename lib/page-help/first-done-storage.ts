/**
 * LocalStorage utilities for tracking "first done" contexts.
 * Used by InlineHint to hide hints after user completes the first meaningful action.
 */

const STORAGE_PREFIX = 'prepflow_first_done_';

export function getFirstDone(context: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${context}`) === '1';
  } catch {
    return false;
  }
}

export function markFirstDone(context: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${context}`, '1');
  } catch {
    // Ignore storage errors
  }
}
