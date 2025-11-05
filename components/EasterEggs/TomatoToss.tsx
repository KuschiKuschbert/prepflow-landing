'use client';

/**
 * Tomato Toss - Humorous Easter-Egg Mini-Game
 *
 * A light-hearted interactive component that appears when users click the logo 9 times.
 * Users can throw tomatoes at a wall for stress relief. Sound effects are generated using
 * Web Audio API for a fully self-contained experience.
 */

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTomatoTossGame } from './useTomatoTossGame';
import { Confetti } from './Confetti';
import WebAppBackground from '@/components/Arcade/WebAppBackground';
import { GameScoreboard } from '@/components/Arcade/GameScoreboard';
import { ArcadeMuteButton } from '@/components/Arcade/ArcadeMuteButton';
import { getArcadeStats } from '@/lib/arcadeStats';

interface TomatoTossProps {
  onClose: () => void;
}

const TomatoToss: React.FC<TomatoTossProps> = ({ onClose }) => {
  const {
    throws,
    splatters,
    tomatoes,
    playTime,
    alertShown,
    reducedMotion,
    handleThrow,
    gameFinished,
  } = useTomatoTossGame();

  const wallRef = useRef<HTMLDivElement>(null);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const confettiShownRef = React.useRef(false);
  const [globalStats, setGlobalStats] = React.useState(() => getArcadeStats());

  // Update global stats when they change
  useEffect(() => {
    const handleStatsUpdate = () => {
      setGlobalStats(getArcadeStats());
    };

    window.addEventListener('arcade:statsUpdated', handleStatsUpdate);
    return () => window.removeEventListener('arcade:statsUpdated', handleStatsUpdate);
  }, []);

  // Auto-close after 20 seconds
  useEffect(() => {
    if (gameFinished) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Give 2 seconds to see the finish message
      return () => clearTimeout(timer);
    }
  }, [gameFinished, onClose]);

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Show confetti exactly at 21 throws (only once)
  useEffect(() => {
    if (throws === 21 && !confettiShownRef.current) {
      setShowConfetti(true);
      confettiShownRef.current = true;
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [throws]);

  // Handle click/tap on wall
  const handleWallClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (wallRef.current) {
      const rect = wallRef.current.getBoundingClientRect();
      handleThrow(e.clientX, e.clientY, rect);
    }
  };

  // Handle touch events for mobile
  const handleWallTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent scrolling while playing
    if (wallRef.current && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      const rect = wallRef.current.getBoundingClientRect();
      handleThrow(touch.clientX, touch.clientY, rect);
    }
  };

  // Calculate tomato position during animation
  const getTomatoPosition = (tomato: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    progress: number;
  }) => {
    const x = tomato.startX + (tomato.endX - tomato.startX) * tomato.progress;
    // Arc trajectory: higher at midpoint
    const arcHeight = 100;
    const midpoint = 0.5;
    const arcProgress =
      tomato.progress < midpoint
        ? tomato.progress / midpoint
        : (1 - tomato.progress) / (1 - midpoint);
    const y =
      tomato.startY +
      (tomato.endY - tomato.startY) * tomato.progress -
      Math.sin(arcProgress * Math.PI) * arcHeight;
    return { x, y };
  };

  return (
    <>
      <WebAppBackground />
      {showConfetti && <Confetti />}
      <ArcadeMuteButton className="top-16" />
      <GameScoreboard
        sessionScore={throws}
        globalScore={globalStats.tomatoes}
        time={playTime}
        tipText="Aim fast — the wall won't wait!"
        icon="🍅"
      />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex min-h-screen flex-col items-center justify-center p-6 text-white"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">🍅 Tomato Toss!</h1>
            <p className="text-lg text-gray-300">Let it all out, Chef — aim for the wall.</p>
          </motion.div>

          {/* Wall Area */}
          <motion.div
            ref={wallRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleWallClick}
            onTouchEnd={handleWallTouch}
            className="relative h-[400px] w-full max-w-4xl cursor-crosshair rounded-2xl border-4 border-[#2a2a2a] bg-gradient-to-b from-gray-200 to-gray-300 shadow-2xl md:h-[500px]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                #ddd 0px,
                #ddd 40px,
                #ccc 40px,
                #ccc 41px
              ),
              repeating-linear-gradient(
                90deg,
                #ddd 0px,
                #ddd 40px,
                #ccc 40px,
                #ccc 41px
              )`,
            }}
          >
            {/* Splatters */}
            {splatters.map(splatter => (
              <motion.div
                key={splatter.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: splatter.opacity, scale: splatter.scale }}
                transition={{ duration: 0.2 }}
                className="absolute"
                style={{
                  left: `${splatter.x}px`,
                  top: `${splatter.y}px`,
                  transform: `translate(-50%, -50%) rotate(${splatter.rotation}deg)`,
                }}
              >
                <div
                  className="text-6xl"
                  style={{
                    filter: 'blur(2px)',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  🍅
                </div>
              </motion.div>
            ))}

            {/* Flying Tomatoes */}
            {tomatoes.map(tomato => {
              const pos = getTomatoPosition(tomato);
              return (
                <motion.div
                  key={tomato.id}
                  className="absolute text-4xl"
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          rotate: [0, 180, 360],
                        }
                  }
                  transition={{
                    rotate: {
                      duration: 0.4,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                  }}
                >
                  🍅
                </motion.div>
              );
            })}

            {/* Instructions Overlay */}
            {throws === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <p className="rounded-xl bg-[#2a2a2a]/80 px-6 py-3 text-lg font-semibold text-white backdrop-blur-sm">
                  Click or tap anywhere to throw!
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Game Finished Message */}
          {gameFinished && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="rounded-xl border border-[#29E7CD] bg-[#29E7CD]/10 px-6 py-4">
                <p className="text-lg font-semibold text-[#29E7CD]">
                  Time's up! You threw {throws} tomatoes! 🍅
                </p>
              </div>
            </motion.div>
          )}

          {/* Alert Message */}
          {alertShown && !gameFinished && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="rounded-xl border border-[#D925C7] bg-[#D925C7]/10 px-6 py-4">
                <p className="text-lg font-semibold text-[#D925C7]">Chef! Get back to work! 🔪</p>
              </div>
            </motion.div>
          )}

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={reducedMotion ? {} : { scale: 1.05 }}
            whileTap={reducedMotion ? {} : { scale: 0.95 }}
            onClick={onClose}
            className="mt-6 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/40 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#2a2a2a]/60 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
          >
            Back to PrepFlow 🧽
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default TomatoToss;
