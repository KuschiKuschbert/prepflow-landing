import type { Achievement } from '../../achievements';

const STORAGE_KEY = 'prepflow-achievements';
const STORAGE_STATS_KEY = 'prepflow-achievement-stats';

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

export function getDefaultStats(): AchievementStats {
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

export function loadStats(): AchievementStats {
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

export function saveStats(stats: AchievementStats): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore errors
  }
}

export function loadAchievements(): Achievement[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Achievement[];
    }
  } catch {
    // Ignore errors
  }

  return [];
}

export function saveAchievements(achievements: Achievement[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  } catch {
    // Ignore errors
  }
}
