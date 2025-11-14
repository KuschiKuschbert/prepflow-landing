'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface SessionTimeoutWarningProps {
  isVisible: boolean;
  remainingMs: number | null;
  onStayActive: () => void;
}

/**
 * Session Timeout Warning Modal
 *
 * Displays a warning when user is about to be logged out due to inactivity.
 * Shows countdown timer and "Stay Active" button.
 */
export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  isVisible,
  remainingMs,
  onStayActive,
}) => {
  const formatTime = (ms: number | null): string => {
    if (ms === null) return '0:00';
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onStayActive}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-6"
          >
            <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-2xl">
              {/* Header */}
              <div className="mb-4 text-center">
                <div className="mb-2 text-fluid-4xl">⏰</div>
                <h2 className="mb-2 text-fluid-2xl font-bold text-white">Session Timeout Warning</h2>
                <p className="text-gray-400">
                  You&apos;ve been inactive for a while. You&apos;ll be logged out soon for
                  security.
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6 flex items-center justify-center">
                <div className="rounded-xl border border-[#D925C7]/50 bg-[#D925C7]/10 px-8 py-4">
                  <div className="text-center">
                    <div className="mb-1 text-fluid-xs text-gray-400">Time remaining</div>
                    <div className="text-fluid-4xl font-bold text-[#D925C7]">
                      {formatTime(remainingMs)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={onStayActive}
                  className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-[#29E7CD]/20 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
                >
                  Stay Active
                </button>
                <p className="text-center text-fluid-xs text-gray-500">
                  Click the button or interact with the page to continue your session
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
