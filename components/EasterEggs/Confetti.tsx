'use client';

/**
 * Confetti component for Tomato Toss achievement (>20 throws)
 * Lightweight particle system using Framer Motion
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiParticle {
  id: string;
  x: number;
  y: number;
  color: string;
}

const COLORS = ['#29E7CD', '#D925C7', '#3B82F6', '#FFD700', '#FF6B6B', '#4ECDC4'];

export function Confetti() {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [screenHeight, setScreenHeight] = useState(1000);

  useEffect(() => {
    // Get screen height for animation
    if (typeof window !== 'undefined') {
      setScreenHeight(window.innerHeight);
    }

    // Create 30 confetti particles
    const newParticles: ConfettiParticle[] = Array.from({ length: 30 }, (_, i) => ({
      id: `particle-${i}`,
      x: Math.random() * 100,
      y: -10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    setParticles(newParticles);

    // Hide after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute h-3 w-3 rounded-sm"
            style={{
              backgroundColor: particle.color,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{
              y: 0,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: screenHeight + 100,
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              opacity: [1, 1, 0],
              x: (Math.random() - 0.5) * 200,
            }}
            transition={{
              duration: 2 + Math.random(),
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
