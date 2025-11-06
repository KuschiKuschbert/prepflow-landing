'use client';

/**
 * Tomato Toss - Humorous Easter-Egg Mini-Game
 *
 * A light-hearted interactive component that appears when users click the logo 9 times.
 * Users can throw tomatoes at a wall for stress relief. Sound effects are generated using
 * Web Audio API for a fully self-contained experience.
 */

import { ArcadeMuteButton } from '@/components/Arcade/ArcadeMuteButton';
import WebAppBackground from '@/components/Arcade/WebAppBackground';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { Confetti } from './Confetti';
import { useTomatoTossGame } from './useTomatoTossGame';

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

  // Auto-close after 20 seconds (immediate)
  useEffect(() => {
    if (gameFinished) {
      onClose();
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
    // Straight, aggressive path (no arc)
    const x = tomato.startX + (tomato.endX - tomato.startX) * tomato.progress;
    const y = tomato.startY + (tomato.endY - tomato.startY) * tomato.progress;
    return { x, y };
  };

  return (
    <>
      <WebAppBackground />
      {/* Blurred dark overlay to separate game from background */}
      <div className="pointer-events-none fixed inset-0 z-30 bg-black/40 backdrop-blur-md" />
      {showConfetti && <Confetti />}
      <ArcadeMuteButton className="top-16" />
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
            className="relative h-[400px] w-full max-w-4xl cursor-crosshair rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/40 shadow-2xl backdrop-blur-sm md:h-[500px]"
          >
            {/* Splatters */}
            {splatters.map(splatter => (
              <motion.div
                key={splatter.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: splatter.opacity, scale: splatter.scale }}
                transition={{ duration: 0.15 }}
                className="absolute"
                style={{
                  left: `${splatter.x}px`,
                  top: `${splatter.y}px`,
                  transform: `translate(-50%, -50%) rotate(${splatter.rotation}deg)`,
                }}
              >
                {/* Sauce splash blob */}
                <div className="relative" style={{ width: 28, height: 28 }}>
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'radial-gradient(circle at 30% 30%, #ff6b6b, #e53935)',
                      boxShadow: '0 0 12px rgba(229,57,53,0.6)',
                      filter: 'blur(0.5px)',
                    }}
                  />
                  {/* small droplets */}
                  <div
                    className="absolute rounded-full"
                    style={{ width: 10, height: 10, left: -10, top: 4, background: '#e74c3c' }}
                  />
                  <div
                    className="absolute rounded-full"
                    style={{ width: 8, height: 8, right: -8, top: -2, background: '#ff5252' }}
                  />
                  <div
                    className="absolute rounded-full"
                    style={{ width: 6, height: 6, right: -6, bottom: -4, background: '#e53935' }}
                  />
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
