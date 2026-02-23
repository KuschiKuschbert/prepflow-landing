'use client';

import { Icon } from '@/components/ui/Icon';
import { motion } from 'framer-motion';
import { Flame, SprayCan } from 'lucide-react';
import React from 'react';

interface ActiveGameScreenProps {
  flames: number;
  playTime: number;
  alertShown: boolean;
  fastestTime: number | null;
  reducedMotion: boolean;
  handleSprayWater: () => void;
  handleReturnToDashboard: () => void;
}

export const ActiveGameScreen: React.FC<ActiveGameScreenProps> = ({
  flames,
  playTime,
  alertShown,
  fastestTime,
  reducedMotion,
  handleSprayWater,
  handleReturnToDashboard,
}) => {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-fluid-4xl desktop:text-fluid-4xl mb-4 font-extrabold"
      >
        <span className="flex items-center gap-2">
          Uh oh! The kitchen&apos;s on fire
          <Icon icon={Flame} size="lg" className="text-[var(--tertiary)]" aria-hidden={true} />
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-fluid-base desktop:text-fluid-lg mb-8 text-[var(--foreground-subtle)]"
      >
        <span className="desktop:inline hidden">Click</span>
        <span className="desktop:hidden">Tap</span> to extinguish before service resumes.
      </motion.p>

      {/* Animated flames */}
      <motion.div
        className="text-fluid-4xl desktop:min-h-[200px] desktop:text-fluid-4xl mb-8 flex min-h-[180px] flex-wrap justify-center gap-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {Array.from({ length: flames }).map((_, index) => (
          <motion.span
            key={index}
            animate={
              reducedMotion
                ? { opacity: 1 }
                : {
                    rotate: [0, 3, -3, 0],
                    scale: [1, 1.1, 1],
                  }
            }
            transition={
              reducedMotion
                ? {}
                : {
                    duration: 0.5,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: 'easeInOut',
                  }
            }
          >
            <Icon icon={Flame} size="lg" className="text-[var(--tertiary)]" aria-hidden={true} />
          </motion.span>
        ))}
      </motion.div>

      {/* Spray Water Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={handleSprayWater}
          whileHover={reducedMotion ? {} : { scale: 1.05 }}
          whileTap={reducedMotion ? {} : { scale: 0.95, x: [0, -5, 5, -5, 0] }}
          aria-label={`Spray water to extinguish flames. ${flames} flames remaining.`}
          className="text-fluid-lg desktop:px-8 desktop:py-4 desktop:text-fluid-xl desktop:hover:shadow-xl flex touch-manipulation items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3.5 font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none active:scale-95"
        >
          <Icon icon={SprayCan} size="md" aria-hidden={true} />
          Spray Water
        </motion.button>
      </motion.div>

      {/* Alert message after 45 seconds */}
      {alertShown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-4"
        >
          <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 px-6 py-4">
            <p className="text-fluid-lg font-semibold text-[var(--accent)]">
              Hey Chef… back to the real fire
              <Icon icon={Flame} size="sm" className="ml-1 inline" aria-hidden={true} />
            </p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={reducedMotion ? {} : { scale: 1.05 }}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
            onClick={handleReturnToDashboard}
            className="text-fluid-base desktop:px-6 desktop:py-3 desktop:text-fluid-lg desktop:hover:bg-[var(--muted)]/60 touch-manipulation rounded-2xl border border-[var(--border)] bg-[var(--muted)]/40 px-5 py-2.5 font-semibold text-[var(--foreground)] transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none active:scale-95"
          >
            Return to Dashboard
          </motion.button>
        </motion.div>
      )}

      {/* Playtime indicator */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-fluid-sm mt-6 text-[var(--foreground-subtle)]"
      >
        Time: {playTime}s{fastestTime !== null && ` | Best: ${fastestTime}s`}
      </motion.p>
    </>
  );
};
