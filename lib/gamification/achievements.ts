/**
 * Unified Gamification System - Achievements
 *
 * Re-exports achievement definitions from personality system
 * for unified access. Achievements remain in lib/personality/
 * for backward compatibility.
 */

export {
  type AchievementId,
  type Achievement,
  ACHIEVEMENTS,
  getAchievement,
  getAllAchievements,
} from '@/lib/personality/achievements';

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
  getUnlockedAchievements,
  getAchievementProgress,
  getStats as getAchievementStats,
} from '@/lib/personality/achievement-tracker';




