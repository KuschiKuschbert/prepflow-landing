/**
 * Stats Display Component
 *
 * Unified component for displaying gamification stats.
 * Shows arcade stats, achievement progress, and streak.
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { useGamification } from '@/hooks/useGamification';
import { Cherry, FileText, Flame } from 'lucide-react';
import { ProgressRing } from './ProgressRing';

interface StatsDisplayProps {
  /**
   * Show arcade stats
   */
  showArcade?: boolean;

  /**
   * Show achievement progress
   */
  showAchievements?: boolean;

  /**
   * Show streak
   */
  showStreak?: boolean;

  /**
   * Compact mode (smaller display)
   */
  compact?: boolean;

  /**
   * Optional className
   */
  className?: string;
}

export function StatsDisplay({
  showArcade = true,
  showAchievements = true,
  showStreak = true,
  compact = false,
  className = '',
}: StatsDisplayProps) {
  const { stats, achievementProgress, streak } = useGamification();

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {showArcade && (
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <span className="flex items-center gap-1">
              <Icon icon={Cherry} size="xs" aria-hidden={true} />
              {stats.arcade.tomatoes}
            </span>
            <span className="flex items-center gap-1">
              <Icon icon={FileText} size="xs" aria-hidden={true} />
              {stats.arcade.dockets}
            </span>
            <span className="flex items-center gap-1">
              <Icon icon={Flame} size="xs" aria-hidden={true} />
              {stats.arcade.fires}
            </span>
          </div>
        )}
        {showAchievements && (
          <div className="flex items-center gap-2">
            <ProgressRing progress={achievementProgress.percentage} size={24} strokeWidth={2} />
            <span className="text-sm text-[var(--foreground-muted)]">
              {achievementProgress.unlocked}/{achievementProgress.total}
            </span>
          </div>
        )}
        {showStreak && streak > 0 && (
          <div className="text-sm text-[var(--foreground-muted)]">
            🔥 {streak} {streak === 1 ? 'day' : 'days'}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showArcade && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-[var(--foreground-secondary)]">
            Arcade Stats
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--foreground-muted)]">Tomatoes Thrown</span>
              <span className="text-[var(--foreground)]">{stats.arcade.tomatoes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--foreground-muted)]">Dockets Caught</span>
              <span className="text-[var(--foreground)]">{stats.arcade.dockets}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--foreground-muted)]">Fires Extinguished</span>
              <span className="text-[var(--foreground)]">{stats.arcade.fires}</span>
            </div>
          </div>
        </div>
      )}

      {showAchievements && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-[var(--foreground-secondary)]">
            Achievements
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--foreground-muted)]">Progress</span>
              <span className="text-sm text-[var(--foreground)]">
                {achievementProgress.unlocked} / {achievementProgress.total}
              </span>
            </div>
            <ProgressRing progress={achievementProgress.percentage} size={60} />
          </div>
        </div>
      )}

      {showStreak && streak > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-[var(--foreground-secondary)]">Streak</h3>
          <div className="flex items-center gap-2 text-lg font-semibold text-[var(--tertiary)]">
            <Icon icon={Flame} size="sm" aria-hidden={true} />
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
        </div>
      )}
    </div>
  );
}
