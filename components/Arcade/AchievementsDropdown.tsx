/**
 * Achievements Dropdown
 *
 * Modal showing all arcade game stats and achievements.
 * Triggered by holding logo for 2 seconds or pressing Shift+A.
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import WebAppBackground from '@/components/Arcade/WebAppBackground';
import { AchievementsDropdownAchievementsTab } from '@/components/Arcade/AchievementsDropdownAchievementsTab';
import { AchievementsDropdownArcadeTab } from '@/components/Arcade/AchievementsDropdownArcadeTab';
import { useGamification } from '@/hooks/useGamification';
import { getArcadeStats } from '@/lib/arcadeStats';
import { getAllAchievements, getUnlockedAchievements } from '@/lib/gamification/achievements';
import { Gamepad2, PartyPopper, Trophy, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

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

  const showConfettiPreview = stats.tomatoes >= 10 || stats.dockets >= 10 || stats.fires >= 10;
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
              <h2 className="text-fluid-2xl flex items-center gap-2 font-bold text-[var(--foreground)]">
                <Icon icon={Trophy} size="lg" aria-hidden={true} />
                Achievements
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-[var(--foreground-muted)] transition-colors hover:bg-white/10 hover:text-[var(--foreground)]"
                aria-label="Close achievements"
              >
                <Icon icon={X} size="md" aria-hidden={true} />
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
                <span className="flex items-center gap-2">
                  <Icon icon={Gamepad2} size="sm" aria-hidden={true} />
                  Arcade Games
                </span>
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'achievements'
                    ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon icon={Trophy} size="sm" aria-hidden={true} />
                  App Achievements ({achievementProgress.unlocked}/{achievementProgress.total})
                </span>
              </button>
            </div>

            {/* Content */}
            {activeTab === 'arcade' && <AchievementsDropdownArcadeTab stats={stats} />}
            {activeTab === 'achievements' && (
              <AchievementsDropdownAchievementsTab
                allAchievements={allAchievements}
                unlockedIds={unlockedIds}
                achievementProgress={achievementProgress}
                streak={streak}
              />
            )}

            {/* Confetti Preview */}
            {showConfettiPreview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-[#4CAF50]/30 bg-[#4CAF50]/10 p-4 text-center"
              >
                <p className="text-fluid-sm flex items-center justify-center gap-2 text-[#4CAF50]">
                  <Icon icon={PartyPopper} size="sm" aria-hidden={true} />
                  You&apos;ve reached milestone achievements! Keep it up!
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
