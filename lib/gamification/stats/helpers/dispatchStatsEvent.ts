/**
 * Dispatch arcade stats update event asynchronously
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
