/**
 * Animation utilities and constants for Apple-style landing page
 */

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
} as const;

export const ANIMATION_EASING = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

export const STAGGER_DELAY = 50; // Delay between staggered animations in milliseconds

/**
 * Check if user prefers reduced motion
 * Only works on client side - returns false on server
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Get animation duration based on user preferences
 */
export function getAnimationDuration(baseDuration: number): number {
  return prefersReducedMotion() ? 0 : baseDuration;
}

/**
 * Get transition string for CSS
 */
export function getTransition(
  properties: string[] = ['all'],
  duration: number = ANIMATION_DURATION.normal,
  easing: string = ANIMATION_EASING.easeInOut,
): string {
  const actualDuration = getAnimationDuration(duration);
  if (actualDuration === 0) return 'none';
  return properties.map(prop => `${prop} ${actualDuration}ms ${easing}`).join(', ');
}

/**
 * Calculate stagger delay for list items
 */
export function getStaggerDelay(index: number, baseDelay: number = STAGGER_DELAY): number {
  return prefersReducedMotion() ? 0 : index * baseDelay;
}
