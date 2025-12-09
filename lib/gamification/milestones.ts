/**
 * Unified Gamification System - Milestones
 *
 * Milestone definitions and tracking for subtle gamification.
 * Milestones trigger brief celebrations without being intrusive.
 */

import type { Milestone, MilestoneType } from './types';
import { getArcadeStats, getGamificationStats } from './stats';
import { getAchievementProgress } from './achievements';
import confetti from 'canvas-confetti';

const MILESTONE_STORAGE_KEY = 'prepflow-milestones-shown';

/**
 * Load shown milestones from storage
 */
function loadShownMilestones(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const stored = localStorage.getItem(MILESTONE_STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    // Ignore errors
  }

  return new Set();
}

/**
 * Save shown milestone to storage
 */
function saveShownMilestone(milestoneId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const shown = loadShownMilestones();
    shown.add(milestoneId);
    localStorage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify(Array.from(shown)));
  } catch {
    // Ignore errors
  }
}

/**
 * Check if milestone has been shown
 */
function hasMilestoneBeenShown(milestoneId: string): boolean {
  return loadShownMilestones().has(milestoneId);
}

/**
 * Vegetable-themed colors for confetti (subtle celebrations)
 */
const VEGETABLE_COLORS = [
  '#FF6B6B', // Tomato red
  '#4ECDC4', // Cucumber green
  '#FFE66D', // Corn yellow
  '#95E1D3', // Lettuce green
  '#F38181', // Carrot orange
  '#AA96DA', // Eggplant purple
  '#FCBAD3', // Radish pink
  '#FFFFD2', // Onion white/yellow
];

/**
 * Arcade milestones (trigger confetti at thresholds)
 */
export const ARCADE_MILESTONES = [10, 25, 50, 100] as const;

/**
 * Usage milestones (subtle celebrations)
 */
export const USAGE_MILESTONES: Milestone[] = [
  {
    id: 'usage:10-recipes',
    type: 'usage',
    name: 'Recipe Collection',
    description: 'Created 10 recipes',
    threshold: 10,
    icon: '📝',
  },
  {
    id: 'usage:50-ingredients',
    type: 'usage',
    name: 'Stock Master',
    description: 'Added 50 ingredients',
    threshold: 50,
    icon: '🥬',
  },
  {
    id: 'usage:100-saves',
    type: 'usage',
    name: 'Save Master',
    description: 'Saved 100 times',
    threshold: 100,
    icon: '💾',
  },
];

/**
 * Achievement milestones
 */
export const ACHIEVEMENT_MILESTONES: Milestone[] = [
  {
    id: 'achievement:first',
    type: 'achievement',
    name: 'First Achievement',
    description: 'Unlocked your first achievement',
    threshold: 1,
    icon: '🏆',
  },
  {
    id: 'achievement:halfway',
    type: 'achievement',
    name: 'Halfway There',
    description: 'Unlocked 50% of achievements',
    threshold: 5,
    icon: '⭐',
  },
  {
    id: 'achievement:complete',
    type: 'achievement',
    name: 'Achievement Master',
    description: 'Unlocked all achievements',
    threshold: 10,
    icon: '👑',
  },
];

/**
 * Throw subtle confetti (reduced particle count for subtlety)
 */
export function throwSubtleConfetti(intensity: number = 0.5): void {
  const particleCount = Math.floor(100 * intensity);

  confetti({
    particleCount,
    spread: 50,
    origin: { y: 0.6 },
    colors: VEGETABLE_COLORS,
    shapes: ['circle'],
  });
}

/**
 * Check if arcade milestone reached
 */
export function checkArcadeMilestone(
  statType: 'tomatoes' | 'dockets' | 'fires',
  currentValue: number,
): boolean {
  return ARCADE_MILESTONES.includes(currentValue as (typeof ARCADE_MILESTONES)[number]);
}

/**
 * Check if usage milestone reached (only returns milestone once)
 */
export function checkUsageMilestone(milestoneId: string, currentValue: number): Milestone | null {
  const milestone = USAGE_MILESTONES.find(m => m.id === milestoneId);
  if (!milestone) return null;

  // Only return milestone if threshold is reached AND hasn't been shown before
  if (currentValue >= milestone.threshold && !hasMilestoneBeenShown(milestoneId)) {
    saveShownMilestone(milestoneId);
    return milestone;
  }

  return null;
}

/**
 * Check if achievement milestone reached (only returns milestone once)
 */
export function checkAchievementMilestone(unlockedCount: number): Milestone | null {
  for (const milestone of ACHIEVEMENT_MILESTONES) {
    if (unlockedCount === milestone.threshold && !hasMilestoneBeenShown(milestone.id)) {
      saveShownMilestone(milestone.id);
      return milestone;
    }
  }
  return null;
}

/**
 * Get progress toward next milestone
 */
export function getMilestoneProgress(
  milestoneId: string,
  currentValue: number,
): { progress: number; nextThreshold: number | null } {
  const milestone = [...USAGE_MILESTONES, ...ACHIEVEMENT_MILESTONES].find(
    m => m.id === milestoneId,
  );

  if (!milestone) {
    return { progress: 0, nextThreshold: null };
  }

  const progress = Math.min((currentValue / milestone.threshold) * 100, 100);

  // Find next milestone
  const allMilestones = [...USAGE_MILESTONES, ...ACHIEVEMENT_MILESTONES].sort(
    (a, b) => a.threshold - b.threshold,
  );
  const nextMilestone = allMilestones.find(m => m.threshold > milestone.threshold);

  return {
    progress,
    nextThreshold: nextMilestone?.threshold ?? null,
  };
}

/**
 * Dispatch milestone reached event
 */
export function dispatchMilestoneReached(milestone: Milestone): void {
  if (typeof window === 'undefined') return;

  // Trigger subtle confetti
  throwSubtleConfetti(0.5);

  // Dispatch event for MilestoneToast component (using events.ts dispatcher)
  // Import dynamically to avoid circular dependency
  import('@/lib/gamification/events').then(({ dispatchMilestoneReached: dispatchEvent }) => {
    dispatchEvent(milestone);
  });
}
