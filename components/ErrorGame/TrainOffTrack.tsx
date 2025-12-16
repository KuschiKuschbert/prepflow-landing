'use client';

/**
 * Train Off Track - Humorous Error Screen with Light Game Mechanics
 *
 * A light-hearted interactive component that appears whenever an error occurs.
 * Users click a few times to fix the track while a train animates across the screen.
 * Simple, non-distracting game mechanics - no timer pressure.
 */

import { ArcadeMuteButton } from '@/components/Arcade/ArcadeMuteButton';
import WebAppBackground from '@/components/Arcade/WebAppBackground';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useTrainOffTrackGame } from './useTrainOffTrackGame';

const TrainOffTrack: React.FC = () => {
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
      return false;
    }
  };
  const { fixesNeeded, fixed, reducedMotion, handleFixTrack } = useTrainOffTrackGame();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFixTrack();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleFixTrack]);

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
      <ArcadeMuteButton />
      <main className="fixed inset-0 flex min-h-screen items-center justify-center p-6 text-[var(--foreground)]">
        <div className="flex max-w-2xl flex-col items-center text-center">
          <AnimatePresence mode="wait">
            {!fixed ? (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-fluid-4xl desktop:text-fluid-4xl mb-4 font-extrabold"
                >
                  Sorry we&apos;re off track
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-fluid-base desktop:text-fluid-lg mb-8 text-[var(--foreground)]/60"
                >
                  i like trains
                </motion.p>

                {/* Animated train running across screen */}
                <motion.div
                  className="relative mb-8 flex min-h-[180px] w-full items-center justify-center overflow-hidden desktop:min-h-[200px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="absolute"
                    animate={
                      reducedMotion
                        ? { x: 0 }
                        : {
                            x: ['-150px', 'calc(100vw + 150px)'],
                          }
                    }
                    transition={
                      reducedMotion
                        ? {}
                        : {
                            duration: 10,
                            repeat: Infinity,
                            ease: 'linear',
                          }
                    }
                  >
                    <span className="text-6xl desktop:text-8xl">🚂</span>
                  </motion.div>
                </motion.div>

                {/* Fix Track Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    onClick={handleFixTrack}
                    whileHover={reducedMotion ? {} : { scale: 1.05 }}
                    whileTap={reducedMotion ? {} : { scale: 0.95, x: [0, -5, 5, -5, 0] }}
                    className="text-fluid-lg desktop:px-8 desktop:py-4 desktop:text-fluid-xl desktop:hover:shadow-xl touch-manipulation rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3.5 font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none active:scale-95"
                    aria-label={`Fix track. ${fixesNeeded} fixes remaining.`}
                  >
                    🔧 Fix Track
                  </motion.button>
                </motion.div>
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
                  Train back on track! ✅
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-fluid-lg mb-8 text-[var(--foreground)]/60"
                >
                  All aboard!
                </motion.p>

                {/* Train still animating in background */}
                <motion.div
                  className="relative mb-8 flex min-h-[180px] w-full items-center justify-center overflow-hidden desktop:min-h-[200px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="absolute"
                    animate={
                      reducedMotion
                        ? { x: 0 }
                        : {
                            x: ['-150px', 'calc(100vw + 150px)'],
                          }
                    }
                    transition={
                      reducedMotion
                        ? {}
                        : {
                            duration: 10,
                            repeat: Infinity,
                            ease: 'linear',
                          }
                    }
                  >
                    <span className="text-6xl desktop:text-8xl">🚂</span>
                  </motion.div>
                </motion.div>

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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

export default TrainOffTrack;
