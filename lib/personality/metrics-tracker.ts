// PrepFlow Personality System - Real Metrics Tracker

import { getStats } from './achievement-tracker';

export interface RealMetrics {
  saveCountToday: number;
  saveCountWeek: number;
  saveCountAllTime: number;
  recipeCount: number;
  ingredientCount: number;
  dishCount: number;
  recipesNeedingIngredients: number;
  lastActiveDate: string;
  streakDays: number;
}

/**
 * Get real metrics from achievement stats
 * This can be enhanced later to fetch from API
 */
export function getRealMetrics(): RealMetrics {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // For now, we use achievement stats
  // In the future, this could fetch from API endpoints
  return {
    saveCountToday: stats.lastActiveDate === today ? stats.saveCount : 0, // Simplified
    saveCountWeek: stats.saveCount, // Simplified - would need date tracking
    saveCountAllTime: stats.saveCount,
    recipeCount: stats.recipeCount,
    ingredientCount: stats.ingredientCount,
    dishCount: stats.dishCount,
    recipesNeedingIngredients: 0, // Would need to fetch from API
    lastActiveDate: stats.lastActiveDate,
    streakDays: stats.streakDays,
  };
}

/**
 * Check if user has recent activity
 */
export function hasRecentActivity(days = 1): boolean {
  const metrics = getRealMetrics();
  if (!metrics.lastActiveDate) return false;

  const lastActive = new Date(metrics.lastActiveDate);
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return lastActive >= cutoff;
}

