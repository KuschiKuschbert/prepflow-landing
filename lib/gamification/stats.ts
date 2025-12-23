/**
 * Unified Gamification System - Stats
 *
 * Consolidated stats system that merges arcade stats and achievement stats.
 * Maintains backward compatibility with existing arcadeStats.ts
 */

import type { GamificationStats } from './types';
import {
  getAchievementProgress,
  getStats as getAchievementStats,
} from '@/lib/personality/achievement-tracker';
import {
  getArcadeStats,
  getStat,
  addStat,
  setStat,
  clearArcadeStats,
} from './stats/helpers/localStorageStats';
import {
  getSessionStats,
  getSessionStat,
  addSessionStat,
  setSessionStat,
  clearSessionStats,
} from './stats/helpers/sessionStorageStats';

export const STAT_KEYS = {
  TOMATOES: 'prepflow_tomatoes_thrown',
  DOCKETS: 'prepflow_dockets_total',
  FIRES: 'prepflow_fires_extinguished',
} as const;

export {
  getArcadeStats,
  getStat,
  addStat,
  setStat,
  clearArcadeStats,
  getSessionStats,
  getSessionStat,
  addSessionStat,
  setSessionStat,
  clearSessionStats,
};

/**
 * Get combined gamification stats (arcade + achievements + streak)
 */
export function getGamificationStats(): GamificationStats {
  const arcade = getArcadeStats();
  const achievements = getAchievementProgress();
  const achievementStats = getAchievementStats();
  const streak = achievementStats.streakDays;

  return {
    arcade,
    achievements,
    streak,
  };
}
