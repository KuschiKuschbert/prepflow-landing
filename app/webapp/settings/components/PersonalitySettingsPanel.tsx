// PrepFlow Personality System - Settings Panel Component

'use client';

import { useNotification } from '@/contexts/NotificationContext';
import {
  getAchievementProgress,
  getUnlockedAchievements,
} from '@/lib/personality/achievement-tracker';
import { ACHIEVEMENTS, getAllAchievements } from '@/lib/personality/achievements';
import { getBehaviorProfile } from '@/lib/personality/behavior-tracker';
import { usePersonality } from '@/lib/personality/store';
import { useEffect, useState } from 'react';

export function PersonalitySettingsPanel() {
  const { settings, set, silenceFor24h } = usePersonality();
  const { showInfo } = useNotification();
  // Initialize with default values to match SSR and prevent hydration mismatch
  const [achievements, setAchievements] = useState<ReturnType<typeof getUnlockedAchievements>>([]);
  const [progress, setProgress] = useState<ReturnType<typeof getAchievementProgress>>({
    unlocked: 0,
    total: Object.keys(ACHIEVEMENTS).length,
    percentage: 0,
  });
  const [behaviorProfile, setBehaviorProfile] = useState<ReturnType<typeof getBehaviorProfile>>({
    userExperience: 'new',
    saveFrequency: 'medium',
    sessionDuration: 'medium',
    featureUsage: {
      ingredients: 0,
      recipes: 0,
      cogs: 0,
      performance: 0,
      temperature: 0,
      menu: 0,
    },
    timeOfDayUsage: {
      morning: 0,
      lunch: 0,
      evening: 0,
      late: 0,
    },
    lastUpdated: 0, // Will be updated after hydration
  });

  // Load data after hydration and refresh periodically
  useEffect(() => {
    // Load initial data from localStorage only on client after hydration
    setAchievements(getUnlockedAchievements());
    setProgress(getAchievementProgress());
    setBehaviorProfile(getBehaviorProfile());

    // Refresh achievements and behavior profile periodically
    const interval = setInterval(() => {
      setAchievements(getUnlockedAchievements());
      setProgress(getAchievementProgress());
      setBehaviorProfile(getBehaviorProfile());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">PrepFlow Personality</h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Add charming micro-moments, humor, and seasonal flair to your PrepFlow experience.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={e => set({ enabled: e.target.checked })}
            className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
          />
          <span className="text-sm text-[var(--foreground-secondary)]">Enable</span>
        </label>
      </div>

      {/* Achievements Section */}
      {settings.enabled && (
        <>
          <div className="border-t border-[var(--border)] pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-[var(--foreground-secondary)]">
                Achievements
              </h3>
              <span className="text-xs text-[var(--foreground-muted)]">
                {progress.unlocked} / {progress.total} ({progress.percentage}%)
              </span>
            </div>
            <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-2 gap-2">
              {getAllAchievements().map(achievement => {
                const unlocked = achievements.find(a => a.id === achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-lg border p-2 text-center ${
                      unlocked
                        ? 'border-[var(--primary)]/50 bg-[var(--primary)]/10'
                        : 'border-[var(--border)] bg-[var(--muted)]/20 opacity-50'
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="mt-1 text-xs font-medium text-[var(--foreground-secondary)]">
                      {achievement.name}
                    </div>
                    {unlocked && (
                      <div className="mt-1 text-xs text-[var(--primary)]">Unlocked!</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Behavior Insights */}
          <div className="border-t border-[var(--border)] pt-4">
            <h3 className="mb-3 text-sm font-medium text-[var(--foreground-secondary)]">
              Personality Insights
            </h3>
            <div className="space-y-2 text-sm text-[var(--foreground-muted)]">
              <div>
                <span className="font-medium text-[var(--foreground-secondary)]">User Level:</span>{' '}
                {behaviorProfile.userExperience === 'new' ? 'New Chef' : 'Experienced Chef'}
              </div>
              <div>
                <span className="font-medium text-[var(--foreground-secondary)]">
                  Save Frequency:
                </span>{' '}
                {behaviorProfile.saveFrequency.charAt(0).toUpperCase() +
                  behaviorProfile.saveFrequency.slice(1)}
              </div>
              <div>
                <span className="font-medium text-[var(--foreground-secondary)]">
                  Session Duration:
                </span>{' '}
                {behaviorProfile.sessionDuration.charAt(0).toUpperCase() +
                  behaviorProfile.sessionDuration.slice(1)}
              </div>
              <div className="mt-2 text-xs text-[var(--foreground-subtle)]">
                Personality adapts based on your usage patterns. Keep using PrepFlow to unlock more
                insights!
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 border-t border-[var(--border)] pt-4">
            <button
              onClick={() => {
                silenceFor24h();
                showInfo('Personality silenced for 24 hours');
              }}
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 px-4 py-2 text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)]/50"
            >
              Silence for 24h
            </button>
          </div>
        </>
      )}
    </div>
  );
}
