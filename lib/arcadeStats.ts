import { dispatchStatsEvent } from './arcadeStats/helpers/dispatchStatsEvent';

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
  dispatchStatsEvent('arcade:statsUpdated');
  return newValue;
};

export const setStat = (key: string, value: number): void => {
  if (typeof window === 'undefined') return;

  const current = Number(localStorage.getItem(key) || 0);
  const newValue = Math.max(current, value);
  localStorage.setItem(key, String(newValue));
  dispatchStatsEvent('arcade:statsUpdated');
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
  dispatchStatsEvent('arcade:sessionStatsUpdated');
  return newValue;
};

export const setSessionStat = (key: string, value: number): void => {
  if (typeof window === 'undefined') return;

  const current = Number(sessionStorage.getItem(key) || 0);
  const newValue = Math.max(current, value);
  sessionStorage.setItem(key, String(newValue));
  dispatchStatsEvent('arcade:sessionStatsUpdated');
};

export const clearSessionStats = (): void => {
  if (typeof window === 'undefined') return;

  Object.values(STAT_KEYS).forEach(key => {
    sessionStorage.removeItem(key);
  });
  dispatchStatsEvent('arcade:sessionStatsUpdated');
};

export const clearArcadeStats = (): void => {
  if (typeof window === 'undefined') return;

  Object.values(STAT_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  dispatchStatsEvent('arcade:statsUpdated');
};

export { STAT_KEYS };
