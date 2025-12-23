/**
 * Unified Gamification System - Milestones
 *
 * Milestone definitions and tracking for subtle gamification.
 * Milestones trigger brief celebrations without being intrusive.
 */

import type { Milestone } from './types';
import { ARCADE_MILESTONES, USAGE_MILESTONES, ACHIEVEMENT_MILESTONES } from './milestones/constants';
import { throwSubtleConfetti } from './milestones/helpers/confetti';
import {
  checkArcadeMilestone,
  checkUsageMilestone,
  checkAchievementMilestone,
} from './milestones/helpers/checkMilestones';
import { getMilestoneProgress } from './milestones/helpers/milestoneProgress';

export { ARCADE_MILESTONES, USAGE_MILESTONES, ACHIEVEMENT_MILESTONES };
export { throwSubtleConfetti };
export { checkArcadeMilestone, checkUsageMilestone, checkAchievementMilestone };
export { getMilestoneProgress };

/**
 * Dispatch milestone reached event
 */
export function dispatchMilestoneReached(milestone: Milestone): void {
  if (typeof window === 'undefined') return;

  throwSubtleConfetti(0.5);

  import('@/lib/gamification/events').then(({ dispatchMilestoneReached: dispatchEvent }) => {
    dispatchEvent(milestone);
  });
}
