/**
 * Catch the Docket - Loading Game
 *
 * Interactive mini-game that appears during loading states.
 * Users catch flying dockets to pass the time.
 */

'use client';

import WebAppBackground from '@/components/Arcade/WebAppBackground';
import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { useCatchTheDocket } from './useCatchTheDocket';

interface CatchTheDocketProps {
  isLoading: boolean;
  onLoadComplete?: () => void;
}

const CatchTheDocket: React.FC<CatchTheDocketProps> = ({ isLoading, onLoadComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { dockets, caught, playTime, alertShown, gameFinished, spawnDocket, handleDocketClick } =
    useCatchTheDocket({ isLoading, containerRef });

  useEffect(() => {
    if (gameFinished && onLoadComplete) {
      const timeoutId = setTimeout(() => onLoadComplete(), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [gameFinished, onLoadComplete]);

  if (!isLoading && !gameFinished) {
    return null;
  }

  return (
    <>
      <WebAppBackground
        compact={
          typeof window !== 'undefined' &&
          (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)
        }
      />
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex min-h-screen flex-col items-center justify-center p-6 text-[var(--foreground)]"
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
            className="text-fluid-sm pointer-events-none absolute top-6 right-6 z-50 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-3 py-1 text-[var(--foreground)] backdrop-blur-sm"
            title="Dockets caught"
          >
            🧾 {caught}
          </motion.div>
        )}

        {/* Dockets */}
        {dockets.map(docket => (
          <motion.div
            key={docket.id}
            className="text-fluid-4xl desktop:text-fluid-4xl absolute cursor-pointer transition-transform hover:scale-125"
            style={{
              left: `${docket.x}px`,
              top: `${docket.y}px`,
              transform: `translate(-50%, -50%) rotate(${docket.rotation}deg)`,
            }}
            onPointerDown={() => handleDocketClick(docket.id)}
            onClick={() => handleDocketClick(docket.id)}
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
