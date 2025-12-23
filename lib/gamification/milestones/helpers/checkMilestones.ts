import type { Milestone } from '@/lib/gamification/types';
import { ARCADE_MILESTONES, USAGE_MILESTONES, ACHIEVEMENT_MILESTONES } from '../constants';
import { hasMilestoneBeenShown, saveShownMilestone } from './milestoneStorage';

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

