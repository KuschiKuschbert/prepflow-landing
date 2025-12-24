'use client';

/**
 * Kitchen's on Fire - Humorous Error Screen Mini-Game
 *
 * A light-hearted interactive component that appears whenever an error occurs.
 * Users click to extinguish flames while a timer tracks playtime. After 45 seconds,
 * an alert reminds users to get back to work.
 */

import WebAppBackground from '@/components/Arcade/WebAppBackground';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useKitchenFireGame } from './useKitchenFireGame';
import { logger } from '@/lib/logger';

const KitchenOnFire: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isArcadeErrorsDisabled = () => {
    if (typeof window === 'undefined') return false;
    try {
      // Check explicit flag first
      if (localStorage.getItem('PF_DISABLE_ARCADE_ERRORS') === '1') return true;
      // Mobile/touch devices are now enabled by default
      // Users can still disable via PF_DISABLE_ARCADE_ERRORS if needed
      return false;
    } catch (_) {
      logger.error('[KitchenOnFire.tsx] Error in catch block:', {
        error: _ instanceof Error ? _.message : String(_),
        stack: _ instanceof Error ? _.stack : undefined,
      });

      return false;
    }
  };
  const {
    flames,
    extinguished,
    playTime,
    alertShown,
    fastestTime,
    reducedMotion,
    handleSprayWater,
  } = useKitchenFireGame();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSprayWater();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleSprayWater]);

  // Handle return to dashboard
  const handleReturnToDashboard = () => {
    router.push('/webapp');
  };

  // Suppress error game on auth-related routes (Auth0/NextAuth/login flows) or when globally disabled
  if (
    isArcadeErrorsDisabled() ||
    (pathname &&
      (pathname.startsWith('/api/auth') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/auth')))
  ) {
    return null;
  }

  return (
    <>
      <WebAppBackground />
      {/* Score/Timer UI removed per request */}
      <main className="fixed inset-0 flex min-h-screen items-center justify-center p-6 text-[var(--foreground)]">
        <div className="flex max-w-2xl flex-col items-center text-center">
          <AnimatePresence mode="wait">
            {!extinguished ? (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-fluid-4xl desktop:text-fluid-4xl mb-4 font-extrabold"
                >
                  Uh oh! The kitchen&apos;s on fire 🔥
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-fluid-base desktop:text-fluid-lg mb-8 text-[var(--foreground)]/60"
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
                      🔥
                    </motion.span>
                  ))}
                </motion.div>

                {/* Flames remaining counter removed per request */}

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
                    className="text-fluid-lg desktop:px-8 desktop:py-4 desktop:text-fluid-xl desktop:hover:shadow-xl touch-manipulation rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3.5 font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none active:scale-95"
                    aria-label={`Spray water to extinguish flames. ${flames} flames remaining.`}
                  >
                    🧯 Spray Water
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
                        Hey Chef… back to the real fire 🔪🔥
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
                  className="text-fluid-sm mt-6 text-[var(--foreground)]/40"
                >
                  Time: {playTime}s{fastestTime !== null && ` | Best: ${fastestTime}s`}
                </motion.p>
              </>
            ) : (
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
                  className="text-fluid-lg mb-8 text-[var(--foreground)]/60"
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
                    className="text-fluid-sm mt-6 text-[var(--foreground)]/40"
                  >
                    Took your time, but you got there! 👨‍🍳
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

export default KitchenOnFire;
