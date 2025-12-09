// PrepFlow Personality System - Achievement Tracker

import { type Achievement, type AchievementId, ACHIEVEMENTS } from './achievements';
import {
  checkUsageMilestone,
  checkAchievementMilestone,
  dispatchMilestoneReached,
} from '@/lib/gamification/milestones';

const STORAGE_KEY = 'prepflow-achievements';
const STORAGE_STATS_KEY = 'prepflow-achievement-stats';

interface AchievementStats {
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

function getDefaultStats(): AchievementStats {
  return {
    saveCount: 0,
    recipeCount: 0,
    ingredientCount: 0,
    dishCount: 0,
    cogsCalculated: false,
    performanceAnalyzed: false,
    temperatureLogged: false,
    recipeShared: false,
    menuBuilt: false,
    lastActiveDate: new Date().toISOString().split('T')[0],
    streakDays: 0,
  };
}

function loadStats(): AchievementStats {
  if (typeof window === 'undefined') return getDefaultStats();

  try {
    const stored = localStorage.getItem(STORAGE_STATS_KEY);
    if (stored) {
      return { ...getDefaultStats(), ...JSON.parse(stored) };
    }
  } catch {
    // Ignore errors
  }

  return getDefaultStats();
}

function saveStats(stats: AchievementStats): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore errors
  }
}

function loadAchievements(): Achievement[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore errors
  }

  return [];
}

function saveAchievements(achievements: Achievement[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  } catch {
    // Ignore errors
  }
}

function updateStreak(): number {
  const stats = loadStats();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  if (stats.lastActiveDate === today) {
    // Already updated today
    return stats.streakDays;
  }

  if (stats.lastActiveDate === yesterday) {
    // Consecutive day
    stats.streakDays += 1;
  } else {
    // Streak broken
    stats.streakDays = 1;
  }

  stats.lastActiveDate = today;
  saveStats(stats);

  return stats.streakDays;
}

export function trackSave(): AchievementId | null {
  const stats = loadStats();
  stats.saveCount += 1;
  saveStats(stats);

  // Update streak
  const streakDays = updateStreak();

  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map(a => a.id));

  // Check for HUNDRED_SAVES achievement
  if (stats.saveCount >= 100 && !unlockedIds.has('HUNDRED_SAVES')) {
    unlockAchievement('HUNDRED_SAVES');
    return 'HUNDRED_SAVES';
  }

  // Check for WEEKLY_STREAK achievement
  if (streakDays >= 7 && !unlockedIds.has('WEEKLY_STREAK')) {
    unlockAchievement('WEEKLY_STREAK');
    return 'WEEKLY_STREAK';
  }

  // Check for usage milestones (100 saves)
  const saveMilestone = checkUsageMilestone('usage:100-saves', stats.saveCount);
  if (saveMilestone) {
    dispatchMilestoneReached(saveMilestone);
  }

  return null;
}

export function trackRecipeCreated(): AchievementId | null {
  const stats = loadStats();
  stats.recipeCount += 1;
  saveStats(stats);

  updateStreak();

  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map(a => a.id));

  // Check for FIRST_RECIPE achievement
  if (stats.recipeCount === 1 && !unlockedIds.has('FIRST_RECIPE')) {
    unlockAchievement('FIRST_RECIPE');
    return 'FIRST_RECIPE';
  }

  // Check for usage milestones (10 recipes)
  const recipeMilestone = checkUsageMilestone('usage:10-recipes', stats.recipeCount);
  if (recipeMilestone) {
    dispatchMilestoneReached(recipeMilestone);
  }

  // Check for achievement milestones (first achievement)
  const achievementMilestone = checkAchievementMilestone(achievements.length);
  if (achievementMilestone) {
    dispatchMilestoneReached(achievementMilestone);
  }

  return null;
}

export function trackIngredientAdded(): AchievementId | null {
  const stats = loadStats();
  stats.ingredientCount += 1;
  saveStats(stats);

  updateStreak();

  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map(a => a.id));

  // Check for TEN_INGREDIENTS achievement
  if (stats.ingredientCount >= 10 && !unlockedIds.has('TEN_INGREDIENTS')) {
    unlockAchievement('TEN_INGREDIENTS');
    return 'TEN_INGREDIENTS';
  }

  // Check for usage milestones (50 ingredients)
  const ingredientMilestone = checkUsageMilestone('usage:50-ingredients', stats.ingredientCount);
  if (ingredientMilestone) {
    dispatchMilestoneReached(ingredientMilestone);
  }

  return null;
}

export function trackDishCreated(): AchievementId | null {
  const stats = loadStats();
  stats.dishCount += 1;
  saveStats(stats);

  updateStreak();

  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map(a => a.id));

  // Check for FIRST_DISH achievement
  if (stats.dishCount === 1 && !unlockedIds.has('FIRST_DISH')) {
    unlockAchievement('FIRST_DISH');
    return 'FIRST_DISH';
  }

  return null;
}

export function trackCOGSCalculated(): AchievementId | null {
  const stats = loadStats();
  if (stats.cogsCalculated) return null;

  stats.cogsCalculated = true;
  saveStats(stats);

  updateStreak();

  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map(a => a.id));

  if (!unlockedIds.has('COGS_MASTER')) {
    unlockAchievement('COGS_MASTER');
    return 'COGS_MASTER';
  }

  return null;
}

export function trackPerformanceAnalyzed(): AchievementId | null {
  const stats = loadStats();
  if (stats.performanceAnalyzed) return null;

  stats.performanceAnalyzed = true;
  saveStats(stats);

  updateStreak();

  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map(a => a.id));

  if (!unlockedIds.has('PERFORMANCE_GURU')) {
    unlockAchievement('PERFORMANCE_GURU');
    return 'PERFORMANCE_GURU';
  }

  return null;
}

export function trackTemperatureLogged(): AchievementId | null {
  const stats = loadStats();
  if (stats.temperatureLogged) return null;

  stats.temperatureLogged = true;
  saveStats(stats);

  updateStreak();

  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map(a => a.id));

  if (!unlockedIds.has('TEMPERATURE_PRO')) {
    unlockAchievement('TEMPERATURE_PRO');
    return 'TEMPERATURE_PRO';
  }

  return null;
}

export function trackRecipeShared(): AchievementId | null {
  const stats = loadStats();
  if (stats.recipeShared) return null;

  stats.recipeShared = true;
  saveStats(stats);

  updateStreak();

  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map(a => a.id));

  if (!unlockedIds.has('RECIPE_SHARER')) {
    unlockAchievement('RECIPE_SHARER');
    return 'RECIPE_SHARER';
  }

  return null;
}

export function trackMenuBuilt(): AchievementId | null {
  const stats = loadStats();
  if (stats.menuBuilt) return null;

  stats.menuBuilt = true;
  saveStats(stats);

  updateStreak();

  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map(a => a.id));

  if (!unlockedIds.has('MENU_BUILDER')) {
    unlockAchievement('MENU_BUILDER');
    return 'MENU_BUILDER';
  }

  return null;
}

function unlockAchievement(id: AchievementId): void {
  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map(a => a.id));

  if (unlockedIds.has(id)) return; // Already unlocked

  const achievement: Achievement = {
    ...ACHIEVEMENTS[id],
    unlockedAt: Date.now(),
  };

  achievements.push(achievement);
  saveAchievements(achievements);

  // Dispatch event for UI to show celebration
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('personality:achievement', {
        detail: { achievement },
      }),
    );
  }

  // Check for achievement milestones (first achievement, halfway, complete)
  const achievementMilestone = checkAchievementMilestone(achievements.length);
  if (achievementMilestone) {
    dispatchMilestoneReached(achievementMilestone);
  }
}

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
