'use client';

/**
 * Kitchen's on Fire - Humorous Error Screen Mini-Game
 *
 * A light-hearted interactive component that appears whenever an error occurs.
 * Users click to extinguish flames while a timer tracks playtime. After 45 seconds,
 * an alert reminds users to get back to work.
 */

import WebAppBackground from '@/components/Arcade/WebAppBackground';
import { logger } from '@/lib/logger';
import { AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ActiveGameScreen } from './ActiveGameScreen';
import { GameOverScreen } from './GameOverScreen';
import { useKitchenFireGame } from './useKitchenFireGame';

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
              <ActiveGameScreen
                flames={flames}
                playTime={playTime}
                alertShown={alertShown}
                fastestTime={fastestTime}
                reducedMotion={reducedMotion}
                handleSprayWater={handleSprayWater}
                handleReturnToDashboard={handleReturnToDashboard}
              />
            ) : (
              <GameOverScreen
                playTime={playTime}
                fastestTime={fastestTime}
                alertShown={alertShown}
                reducedMotion={reducedMotion}
                handleReturnToDashboard={handleReturnToDashboard}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
};

export default KitchenOnFire;
