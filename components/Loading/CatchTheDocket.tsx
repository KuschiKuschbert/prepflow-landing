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
        {/* Minimal counter (appears only after first tap) */}
        {caught > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute top-6 right-6 z-50 rounded-full border border-[#2a2a2a] bg-[#1f1f1f]/70 px-3 py-1 text-sm text-white backdrop-blur-sm"
            title="Dockets caught"
          >
            🧾 {caught}
          </motion.div>
        )}

        {/* Dockets */}
        {dockets.map(docket => (
          <motion.div
            key={docket.id}
            className="absolute cursor-pointer text-4xl transition-transform hover:scale-125 md:text-6xl"
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

        {/* No instructional or completion messaging */}
      </motion.div>
    </>
  );
};

export default CatchTheDocket;
