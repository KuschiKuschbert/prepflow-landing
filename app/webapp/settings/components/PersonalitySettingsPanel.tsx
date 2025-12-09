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
    <div className="mt-8 space-y-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">PrepFlow Personality</h2>
          <p className="mt-1 text-sm text-gray-400">
            Add charming micro-moments, humor, and seasonal flair to your PrepFlow experience.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={e => set({ enabled: e.target.checked })}
            className="h-5 w-5 rounded border-[#2a2a2a] bg-[#1f1f1f] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
          />
          <span className="text-sm text-gray-300">Enable</span>
        </label>
      </div>

      {/* Achievements Section */}
      {settings.enabled && (
        <>
          <div className="border-t border-[#2a2a2a] pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Achievements</h3>
              <span className="text-xs text-gray-400">
                {progress.unlocked} / {progress.total} ({progress.percentage}%)
              </span>
            </div>
            <div className="desktop:grid-cols-3 grid grid-cols-2 gap-2">
              {getAllAchievements().map(achievement => {
                const unlocked = achievements.find(a => a.id === achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-lg border p-2 text-center ${
                      unlocked
                        ? 'border-[#29E7CD]/50 bg-[#29E7CD]/10'
                        : 'border-[#2a2a2a] bg-[#2a2a2a]/20 opacity-50'
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="mt-1 text-xs font-medium text-gray-300">{achievement.name}</div>
                    {unlocked && <div className="mt-1 text-xs text-[#29E7CD]">Unlocked!</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Behavior Insights */}
          <div className="border-t border-[#2a2a2a] pt-4">
            <h3 className="mb-3 text-sm font-medium text-gray-300">Personality Insights</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div>
                <span className="font-medium text-gray-300">User Level:</span>{' '}
                {behaviorProfile.userExperience === 'new' ? 'New Chef' : 'Experienced Chef'}
              </div>
              <div>
                <span className="font-medium text-gray-300">Save Frequency:</span>{' '}
                {behaviorProfile.saveFrequency.charAt(0).toUpperCase() +
                  behaviorProfile.saveFrequency.slice(1)}
              </div>
              <div>
                <span className="font-medium text-gray-300">Session Duration:</span>{' '}
                {behaviorProfile.sessionDuration.charAt(0).toUpperCase() +
                  behaviorProfile.sessionDuration.slice(1)}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Personality adapts based on your usage patterns. Keep using PrepFlow to unlock more
                insights!
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 border-t border-[#2a2a2a] pt-4">
            <button
              onClick={() => {
                silenceFor24h();
                showInfo('Personality silenced for 24 hours');
              }}
              className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/50"
            >
              Silence for 24h
            </button>
          </div>
        </>
      )}
    </div>
  );
}
