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
      className="fixed top-20 right-4 left-4 z-50 max-w-[200px] rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/95 p-3 shadow-xl backdrop-blur-md desktop:top-4 desktop:right-20 desktop:left-auto desktop:max-w-none desktop:p-4"
    >
      <div className="flex flex-col gap-2 text-fluid-xs desktop:text-fluid-sm">
        {/* Session Score */}
        <div className="flex items-center gap-1.5 desktop:gap-2">
          <span className="text-fluid-lg desktop:text-fluid-xl">{icon}</span>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 desktop:text-fluid-xs">Session</span>
            <span className="text-fluid-base font-semibold text-[#29E7CD] desktop:text-fluid-lg">
              {sessionScore}
            </span>
          </div>
        </div>

        {/* Global Score */}
        {globalScore !== undefined && (
          <div className="flex items-center gap-1.5 border-t border-[#2a2a2a] pt-1.5 desktop:gap-2 desktop:pt-2">
            <span className="text-[10px] text-gray-400 desktop:text-fluid-xs">Total:</span>
            <span className="text-fluid-xs font-semibold text-white desktop:text-fluid-sm">{globalScore}</span>
          </div>
        )}

        {/* Flames Remaining (variant) */}
        {variant === 'flames' && flamesRemaining !== undefined && (
          <div className="flex items-center gap-1.5 border-t border-[#2a2a2a] pt-1.5 desktop:gap-2 desktop:pt-2">
            <span className="text-[10px] text-gray-400 desktop:text-fluid-xs">Flames:</span>
            <span className="text-fluid-xs font-semibold text-[#E74C3C] desktop:text-fluid-sm">
              {flamesRemaining}
            </span>
          </div>
        )}

        {/* Time */}
        {time !== undefined && (
          <div className="flex items-center gap-1.5 border-t border-[#2a2a2a] pt-1.5 desktop:gap-2 desktop:pt-2">
            <span className="text-[10px] text-gray-400 desktop:text-fluid-xs">Time:</span>
            <span className="text-fluid-xs font-semibold text-[#D925C7] desktop:text-fluid-sm">{time}s</span>
          </div>
        )}

        {/* Tip Text */}
        {tipText && (
          <div className="mt-1.5 border-t border-[#2a2a2a] pt-1.5 desktop:mt-2 desktop:pt-2">
            <p className="text-[10px] text-gray-500 italic desktop:text-fluid-xs">{tipText}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
