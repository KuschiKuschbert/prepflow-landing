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

interface AchievementsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsDropdown: React.FC<AchievementsDropdownProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(() => getArcadeStats());

  useEffect(() => {
    const handleStatsUpdate = () => {
      setStats(getArcadeStats());
    };

    window.addEventListener('arcade:statsUpdated', handleStatsUpdate);
    return () => window.removeEventListener('arcade:statsUpdated', handleStatsUpdate);
  }, []);

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
            className="relative z-50 w-full max-w-md rounded-3xl border border-[#2a2a2a] bg-[#2E4053] p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">🏆 Achievements</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close achievements"
              >
                ✕
              </button>
            </div>

            {/* Stats Table */}
            <div className="space-y-4">
              {/* Tomatoes */}
              <div className="flex items-center justify-between rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍅</span>
                  <div>
                    <div className="font-semibold text-white">Tomatoes Thrown</div>
                    <div className="text-sm text-gray-400">Frustration splats.</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#4CAF50]">{stats.tomatoes}</div>
              </div>

              {/* Dockets */}
              <div className="flex items-center justify-between rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧾</span>
                  <div>
                    <div className="font-semibold text-white">Dockets Caught</div>
                    <div className="text-sm text-gray-400">Orders snatched.</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#4CAF50]">{stats.dockets}</div>
              </div>

              {/* Fires */}
              <div className="flex items-center justify-between rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <div className="font-semibold text-white">Fires Extinguished</div>
                    <div className="text-sm text-gray-400">Crises averted.</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#4CAF50]">{stats.fires}</div>
              </div>

              {/* Best Run */}
              <div className="flex items-center justify-between rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <div className="font-semibold text-white">Best Docket Run</div>
                    <div className="text-sm text-gray-400">Peak shift performance.</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#4CAF50]">{stats.bestRun}</div>
              </div>
            </div>

            {/* Confetti Preview */}
            {showConfettiPreview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-[#4CAF50]/30 bg-[#4CAF50]/10 p-4 text-center"
              >
                <p className="text-sm text-[#4CAF50]">
                  🎉 You've reached milestone achievements! Keep it up!
                </p>
              </motion.div>
            )}

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={onClose}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
