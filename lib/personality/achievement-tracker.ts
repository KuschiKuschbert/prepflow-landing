// PrepFlow Personality System - Achievement Tracker

import { type Achievement, ACHIEVEMENTS } from './achievements';
import { loadStats, loadAchievements, type AchievementStats } from './achievement-tracker/helpers/storage';
import { trackSave, trackRecipeCreated, trackIngredientAdded, trackDishCreated } from './achievement-tracker/helpers/trackCountAchievements';
import {
  trackCOGSCalculated,
  trackPerformanceAnalyzed,
  trackTemperatureLogged,
  trackRecipeShared,
  trackMenuBuilt,
} from './achievement-tracker/helpers/trackBooleanAchievements';

// Re-export tracking functions
export {
  trackSave,
  trackRecipeCreated,
  trackIngredientAdded,
  trackDishCreated,
  trackCOGSCalculated,
  trackPerformanceAnalyzed,
  trackTemperatureLogged,
  trackRecipeShared,
  trackMenuBuilt,
};

export function getUnlockedAchievements(): Achievement[] {
  return loadAchievements();
}

export function getAchievementProgress(): {
  unlocked: number;
  total: number;
  percentage: number;
} {
  const achievements = loadAchievements();
  const total = Object.keys(ACHIEVEMENTS).length;
  return {
    unlocked: achievements.length,
    total,
    percentage: Math.round((achievements.length / total) * 100),
  };
}

export function getStats(): AchievementStats {
  return loadStats();
}
