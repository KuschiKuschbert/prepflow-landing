import { USAGE_MILESTONES, ACHIEVEMENT_MILESTONES } from '../constants';

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

  const allMilestones = [...USAGE_MILESTONES, ...ACHIEVEMENT_MILESTONES].sort(
    (a, b) => a.threshold - b.threshold,
  );
  const nextMilestone = allMilestones.find(m => m.threshold > milestone.threshold);

  return {
    progress,
    nextThreshold: nextMilestone?.threshold ?? null,
  };
}

