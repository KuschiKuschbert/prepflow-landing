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
      className="fixed top-4 right-20 z-50 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/95 p-4 shadow-xl backdrop-blur-md"
    >
      <div className="flex flex-col gap-2 text-sm">
        {/* Session Score */}
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Session</span>
            <span className="text-lg font-semibold text-[#29E7CD]">{sessionScore}</span>
          </div>
        </div>

        {/* Global Score */}
        {globalScore !== undefined && (
          <div className="flex items-center gap-2 border-t border-[#2a2a2a] pt-2">
            <span className="text-xs text-gray-400">Total:</span>
            <span className="font-semibold text-white">{globalScore}</span>
          </div>
        )}

        {/* Flames Remaining (variant) */}
        {variant === 'flames' && flamesRemaining !== undefined && (
          <div className="flex items-center gap-2 border-t border-[#2a2a2a] pt-2">
            <span className="text-xs text-gray-400">Flames:</span>
            <span className="font-semibold text-[#E74C3C]">{flamesRemaining}</span>
          </div>
        )}

        {/* Time */}
        {time !== undefined && (
          <div className="flex items-center gap-2 border-t border-[#2a2a2a] pt-2">
            <span className="text-xs text-gray-400">Time:</span>
            <span className="font-semibold text-[#D925C7]">{time}s</span>
          </div>
        )}

        {/* Tip Text */}
        {tipText && (
          <div className="mt-2 border-t border-[#2a2a2a] pt-2">
            <p className="text-xs text-gray-500 italic">{tipText}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
