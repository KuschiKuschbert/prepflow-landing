'use client';

import { AchievementCard } from '@/components/gamification/AchievementCard';
import { ProgressBar } from '@/components/gamification/ProgressBar';
import { Icon } from '@/components/ui/Icon';
import type { Achievement, AchievementId } from '@/lib/gamification/types';
import { Flame } from 'lucide-react';

const ACHIEVEMENT_CATEGORIES: Record<string, AchievementId[]> = {
  'App Usage': ['FIRST_RECIPE', 'TEN_INGREDIENTS', 'FIRST_DISH', 'HUNDRED_SAVES'],
  Mastery: ['COGS_MASTER', 'PERFORMANCE_GURU', 'TEMPERATURE_PRO'],
  Social: ['RECIPE_SHARER', 'MENU_BUILDER'],
  Consistency: ['WEEKLY_STREAK'],
};

interface AchievementsDropdownAchievementsTabProps {
  allAchievements: Achievement[];
  unlockedIds: Set<string>;
  achievementProgress: { unlocked: number; total: number; percentage: number };
  streak: number;
}

export function AchievementsDropdownAchievementsTab({
  allAchievements,
  unlockedIds,
  achievementProgress,
  streak,
}: AchievementsDropdownAchievementsTabProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-[var(--foreground)]">Overall Progress</h3>
          <span className="text-sm text-[var(--foreground-muted)]">
            {achievementProgress.unlocked} / {achievementProgress.total}
          </span>
        </div>
        <ProgressBar
          progress={achievementProgress.percentage}
          variant="primary"
          size="md"
          showPercentage={true}
        />
        {streak > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-[var(--tertiary)]">
            <Icon icon={Flame} size="sm" aria-hidden={true} />
            {streak} day{streak === 1 ? '' : 's'} streak
          </div>
        )}
      </div>
      {Object.entries(ACHIEVEMENT_CATEGORIES).map(([category, achievementIds]) => {
        const categoryAchievements = allAchievements.filter(a => achievementIds.includes(a.id));
        if (categoryAchievements.length === 0) return null;
        return (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">{category}</h3>
            <div className="space-y-2">
              {categoryAchievements.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={unlockedIds.has(achievement.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
