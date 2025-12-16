// PrepFlow Personality System - Achievement Definitions

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

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string; // Emoji or icon identifier
  unlockedAt?: number; // Timestamp when unlocked
}

export const ACHIEVEMENTS: Record<AchievementId, Omit<Achievement, 'unlockedAt'>> = {
  FIRST_RECIPE: {
    id: 'FIRST_RECIPE',
    name: 'First Recipe',
    description: 'Created your first recipe',
    icon: '📝',
  },
  TEN_INGREDIENTS: {
    id: 'TEN_INGREDIENTS',
    name: 'Stock Master',
    description: 'Added 10 ingredients to your inventory',
    icon: '🥬',
  },
  FIRST_DISH: {
    id: 'FIRST_DISH',
    name: 'Menu Maker',
    description: 'Created your first menu dish',
    icon: '🍽️',
  },
  HUNDRED_SAVES: {
    id: 'HUNDRED_SAVES',
    name: 'Save Master',
    description: 'Saved 100 times',
    icon: '💾',
  },
  WEEKLY_STREAK: {
    id: 'WEEKLY_STREAK',
    name: 'Dedicated Chef',
    description: 'Used PrepFlow for 7 days in a row',
    icon: '🔥',
  },
  COGS_MASTER: {
    id: 'COGS_MASTER',
    name: 'COGS Master',
    description: 'Calculated your first COGS',
    icon: '💰',
  },
  PERFORMANCE_GURU: {
    id: 'PERFORMANCE_GURU',
    name: 'Performance Guru',
    description: 'Analyzed your menu performance',
    icon: '📊',
  },
  TEMPERATURE_PRO: {
    id: 'TEMPERATURE_PRO',
    name: 'Temperature Pro',
    description: 'Logged your first temperature reading',
    icon: '🌡️',
  },
  RECIPE_SHARER: {
    id: 'RECIPE_SHARER',
    name: 'Recipe Sharer',
    description: 'Shared a recipe with another user',
    icon: '🤝',
  },
  MENU_BUILDER: {
    id: 'MENU_BUILDER',
    name: 'Menu Builder',
    description: 'Built your first complete menu',
    icon: '📋',
  },
};

export function getAchievement(id: AchievementId): Omit<Achievement, 'unlockedAt'> | undefined {
  return ACHIEVEMENTS[id];
}

export function getAllAchievements(): Omit<Achievement, 'unlockedAt'>[] {
  return Object.values(ACHIEVEMENTS);
}




