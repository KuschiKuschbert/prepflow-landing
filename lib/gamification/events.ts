/**
 * Unified Gamification System - Events
 *
 * Event system for gamification triggers and notifications.
 * Provides unified event dispatching and listening.
 */

import type { Achievement, Milestone } from './types';

/**
 * Dispatch arcade stats updated event
 */
export function dispatchArcadeStatsUpdated(): void {
  if (typeof window === 'undefined') return;

  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:statsUpdated'));
    }, 0);
  });
}

/**
 * Dispatch session stats updated event
 */
export function dispatchSessionStatsUpdated(): void {
  if (typeof window === 'undefined') return;

  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('arcade:sessionStatsUpdated'));
    }, 0);
  });
}

/**
 * Dispatch achievement unlocked event
 */
export function dispatchAchievementUnlocked(achievement: Achievement): void {
  if (typeof window === 'undefined') return;

  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('personality:achievement', {
          detail: { achievement },
        }),
      );
    }, 0);
  });
}

/**
 * Dispatch milestone reached event
 */
export function dispatchMilestoneReached(milestone: Milestone): void {
  if (typeof window === 'undefined') return;

  requestAnimationFrame(() => {
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('gamification:milestone', {
          detail: { milestone },
        }),
      );
    }, 0);
  });
}

/**
 * Event listener types
 */
export type ArcadeStatsListener = () => void;
export type SessionStatsListener = () => void;
export type AchievementListener = (event: CustomEvent<{ achievement: Achievement }>) => void;
export type MilestoneListener = (event: CustomEvent<{ milestone: Milestone }>) => void;

/**
 * Subscribe to arcade stats updates
 */
export function subscribeArcadeStats(listener: ArcadeStatsListener): () => void {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('arcade:statsUpdated', listener);
  return () => window.removeEventListener('arcade:statsUpdated', listener);
}

/**
 * Subscribe to session stats updates
 */
export function subscribeSessionStats(listener: SessionStatsListener): () => void {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('arcade:sessionStatsUpdated', listener);
  return () => window.removeEventListener('arcade:sessionStatsUpdated', listener);
}

/**
 * Subscribe to achievement unlocks
 */
export function subscribeAchievements(listener: AchievementListener): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => listener(e as CustomEvent<{ achievement: Achievement }>);
  window.addEventListener('personality:achievement', handler);
  return () => window.removeEventListener('personality:achievement', handler);
}

/**
 * Subscribe to milestone events
 */
export function subscribeMilestones(listener: MilestoneListener): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => listener(e as CustomEvent<{ milestone: Milestone }>);
  window.addEventListener('gamification:milestone', handler);
  return () => window.removeEventListener('gamification:milestone', handler);
}

