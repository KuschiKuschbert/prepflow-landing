/**
 * Checks if the user has requested reduced motion.
 * Safe to call in SSR environments (returns false).
 */
export function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return false;
  }
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}
