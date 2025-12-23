import { STAT_KEYS } from '../stats';
import type { ArcadeStats } from '@/lib/gamification/types';
import { dispatchStatsEvent } from './dispatchStatsEvent';

/**
 * Get session arcade stats (resets per session)
 */
export function getSessionStats(): ArcadeStats {
  if (typeof window === 'undefined') {
    return { tomatoes: 0, dockets: 0, fires: 0 };
  }

  return {
    tomatoes: Number(sessionStorage.getItem(STAT_KEYS.TOMATOES) || 0),
    dockets: Number(sessionStorage.getItem(STAT_KEYS.DOCKETS) || 0),
    fires: Number(sessionStorage.getItem(STAT_KEYS.FIRES) || 0),
  };
}

/**
 * Get session stat by key
 */
export function getSessionStat(key: string): number {
  if (typeof window === 'undefined') return 0;
  return Number(sessionStorage.getItem(key) || 0);
}

/**
 * Add to session arcade stat
 */
export function addSessionStat(key: string, value: number = 1): number {
  if (typeof window === 'undefined') return 0;

  const current = Number(sessionStorage.getItem(key) || 0);
  const newValue = current + value;
  sessionStorage.setItem(key, String(newValue));

  dispatchStatsEvent('arcade:sessionStatsUpdated');

  return newValue;
}

/**
 * Set session arcade stat (only updates if higher)
 */
export function setSessionStat(key: string, value: number): void {
  if (typeof window === 'undefined') return;

  const current = Number(sessionStorage.getItem(key) || 0);
  const newValue = Math.max(current, value);
  sessionStorage.setItem(key, String(newValue));

  dispatchStatsEvent('arcade:sessionStatsUpdated');
}

/**
 * Clear session stats
 */
export function clearSessionStats(): void {
  if (typeof window === 'undefined') return;

  Object.values(STAT_KEYS).forEach(key => {
    sessionStorage.removeItem(key);
  });

  dispatchStatsEvent('arcade:sessionStatsUpdated');
}
