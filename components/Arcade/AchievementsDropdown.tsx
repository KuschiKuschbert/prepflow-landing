/**
 * Achievements Dropdown
 *
 * Modal showing all arcade game stats and achievements.
 * Triggered by holding logo for 2 seconds or pressing Shift+A.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getArcadeStats } from '@/lib/arcadeStats';
import { throwConfetti } from '@/hooks/useConfetti';
import WebAppBackground from '@/components/Arcade/WebAppBackground';
import {
  getAllAchievements,
  getUnlockedAchievements,
  getAchievementProgress,
  getAchievementStats,
} from '@/lib/gamification/achievements';
import { AchievementCard } from '@/components/gamification/AchievementCard';
import { ProgressBar } from '@/components/gamification/ProgressBar';
import { useGamification } from '@/hooks/useGamification';
import type { AchievementId } from '@/lib/gamification/types';

interface AchievementsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsDropdown: React.FC<AchievementsDropdownProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(() => getArcadeStats());
  const { achievementProgress, streak } = useGamification();
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => getUnlockedAchievements());
  const [allAchievements, setAllAchievements] = useState(() => getAllAchievements());
  const [activeTab, setActiveTab] = useState<'arcade' | 'achievements'>('arcade');

  // Update stats when dropdown opens to ensure fresh data
  useEffect(() => {
    if (isOpen) {
      setStats(getArcadeStats());
      setUnlockedAchievements(getUnlockedAchievements());
      setAllAchievements(getAllAchievements());
    }
  }, [isOpen]);

  // Only listen to stats updates when dropdown is open to avoid setState during render
  useEffect(() => {
    if (!isOpen) return;

    const handleStatsUpdate = () => {
      // Only update if dropdown is still open
      setStats(getArcadeStats());
    };

    const handleAchievementUpdate = () => {
      setUnlockedAchievements(getUnlockedAchievements());
      setAllAchievements(getAllAchievements());
    };

    window.addEventListener('arcade:statsUpdated', handleStatsUpdate);
    window.addEventListener('personality:achievement', handleAchievementUpdate);
    return () => {
      window.removeEventListener('arcade:statsUpdated', handleStatsUpdate);
      window.removeEventListener('personality:achievement', handleAchievementUpdate);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Show confetti preview if any stat >= 10
  const showConfettiPreview = stats.tomatoes >= 10 || stats.dockets >= 10 || stats.fires >= 10;

  // Group achievements by category
  const achievementCategories = {
    'App Usage': [
      'FIRST_RECIPE',
      'TEN_INGREDIENTS',
      'FIRST_DISH',
      'HUNDRED_SAVES',
    ] as AchievementId[],
    Mastery: ['COGS_MASTER', 'PERFORMANCE_GURU', 'TEMPERATURE_PRO'] as AchievementId[],
    Social: ['RECIPE_SHARER', 'MENU_BUILDER'] as AchievementId[],
    Consistency: ['WEEKLY_STREAK'] as AchievementId[],
  };

  const unlockedIds = new Set(unlockedAchievements.map(a => a.id));

  if (!isOpen) return null;

  return (
    <>
      <WebAppBackground />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative z-50 w-full max-w-md rounded-3xl border border-[var(--border)] bg-[#2E4053] p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-fluid-2xl font-bold text-[var(--foreground)]">🏆 Achievements</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-[var(--foreground)]/80 transition-colors hover:bg-white/10 hover:text-[var(--foreground)]"
                aria-label="Close achievements"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 border-b border-[var(--border)]">
              <button
                onClick={() => setActiveTab('arcade')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'arcade'
                    ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                }`}
              >
                🎮 Arcade Games
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'achievements'
                    ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                }`}
              >
                🏆 App Achievements ({achievementProgress.unlocked}/{achievementProgress.total})
              </button>
            </div>

            {/* Content */}
            {activeTab === 'arcade' && (
              <div className="space-y-4">
                {/* Tomatoes */}
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-fluid-2xl">🍅</span>
                    <div>
                      <div className="font-semibold text-[var(--foreground)]">Tomatoes Thrown</div>
                      <div className="text-fluid-sm text-[var(--foreground-muted)]">
                        Frustration splats.
                      </div>
                    </div>
                  </div>
                  <div className="text-fluid-2xl font-bold text-[#4CAF50]">{stats.tomatoes}</div>
                </div>

                {/* Dockets */}
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-fluid-2xl">🧾</span>
                    <div>
                      <div className="font-semibold text-[var(--foreground)]">Dockets Caught</div>
                      <div className="text-fluid-sm text-[var(--foreground-muted)]">
                        Orders snatched.
                      </div>
                    </div>
                  </div>
                  <div className="text-fluid-2xl font-bold text-[#4CAF50]">{stats.dockets}</div>
                </div>

                {/* Fires */}
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-fluid-2xl">🔥</span>
                    <div>
                      <div className="font-semibold text-[var(--foreground)]">
                        Fires Extinguished
                      </div>
                      <div className="text-fluid-sm text-[var(--foreground-muted)]">
                        Crises averted.
                      </div>
                    </div>
                  </div>
                  <div className="text-fluid-2xl font-bold text-[#4CAF50]">{stats.fires}</div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                {/* Overall Progress */}
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
                    <div className="mt-3 text-sm text-[var(--tertiary)]">
                      🔥 {streak} day{streak === 1 ? '' : 's'} streak
                    </div>
                  )}
                </div>

                {/* Achievements by Category */}
                {Object.entries(achievementCategories).map(([category, achievementIds]) => {
                  const categoryAchievements = allAchievements.filter(a =>
                    achievementIds.includes(a.id),
                  );

                  if (categoryAchievements.length === 0) return null;

                  return (
                    <div key={category} className="space-y-3">
                      <h3 className="text-sm font-semibold text-[var(--foreground-secondary)]">
                        {category}
                      </h3>
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
            )}

            {/* Confetti Preview */}
            {showConfettiPreview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-[#4CAF50]/30 bg-[#4CAF50]/10 p-4 text-center"
              >
                <p className="text-fluid-sm text-[#4CAF50]">
                  🎉 You&apos;ve reached milestone achievements! Keep it up!
                </p>
              </motion.div>
            )}

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={onClose}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] via-[var(--tertiary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-[var(--tertiary)]/25 hover:shadow-xl"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
