/**
 * Achievement Card Component
 *
 * Enhanced achievement display with progress indication.
 * Shows unlocked achievements with celebration styling, and locked achievements with progress.
 */

'use client';

import { getAchievementStats } from '@/lib/gamification/achievements';
import type { Achievement, AchievementProgress } from '@/lib/gamification/types';
import { ProgressBar } from './ProgressBar';

interface AchievementCardProps {
  /**
   * Achievement definition
   */
  achievement: Omit<Achievement, 'unlockedAt'>;

  /**
   * Whether achievement is unlocked
   */
  unlocked: boolean;

  /**
   * Optional progress information
   */
  progress?: AchievementProgress;

  /**
   * Optional current progress value (for specific achievements)
   */
  currentValue?: number;

  /**
   * Optional target value (for specific achievements)
   */
  targetValue?: number;
}

/**
 * Get progress for specific achievement
 */
function getAchievementSpecificProgress(
  achievementId: string,
  currentValue?: number,
  targetValue?: number,
): number {
  if (currentValue === undefined || targetValue === undefined) {
    return 0;
  }

  return Math.min((currentValue / targetValue) * 100, 100);
}

/**
 * Get current value for achievement based on stats
 */
function getAchievementCurrentValue(achievementId: string): number | undefined {
  const stats = getAchievementStats();

  switch (achievementId) {
    case 'TEN_INGREDIENTS':
      return stats.ingredientCount;
    case 'HUNDRED_SAVES':
      return stats.saveCount;
    case 'FIRST_RECIPE':
      return stats.recipeCount > 0 ? 1 : 0;
    case 'FIRST_DISH':
      return stats.dishCount > 0 ? 1 : 0;
    case 'WEEKLY_STREAK':
      return stats.streakDays;
    default:
      return undefined;
  }
}

/**
 * Get target value for achievement
 */
function getAchievementTargetValue(achievementId: string): number | undefined {
  switch (achievementId) {
    case 'TEN_INGREDIENTS':
      return 10;
    case 'HUNDRED_SAVES':
      return 100;
    case 'FIRST_RECIPE':
      return 1;
    case 'FIRST_DISH':
      return 1;
    case 'WEEKLY_STREAK':
      return 7;
    default:
      return undefined;
  }
}

export function AchievementCard({
  achievement,
  unlocked,
  progress,
  currentValue,
  targetValue,
}: AchievementCardProps) {
  const actualCurrentValue = currentValue ?? getAchievementCurrentValue(achievement.id);
  const actualTargetValue = targetValue ?? getAchievementTargetValue(achievement.id);
  const specificProgress =
    actualCurrentValue !== undefined && actualTargetValue !== undefined
      ? getAchievementSpecificProgress(achievement.id, actualCurrentValue, actualTargetValue)
      : undefined;

  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        unlocked ? 'border-[var(--primary)]/30 bg-[var(--primary)]/10' : 'border-[var(--border)] bg-[var(--surface)]'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${
            unlocked ? 'bg-[var(--primary)]/20' : 'bg-[var(--muted)]'
          }`}
        >
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <h3 className={`font-semibold ${unlocked ? 'text-[var(--primary)]' : 'text-[var(--foreground-secondary)]'}`}>
              {achievement.name}
            </h3>
            {unlocked && <span className="text-xs text-[var(--primary)]">✓ Unlocked</span>}
          </div>

          <p className="mb-3 text-sm text-[var(--foreground-muted)]">{achievement.description}</p>

          {/* Progress Bar */}
          {!unlocked && (specificProgress !== undefined || actualCurrentValue !== undefined) && (
            <div className="space-y-1">
              {actualCurrentValue !== undefined && actualTargetValue !== undefined && (
                <div className="text-xs text-[var(--foreground-subtle)]">
                  {actualCurrentValue} / {actualTargetValue}
                </div>
              )}
              <ProgressBar
                progress={specificProgress ?? 0}
                variant="primary"
                size="sm"
                animated={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AchievementCard;



