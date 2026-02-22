'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface GameOverScreenProps {
  playTime: number;
  fastestTime: number | null;
  alertShown: boolean;
  reducedMotion: boolean;
  handleReturnToDashboard: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  playTime,
  fastestTime,
  alertShown,
  reducedMotion,
  handleReturnToDashboard,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-fluid-4xl desktop:text-fluid-4xl mb-4 font-extrabold text-[var(--primary)]"
      >
        Fire out! Back to service ✅
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-fluid-lg mb-8 text-[var(--foreground-subtle)]"
      >
        You extinguished the fire in {playTime} seconds!
        {fastestTime !== null && playTime === fastestTime && (
          <span className="mt-2 block text-[var(--primary)]">🏆 New record!</span>
        )}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={reducedMotion ? {} : { scale: 1.05 }}
        whileTap={reducedMotion ? {} : { scale: 0.95 }}
        onClick={handleReturnToDashboard}
        className="text-fluid-lg desktop:px-8 desktop:py-4 desktop:text-fluid-xl desktop:hover:shadow-xl touch-manipulation rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3.5 font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none active:scale-95"
      >
        Return to Dashboard
      </motion.button>

      {alertShown && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-fluid-sm mt-6 text-[var(--foreground-subtle)]"
        >
          Took your time, but you got there! 👨‍🍳
        </motion.p>
      )}
    </motion.div>
  );
};
