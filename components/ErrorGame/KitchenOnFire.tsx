'use client';

/**
 * Kitchen's on Fire - Humorous Error Screen Mini-Game
 *
 * A light-hearted interactive component that appears whenever an error occurs.
 * Users click to extinguish flames while a timer tracks playtime. After 45 seconds,
 * an alert reminds users to get back to work. Sound effects are generated using
 * Web Audio API for a fully self-contained experience.
 */

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useKitchenFireGame } from './useKitchenFireGame';
import WebAppBackground from '@/components/Arcade/WebAppBackground';
import { ArcadeMuteButton } from '@/components/Arcade/ArcadeMuteButton';
import { throwConfetti } from '@/hooks/useConfetti';

const KitchenOnFire: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isArcadeErrorsDisabled = () => {
    if (typeof window === 'undefined') return false;
    try {
      // Check explicit flag first
      if (localStorage.getItem('PF_DISABLE_ARCADE_ERRORS') === '1') return true;
      // Auto-disable on mobile/touch devices
      if (typeof navigator !== 'undefined') {
        const hasTouch = navigator.maxTouchPoints > 0 || (window as any).ontouchstart !== undefined;
        const forceEnable = localStorage.getItem('PF_ENABLE_ARCADE_MOBILE') === '1';
        if (hasTouch && !forceEnable) return true;
      }
      return false;
    } catch (_) {
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
      <ArcadeMuteButton />
      {/* Score/Timer UI removed per request */}
      <main className="fixed inset-0 flex min-h-screen items-center justify-center p-6 text-white">
        <div className="flex max-w-2xl flex-col items-center text-center">
          <AnimatePresence mode="wait">
            {!extinguished ? (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 text-4xl font-extrabold md:text-5xl"
                >
                  Uh oh! The kitchen's on fire 🔥
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 text-lg text-gray-300"
                >
                  Click to extinguish before service resumes.
                </motion.p>

                {/* Animated flames */}
                <motion.div
                  className="mb-8 flex min-h-[180px] flex-wrap justify-center gap-4 text-6xl md:min-h-[200px] md:text-7xl"
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
                    className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 text-xl font-semibold text-black shadow-lg transition-all duration-200 hover:shadow-xl focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
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
                    <div className="rounded-xl border border-[#D925C7] bg-[#D925C7]/10 px-6 py-4">
                      <p className="text-lg font-semibold text-[#D925C7]">
                        Hey Chef… back to the real fire 🔪🔥
                      </p>
                    </div>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={reducedMotion ? {} : { scale: 1.05 }}
                      whileTap={reducedMotion ? {} : { scale: 0.95 }}
                      onClick={handleReturnToDashboard}
                      className="rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#2a2a2a]/60 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
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
                  className="mt-6 text-sm text-gray-500"
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
                  className="mb-4 text-4xl font-extrabold text-[#29E7CD] md:text-5xl"
                >
                  Fire out! Back to service ✅
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 text-lg text-gray-300"
                >
                  You extinguished the fire in {playTime} seconds!
                  {fastestTime !== null && playTime === fastestTime && (
                    <span className="mt-2 block text-[#29E7CD]">🏆 New record!</span>
                  )}
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={reducedMotion ? {} : { scale: 1.05 }}
                  whileTap={reducedMotion ? {} : { scale: 0.95 }}
                  onClick={handleReturnToDashboard}
                  className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 text-xl font-semibold text-black shadow-lg transition-all duration-200 hover:shadow-xl focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
                >
                  Return to Dashboard
                </motion.button>

                {alertShown && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-sm text-gray-500"
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
