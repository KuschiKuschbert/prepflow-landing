/**
 * Utilities for managing visit counts.
 */

const STORAGE_KEY = 'prepflow-nav-pending-logs';

/**
 * Load visit counts from localStorage.
 *
 * @returns {Map<string, number>} Visit counts map
 */
export function loadVisitCounts(): Map<string, number> {
  if (typeof window === 'undefined') return new Map();
  try {
    const visitCountsStored = localStorage.getItem(`${STORAGE_KEY}-visits`);
    if (visitCountsStored) {
      const counts = JSON.parse(visitCountsStored) as Record<string, number>;
      return new Map(Object.entries(counts));
    }
  } catch {
    // Invalid stored data, start fresh
  }
  return new Map();
}

/**
 * Save visit counts to localStorage.
 *
 * @param {Map<string, number>} visitCounts - Visit counts map
 */
export function saveVisitCounts(visitCounts: Map<string, number>): void {
  if (typeof window === 'undefined') return;
  try {
    const countsObj = Object.fromEntries(visitCounts);
    localStorage.setItem(`${STORAGE_KEY}-visits`, JSON.stringify(countsObj));
  } catch {
    // Storage quota exceeded, ignore
  }
}

/**
 * Calculate return frequency (visits per week).
 *
 * @param {string} href - Navigation href
 * @param {Map<string, number>} visitCounts - Visit counts map
 * @returns {number} Return frequency
 */
export function calculateReturnFrequency(
  href: string,
  visitCounts: Map<string, number>,
): number {
  const count = visitCounts.get(href) || 0;
  // Simple calculation: assume visits are spread over a week
  // More sophisticated calculation could use actual timestamps
  return Math.min(count, 7); // Cap at 7 visits per week
}
