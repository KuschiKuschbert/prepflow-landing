/**
 * Arcade Stats Management System
 *
 * Manages persistent stats for all mini-arcade games.
 * Stats are stored in localStorage and dispatched via custom events.
 */

export interface ArcadeStats {
  tomatoes: number;
  dockets: number;
  fires: number;
  bestRun: number;
}

const STAT_KEYS = {
  TOMATOES: 'prepflow_tomatoes_thrown',
  DOCKETS: 'prepflow_dockets_total',
  FIRES: 'prepflow_fires_extinguished',
  BEST_RUN: 'prepflow_best_docket_run',
} as const;

/**
 * Get all arcade stats from localStorage
 */
export const getArcadeStats = (): ArcadeStats => {
  if (typeof window === 'undefined') {
    return { tomatoes: 0, dockets: 0, fires: 0, bestRun: 0 };
  }

  return {
    tomatoes: Number(localStorage.getItem(STAT_KEYS.TOMATOES) || 0),
    dockets: Number(localStorage.getItem(STAT_KEYS.DOCKETS) || 0),
    fires: Number(localStorage.getItem(STAT_KEYS.FIRES) || 0),
    bestRun: Number(localStorage.getItem(STAT_KEYS.BEST_RUN) || 0),
  };
};

/**
 * Get a single stat value from localStorage
 */
export const getStat = (key: string): number => {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(key) || 0);
};

/**
 * Add to a stat value and dispatch update event
 */
export const addStat = (key: string, value: number = 1): number => {
  if (typeof window === 'undefined') return 0;

  const current = Number(localStorage.getItem(key) || 0);
  const newValue = current + value;
  localStorage.setItem(key, String(newValue));

  // Dispatch custom event for listeners
  window.dispatchEvent(new CustomEvent('arcade:statsUpdated'));

  return newValue;
};

/**
 * Set a stat value directly (for best run records)
 */
export const setStat = (key: string, value: number): void => {
  if (typeof window === 'undefined') return;

  const current = Number(localStorage.getItem(key) || 0);
  const newValue = Math.max(current, value); // Only update if new value is higher
  localStorage.setItem(key, String(newValue));

  window.dispatchEvent(new CustomEvent('arcade:statsUpdated'));
};

/**
 * Export stat keys for use in components
 */
export { STAT_KEYS };
