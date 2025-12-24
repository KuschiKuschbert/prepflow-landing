/**
 * Unified Game Scoreboard Component
 *
 * Consistent scoreboard styling across all arcade games.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface GameScoreboardProps {
  sessionScore: number;
  globalScore?: number;
  time?: number;
  tipText?: string;
  icon?: string;
  variant?: 'default' | 'flames';
  flamesRemaining?: number;
}

export const GameScoreboard: React.FC<GameScoreboardProps> = ({
  sessionScore,
  globalScore,
  time,
  tipText,
  icon = '🎯',
  variant = 'default',
  flamesRemaining,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="desktop:top-4 desktop:right-20 desktop:left-auto desktop:max-w-none desktop:p-4 fixed top-20 right-4 left-4 z-50 max-w-[200px] rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-xl backdrop-blur-md"
    >
      <div className="text-fluid-xs desktop:text-fluid-sm flex flex-col gap-2">
        {/* Session Score */}
        <div className="desktop:gap-2 flex items-center gap-1.5">
          <span className="text-fluid-lg desktop:text-fluid-xl">{icon}</span>
          <div className="flex flex-col">
            <span className="desktop:text-fluid-xs text-[10px] text-[var(--foreground-muted)]">
              Session
            </span>
            <span className="text-fluid-base desktop:text-fluid-lg font-semibold text-[var(--primary)]">
              {sessionScore}
            </span>
          </div>
        </div>

        {/* Global Score */}
        {globalScore !== undefined && (
          <div className="desktop:gap-2 desktop:pt-2 flex items-center gap-1.5 border-t border-[var(--border)] pt-1.5">
            <span className="desktop:text-fluid-xs text-[10px] text-[var(--foreground-muted)]">
              Total:
            </span>
            <span className="text-fluid-xs desktop:text-fluid-sm font-semibold text-[var(--foreground)]">
              {globalScore}
            </span>
          </div>
        )}

        {/* Flames Remaining (variant) */}
        {variant === 'flames' && flamesRemaining !== undefined && (
          <div className="desktop:gap-2 desktop:pt-2 flex items-center gap-1.5 border-t border-[var(--border)] pt-1.5">
            <span className="desktop:text-fluid-xs text-[10px] text-[var(--foreground-muted)]">
              Flames:
            </span>
            <span className="text-fluid-xs desktop:text-fluid-sm font-semibold text-[#E74C3C]">
              {flamesRemaining}
            </span>
          </div>
        )}

        {/* Time */}
        {time !== undefined && (
          <div className="desktop:gap-2 desktop:pt-2 flex items-center gap-1.5 border-t border-[var(--border)] pt-1.5">
            <span className="desktop:text-fluid-xs text-[10px] text-[var(--foreground-muted)]">
              Time:
            </span>
            <span className="text-fluid-xs desktop:text-fluid-sm font-semibold text-[var(--accent)]">
              {time}s
            </span>
          </div>
        )}

        {/* Tip Text */}
        {tipText && (
          <div className="desktop:mt-2 desktop:pt-2 mt-1.5 border-t border-[var(--border)] pt-1.5">
            <p className="desktop:text-fluid-xs text-[10px] text-[var(--foreground-subtle)] italic">
              {tipText}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
