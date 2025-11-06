/**
 * Arcade Stats Management System
 *
 * Manages both persistent (global) and session-based stats for all mini-arcade games.
 * Global stats are stored in localStorage (persist across sessions).
 * Session stats are stored in sessionStorage (reset on browser close).
 * Both are tracked simultaneously and dispatched via custom events.
 */

export interface ArcadeStats {
  tomatoes: number;
  dockets: number;
  fires: number;
}

const STAT_KEYS = {
  TOMATOES: 'prepflow_tomatoes_thrown',
  DOCKETS: 'prepflow_dockets_total',
  FIRES: 'prepflow_fires_extinguished',
} as const;

// Global stats (localStorage) - persistent across sessions
/**
 * Get all arcade stats from localStorage (global/persistent)
 */
export const getArcadeStats = (): ArcadeStats => {
  if (typeof window === 'undefined') {
    return { tomatoes: 0, dockets: 0, fires: 0 };
  }

  return {
    tomatoes: Number(localStorage.getItem(STAT_KEYS.TOMATOES) || 0),
    dockets: Number(localStorage.getItem(STAT_KEYS.DOCKETS) || 0),
    fires: Number(localStorage.getItem(STAT_KEYS.FIRES) || 0),
  };
};

/**
 * Get a single stat value from localStorage (global/persistent)
 */
export const getStat = (key: string): number => {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(key) || 0);
};

/**
 * Add to a stat value in localStorage and dispatch update event (global/persistent)
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
 * Set a stat value directly in localStorage (for best run records) (global/persistent)
 */
export const setStat = (key: string, value: number): void => {
  if (typeof window === 'undefined') return;

  const current = Number(localStorage.getItem(key) || 0);
  const newValue = Math.max(current, value); // Only update if new value is higher
  localStorage.setItem(key, String(newValue));

  window.dispatchEvent(new CustomEvent('arcade:statsUpdated'));
};

// Session stats (sessionStorage) - reset on browser close
/**
 * Get all arcade stats from sessionStorage (session-only)
 */
export const getSessionStats = (): ArcadeStats => {
  if (typeof window === 'undefined') {
    return { tomatoes: 0, dockets: 0, fires: 0 };
  }

  return {
    tomatoes: Number(sessionStorage.getItem(STAT_KEYS.TOMATOES) || 0),
    dockets: Number(sessionStorage.getItem(STAT_KEYS.DOCKETS) || 0),
    fires: Number(sessionStorage.getItem(STAT_KEYS.FIRES) || 0),
  };
};

/**
 * Get a single session stat value from sessionStorage (session-only)
 */
export const getSessionStat = (key: string): number => {
  if (typeof window === 'undefined') return 0;
  return Number(sessionStorage.getItem(key) || 0);
};

/**
 * Add to a session stat value in sessionStorage and dispatch update event (session-only)
 */
export const addSessionStat = (key: string, value: number = 1): number => {
  if (typeof window === 'undefined') return 0;

  const current = Number(sessionStorage.getItem(key) || 0);
  const newValue = current + value;
  sessionStorage.setItem(key, String(newValue));

  // Dispatch custom event for listeners
  window.dispatchEvent(new CustomEvent('arcade:sessionStatsUpdated'));

  return newValue;
};

/**
 * Set a session stat value directly in sessionStorage (session-only)
 */
export const setSessionStat = (key: string, value: number): void => {
  if (typeof window === 'undefined') return;

  const current = Number(sessionStorage.getItem(key) || 0);
  const newValue = Math.max(current, value); // Only update if new value is higher
  sessionStorage.setItem(key, String(newValue));

  window.dispatchEvent(new CustomEvent('arcade:sessionStatsUpdated'));
};

/**
 * Clear all session stats from sessionStorage (called on logout)
 * This resets the navbar display but keeps persistent stats in Settings
 */
export const clearSessionStats = (): void => {
  if (typeof window === 'undefined') return;

  Object.values(STAT_KEYS).forEach(key => {
    sessionStorage.removeItem(key);
  });

  // Dispatch update event to refresh UI
  window.dispatchEvent(new CustomEvent('arcade:sessionStatsUpdated'));
};

/**
 * Clear all persistent stats from localStorage (for admin/debugging purposes)
 * Note: This is NOT called on logout - persistent stats should remain
 */
export const clearArcadeStats = (): void => {
  if (typeof window === 'undefined') return;

  Object.values(STAT_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });

  // Dispatch update event to refresh UI
  window.dispatchEvent(new CustomEvent('arcade:statsUpdated'));
};

/**
 * Export stat keys for use in components
 */
export { STAT_KEYS };
