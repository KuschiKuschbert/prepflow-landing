import { type AchievementId } from '../../achievements';
import { loadStats, saveStats, loadAchievements } from './storage';
import { updateStreak } from './streak';
import { unlockAchievement } from './unlockAchievement';
import {
  checkUsageMilestone,
  checkAchievementMilestone,
  dispatchMilestoneReached,
} from '@/lib/gamification/milestones';

export function trackSave(): AchievementId | null {
  const stats = loadStats();
  stats.saveCount += 1;
  saveStats(stats);

  const streakDays = updateStreak();

  const achievements = loadAchievements();
  const unlockedIds = new Set(achievements.map((a: any) => a.id));

  if (stats.saveCount >= 100 && !unlockedIds.has('HUNDRED_SAVES')) {
    unlockAchievement('HUNDRED_SAVES');
    return 'HUNDRED_SAVES';
  }

  if (streakDays >= 7 && !unlockedIds.has('WEEKLY_STREAK')) {
    unlockAchievement('WEEKLY_STREAK');
    return 'WEEKLY_STREAK';
  }

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
  const unlockedIds = new Set(achievements.map((a: any) => a.id));

  if (stats.recipeCount === 1 && !unlockedIds.has('FIRST_RECIPE')) {
    unlockAchievement('FIRST_RECIPE');
    return 'FIRST_RECIPE';
  }

  const recipeMilestone = checkUsageMilestone('usage:10-recipes', stats.recipeCount);
  if (recipeMilestone) {
    dispatchMilestoneReached(recipeMilestone);
  }

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
  const unlockedIds = new Set(achievements.map((a: any) => a.id));

  if (stats.ingredientCount >= 10 && !unlockedIds.has('TEN_INGREDIENTS')) {
    unlockAchievement('TEN_INGREDIENTS');
    return 'TEN_INGREDIENTS';
  }

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
  const unlockedIds = new Set(achievements.map((a: any) => a.id));

  if (stats.dishCount === 1 && !unlockedIds.has('FIRST_DISH')) {
    unlockAchievement('FIRST_DISH');
    return 'FIRST_DISH';
  }

  return null;
}
