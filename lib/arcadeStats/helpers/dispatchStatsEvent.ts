/**
 * Dispatch arcade stats update event asynchronously
 * Uses requestAnimationFrame + setTimeout to ensure it runs after render phase
 * This prevents React 19 Strict Mode warnings about setState during render
 */
export function dispatchStatsEvent(
  eventName: 'arcade:statsUpdated' | 'arcade:sessionStatsUpdated',
): void {
  if (typeof window === 'undefined') return;
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(eventName));
    }, 0);
  });
}
