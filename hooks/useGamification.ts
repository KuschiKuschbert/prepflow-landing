/**
 * Unified Gamification Hook
 *
 * Provides unified access to gamification features including
 * stats, achievements, and milestones.
 */

import { useEffect, useState, useCallback } from 'react';
import { getGamificationStats, getArcadeStats, getSessionStats } from '@/lib/gamification/stats';
import {
  getUnlockedAchievements,
  getAchievementProgress,
  getAchievementStats,
} from '@/lib/gamification/achievements';
import {
  subscribeArcadeStats,
  subscribeSessionStats,
  subscribeAchievements,
} from '@/lib/gamification/events';
import type {
  GamificationStats,
  ArcadeStats,
  Achievement,
  AchievementProgress,
} from '@/lib/gamification/types';

/**
 * Hook for accessing gamification stats and achievements
 */
export function useGamification() {
  const [stats, setStats] = useState<GamificationStats>(() => getGamificationStats());
  const [arcadeStats, setArcadeStats] = useState<ArcadeStats>(() => getArcadeStats());
  const [sessionStats, setSessionStats] = useState<ArcadeStats>(() => getSessionStats());
  const [achievements, setAchievements] = useState<Achievement[]>(() => getUnlockedAchievements());
  const [achievementProgress, setAchievementProgress] = useState<AchievementProgress>(() =>
    getAchievementProgress(),
  );
  const [streak, setStreak] = useState<number>(() => getAchievementStats().streakDays);

  // Subscribe to arcade stats updates
  useEffect(() => {
    const unsubscribe = subscribeArcadeStats(() => {
      setArcadeStats(getArcadeStats());
      setStats(getGamificationStats());
    });

    return unsubscribe;
  }, []);

  // Subscribe to session stats updates
  useEffect(() => {
    const unsubscribe = subscribeSessionStats(() => {
      setSessionStats(getSessionStats());
    });

    return unsubscribe;
  }, []);

  // Subscribe to achievement unlocks
  useEffect(() => {
    const unsubscribe = subscribeAchievements(() => {
      setAchievements(getUnlockedAchievements());
      setAchievementProgress(getAchievementProgress());
      setStats(getGamificationStats());
    });

    return unsubscribe;
  }, []);

  // Refresh stats function
  const refreshStats = useCallback(() => {
    setStats(getGamificationStats());
    setArcadeStats(getArcadeStats());
    setSessionStats(getSessionStats());
    setAchievements(getUnlockedAchievements());
    setAchievementProgress(getAchievementProgress());
    setStreak(getAchievementStats().streakDays);
  }, []);

  return {
    stats,
    arcadeStats,
    sessionStats,
    achievements,
    achievementProgress,
    streak,
    refreshStats,
  };
}
