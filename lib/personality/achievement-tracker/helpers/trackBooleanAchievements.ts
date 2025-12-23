import { type AchievementId } from '../../achievements';
import { loadStats, saveStats, loadAchievements } from './storage';
import { updateStreak } from './streak';
import { unlockAchievement } from './unlockAchievement';

export function trackCOGSCalculated(): AchievementId | null {
  const stats = loadStats();
  if (stats.cogsCalculated) return null;

  stats.cogsCalculated = true;
  saveStats(stats);

  updateStreak();

  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map((a: any) => a.id));

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
  const unlockedIds = new Set(achievements.map((a: any) => a.id));

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
  const unlockedIds = new Set(achievements.map((a: any) => a.id));

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
  const unlockedIds = new Set(achievements.map((a: any) => a.id));

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
  const unlockedIds = new Set(achievements.map((a: any) => a.id));

  if (!unlockedIds.has('MENU_BUILDER')) {
    unlockAchievement('MENU_BUILDER');
    return 'MENU_BUILDER';
  }

  return null;
}

