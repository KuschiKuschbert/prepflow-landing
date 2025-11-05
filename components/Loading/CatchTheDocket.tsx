/**
 * Catch the Docket - Loading Game
 *
 * Interactive mini-game that appears during loading states.
 * Users catch flying dockets to pass the time.
 */

'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import WebAppBackground from '@/components/Arcade/WebAppBackground';
import { GameScoreboard } from '@/components/Arcade/GameScoreboard';
import { ArcadeMuteButton } from '@/components/Arcade/ArcadeMuteButton';
import { useCatchTheDocket } from './useCatchTheDocket';

interface CatchTheDocketProps {
  isLoading: boolean;
  onLoadComplete?: () => void;
}

const CatchTheDocket: React.FC<CatchTheDocketProps> = ({ isLoading, onLoadComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    dockets,
    caught,
    playTime,
    alertShown,
    gameFinished,
    globalStats,
    spawnDocket,
    handleDocketClick,
  } = useCatchTheDocket({ isLoading, containerRef });

  useEffect(() => {
    if (gameFinished && onLoadComplete) {
      setTimeout(() => onLoadComplete(), 1000);
    }
  }, [gameFinished, onLoadComplete]);

  if (!isLoading && !gameFinished) {
    return null;
  }

  return (
    <>
      <WebAppBackground />
      <ArcadeMuteButton />
      <GameScoreboard
        sessionScore={caught}
        globalScore={globalStats.dockets}
        time={playTime}
        tipText="Click the dockets to catch them!"
        icon="🧾"
      />
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex min-h-screen flex-col items-center justify-center p-6 text-white"
        onClick={e => {
          // Click anywhere to spawn docket (for testing)
          if (e.target === containerRef.current) {
            spawnDocket();
          }
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">🧾 Catch the Docket!</h1>
          <p className="text-lg text-gray-300">
            {isLoading ? 'Loading... Catch dockets while you wait!' : `Caught ${caught} dockets!`}
          </p>
        </motion.div>

        {/* Dockets */}
        {dockets.map(docket => (
          <motion.div
            key={docket.id}
            className="absolute cursor-pointer text-4xl transition-transform hover:scale-125"
            style={{
              left: `${docket.x}px`,
              top: `${docket.y}px`,
              transform: `translate(-50%, -50%) rotate(${docket.rotation}deg)`,
            }}
            onClick={() => handleDocketClick(docket.id)}
            animate={
              gameFinished
                ? {}
                : {
                    rotate: docket.rotation + 360,
                  }
            }
            transition={{
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          >
            🧾
          </motion.div>
        ))}

        {/* Alert Message */}
        {alertShown && isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="rounded-xl border border-[#D925C7] bg-[#D925C7]/10 px-6 py-4">
              <p className="text-lg font-semibold text-[#D925C7]">
                Still loading? Hang tight, Chef! 🔪
              </p>
            </div>
          </motion.div>
        )}

        {/* Completion Message */}
        {gameFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 space-y-4"
          >
            <div className="rounded-xl border border-[#29E7CD] bg-[#29E7CD]/10 px-6 py-4">
              <p className="text-lg font-semibold text-[#29E7CD]">
                Great catch! You caught {caught} docket{caught !== 1 ? 's' : ''}! 🎉
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default CatchTheDocket;
