/**
 * Unified Gamification System - Stats
 *
 * Consolidated stats system that merges arcade stats and achievement stats.
 * Maintains backward compatibility with existing arcadeStats.ts
 */

import type { ArcadeStats, GamificationStats, AchievementProgress } from './types';
import {
  getAchievementProgress,
  getStats as getAchievementStats,
} from '@/lib/personality/achievement-tracker';

// Re-export arcade stat keys for backward compatibility
export const STAT_KEYS = {
  TOMATOES: 'prepflow_tomatoes_thrown',
  DOCKETS: 'prepflow_dockets_total',
  FIRES: 'prepflow_fires_extinguished',
} as const;

/**
 * Get arcade stats (global, persisted in localStorage)
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
 * Get arcade stat by key
 */
export const getStat = (key: string): number => {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(key) || 0);
};

/**
 * Add to arcade stat (global)
 */
export const addStat = (key: string, value: number = 1): number => {
  if (typeof window === 'undefined') return 0;

  const current = Number(localStorage.getItem(key) || 0);
  const newValue = current + value;
  localStorage.setItem(key, String(newValue));

  // Dispatch custom event asynchronously to avoid setState during render
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:statsUpdated'));
    }, 0);
  });

  return newValue;
};

/**
 * Set arcade stat (global, only updates if higher)
 */
export const setStat = (key: string, value: number): void => {
  if (typeof window === 'undefined') return;

  const current = Number(localStorage.getItem(key) || 0);
  const newValue = Math.max(current, value);
  localStorage.setItem(key, String(newValue));

  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:statsUpdated'));
    }, 0);
  });
};

/**
 * Get session arcade stats (resets per session)
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
 * Get session stat by key
 */
export const getSessionStat = (key: string): number => {
  if (typeof window === 'undefined') return 0;
  return Number(sessionStorage.getItem(key) || 0);
};

/**
 * Add to session arcade stat
 */
export const addSessionStat = (key: string, value: number = 1): number => {
  if (typeof window === 'undefined') return 0;

  const current = Number(sessionStorage.getItem(key) || 0);
  const newValue = current + value;
  sessionStorage.setItem(key, String(newValue));

  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:sessionStatsUpdated'));
    }, 0);
  });

  return newValue;
};

/**
 * Set session arcade stat (only updates if higher)
 */
export const setSessionStat = (key: string, value: number): void => {
  if (typeof window === 'undefined') return;

  const current = Number(sessionStorage.getItem(key) || 0);
  const newValue = Math.max(current, value);
  sessionStorage.setItem(key, String(newValue));

  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:sessionStatsUpdated'));
    }, 0);
  });
};

/**
 * Clear session stats
 */
export const clearSessionStats = (): void => {
  if (typeof window === 'undefined') return;

  Object.values(STAT_KEYS).forEach(key => {
    sessionStorage.removeItem(key);
  });

  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:sessionStatsUpdated'));
    }, 0);
  });
};

/**
 * Clear all arcade stats (global)
 */
export const clearArcadeStats = (): void => {
  if (typeof window === 'undefined') return;

  Object.values(STAT_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });

  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:statsUpdated'));
    }, 0);
  });
};

/**
 * Get combined gamification stats (arcade + achievements + streak)
 */
export const getGamificationStats = (): GamificationStats => {
  const arcade = getArcadeStats();
  const achievements = getAchievementProgress();
  const achievementStats = getAchievementStats();
  const streak = achievementStats.streakDays;

  return {
    arcade,
    achievements,
    streak,
  };
};

