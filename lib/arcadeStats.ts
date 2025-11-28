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

export const getStat = (key: string): number => {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(key) || 0);
};

export const addStat = (key: string, value: number = 1): number => {
  if (typeof window === 'undefined') return 0;

  const current = Number(localStorage.getItem(key) || 0);
  const newValue = current + value;
  localStorage.setItem(key, String(newValue));

  // Dispatch custom event asynchronously to avoid setState during render
  // Use requestAnimationFrame + setTimeout to ensure it runs after render phase
  // This prevents React 19 Strict Mode warnings about setState during render
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:statsUpdated'));
    }, 0);
  });

  return newValue;
};

export const setStat = (key: string, value: number): void => {
  if (typeof window === 'undefined') return;

  const current = Number(localStorage.getItem(key) || 0);
  const newValue = Math.max(current, value); // Only update if new value is higher
  localStorage.setItem(key, String(newValue));

  // Dispatch custom event asynchronously to avoid setState during render
  // Use requestAnimationFrame + setTimeout to ensure it runs after render phase
  // This prevents React 19 Strict Mode warnings about setState during render
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:statsUpdated'));
    }, 0);
  });
};

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

export const getSessionStat = (key: string): number => {
  if (typeof window === 'undefined') return 0;
  return Number(sessionStorage.getItem(key) || 0);
};

export const addSessionStat = (key: string, value: number = 1): number => {
  if (typeof window === 'undefined') return 0;

  const current = Number(sessionStorage.getItem(key) || 0);
  const newValue = current + value;
  sessionStorage.setItem(key, String(newValue));

  // Dispatch custom event asynchronously to avoid setState during render
  // Use requestAnimationFrame + setTimeout to ensure it runs after render phase
  // This prevents React 19 Strict Mode warnings about setState during render
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:sessionStatsUpdated'));
    }, 0);
  });

  return newValue;
};

export const setSessionStat = (key: string, value: number): void => {
  if (typeof window === 'undefined') return;

  const current = Number(sessionStorage.getItem(key) || 0);
  const newValue = Math.max(current, value); // Only update if new value is higher
  sessionStorage.setItem(key, String(newValue));

  // Dispatch custom event asynchronously to avoid setState during render
  // Use requestAnimationFrame + setTimeout to ensure it runs after render phase
  // This prevents React 19 Strict Mode warnings about setState during render
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:sessionStatsUpdated'));
    }, 0);
  });
};

export const clearSessionStats = (): void => {
  if (typeof window === 'undefined') return;

  Object.values(STAT_KEYS).forEach(key => {
    sessionStorage.removeItem(key);
  });

  // Dispatch update event asynchronously to avoid setState during render
  // Use requestAnimationFrame + setTimeout to ensure it runs after render phase
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:sessionStatsUpdated'));
    }, 0);
  });
};

export const clearArcadeStats = (): void => {
  if (typeof window === 'undefined') return;

  Object.values(STAT_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });

  // Dispatch update event asynchronously to avoid setState during render
  // Use requestAnimationFrame + setTimeout to ensure it runs after render phase
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:statsUpdated'));
    }, 0);
  });
};

export { STAT_KEYS };
