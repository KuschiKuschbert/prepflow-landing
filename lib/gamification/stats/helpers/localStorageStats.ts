import { STAT_KEYS } from '../stats';
import type { ArcadeStats } from '@/lib/gamification/types';
import { dispatchStatsEvent } from './dispatchStatsEvent';

/**
 * Get arcade stats (global, persisted in localStorage)
 */
export function getArcadeStats(): ArcadeStats {
  if (typeof window === 'undefined') {
    return { tomatoes: 0, dockets: 0, fires: 0 };
  }

  return {
    tomatoes: Number(localStorage.getItem(STAT_KEYS.TOMATOES) || 0),
    dockets: Number(localStorage.getItem(STAT_KEYS.DOCKETS) || 0),
    fires: Number(localStorage.getItem(STAT_KEYS.FIRES) || 0),
  };
}

/**
 * Get arcade stat by key
 */
export function getStat(key: string): number {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(key) || 0);
}

/**
 * Add to arcade stat (global)
 */
export function addStat(key: string, value: number = 1): number {
  if (typeof window === 'undefined') return 0;

  const current = Number(localStorage.getItem(key) || 0);
  const newValue = current + value;
  localStorage.setItem(key, String(newValue));

  dispatchStatsEvent('arcade:statsUpdated');

  return newValue;
}

/**
 * Set arcade stat (global, only updates if higher)
 */
export function setStat(key: string, value: number): void {
  if (typeof window === 'undefined') return;

  const current = Number(localStorage.getItem(key) || 0);
  const newValue = Math.max(current, value);
  localStorage.setItem(key, String(newValue));

  dispatchStatsEvent('arcade:statsUpdated');
}

/**
 * Clear all arcade stats (global)
 */
export function clearArcadeStats(): void {
  if (typeof window === 'undefined') return;

  Object.values(STAT_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });

  dispatchStatsEvent('arcade:statsUpdated');
}

