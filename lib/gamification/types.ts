/**
 * Unified Gamification System - Types
 *
 * Central type definitions for all gamification features including
 * arcade games, achievements, stats, and milestones.
 */

/**
 * Arcade game statistics
 */
export interface ArcadeStats {
  tomatoes: number;
  dockets: number;
  fires: number;
}

/**
 * Achievement ID type - matches lib/personality/achievements.ts
 */
export type AchievementId =
  | 'FIRST_RECIPE'
  | 'TEN_INGREDIENTS'
  | 'FIRST_DISH'
  | 'HUNDRED_SAVES'
  | 'WEEKLY_STREAK'
  | 'COGS_MASTER'
  | 'PERFORMANCE_GURU'
  | 'TEMPERATURE_PRO'
  | 'RECIPE_SHARER'
  | 'MENU_BUILDER';

/**
 * Achievement definition
 */
export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

/**
 * Achievement progress information
 */
export interface AchievementProgress {
  unlocked: number;
  total: number;
  percentage: number;
}

/**
 * Achievement statistics (internal tracking)
 */
export interface AchievementStats {
  saveCount: number;
  recipeCount: number;
  ingredientCount: number;
  dishCount: number;
  cogsCalculated: boolean;
  performanceAnalyzed: boolean;
  temperatureLogged: boolean;
  recipeShared: boolean;
  menuBuilt: boolean;
  lastActiveDate: string; // YYYY-MM-DD format
  streakDays: number;
}

/**
 * Milestone type
 */
export type MilestoneType = 'arcade' | 'achievement' | 'usage';

/**
 * Milestone definition
 */
export interface Milestone {
  id: string;
  type: MilestoneType;
  name: string;
  description: string;
  threshold: number;
  icon?: string;
}

/**
 * Gamification event types
 */
export type GamificationEventType =
  | 'arcade:statsUpdated'
  | 'arcade:sessionStatsUpdated'
  | 'personality:achievement'
  | 'gamification:milestone';

/**
 * Combined gamification stats (arcade + achievements)
 */
export interface GamificationStats {
  arcade: ArcadeStats;
  achievements: AchievementProgress;
  streak: number;
}
