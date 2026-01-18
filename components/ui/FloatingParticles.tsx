'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  moveX?: number;
  moveY?: number;
}

interface FloatingParticlesProps {
  /**
   * Number of particles to render
   */
  count?: number;
  /**
   * Minimum particle size in pixels
   */
  minSize?: number;
  /**
   * Maximum particle size in pixels
   */
  maxSize?: number;
  /**
   * Colors to use for particles
   */
  colors?: string[];
  /**
   * Animation speed multiplier
   */
  speed?: number;
  /**
   * Additional className
   */
  className?: string;
}

const defaultColors = ['#29E7CD', '#D925C7', '#3B82F6'];

/**
 * FloatingParticles component creates animated floating particles in the background
 * Performance optimized with limited particle count
 */
export function FloatingParticles({
  count = 30,
  minSize = 2,
  maxSize = 6,
  colors = defaultColors,
  speed = 1,
  className = '',
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    if (!isMounted || reducedMotion) return;

    // Generate random particles with better initial positioning
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      const initialX = Math.random() * 100;
      const initialY = Math.random() * 100;
      // Calculate pixel movement based on viewport (use 100px as base for smooth movement)
      const moveDistanceX =
        (15 + Math.random() * 25) * (typeof window !== 'undefined' ? window.innerWidth / 1920 : 1); // Scale with viewport
      const moveDistanceY =
        (20 + Math.random() * 30) * (typeof window !== 'undefined' ? window.innerHeight / 1080 : 1); // Scale with viewport
      const directionX = Math.random() > 0.5 ? 1 : -1;
      const directionY = Math.random() > 0.5 ? 1 : -1;

      return {
        id: i,
        x: initialX,
        y: initialY,
        size: minSize + Math.random() * (maxSize - minSize),
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 20 + Math.random() * 15, // 20-35 seconds for smoother movement
        delay: Math.random() * 3,
        // Store pixel-based movement data for animation
        moveX: moveDistanceX * directionX,
        moveY: moveDistanceY * directionY,
      } as Particle & { moveX: number; moveY: number };
    });

    setParticles(newParticles as Particle[]);
  }, [count, minSize, maxSize, colors, isMounted, reducedMotion]);

  // Don't render on server to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Reduce particle count on mobile for performance
  const displayCount =
    typeof window !== 'undefined' && window.innerWidth < 768 ? Math.floor(count * 0.6) : count;
  const displayParticles = particles.slice(0, displayCount);

  if (reducedMotion || displayParticles.length === 0) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden={true}
    >
      {displayParticles.map(particle => {
        const baseOpacity = 0.5 + Math.random() * 0.3; // 0.5-0.8 opacity for better visibility
        const moveX = particle.moveX || (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 25);
        const moveY = particle.moveY || (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 30);

        // Convert percentage positions to pixel values for animation
        // Use viewport dimensions for accurate pixel calculation
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

        const initialXPx = (particle.x / 100) * viewportWidth;
        const initialYPx = (particle.y / 100) * viewportHeight;

        // Calculate target positions in pixels
        const _targetXPx = initialXPx + moveX;
        const _targetYPx = initialYPx + moveY;

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: baseOpacity,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              filter: `blur(${Math.max(0.5, particle.size / 4)}px)`,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`,
              willChange: 'transform, opacity',
              transform: 'translateZ(0)', // Force GPU acceleration
              backfaceVisibility: 'hidden', // Prevent flickering
            }}
            animate={{
              x: [0, moveX, 0], // Pixel-based movement relative to initial position
              y: [0, moveY, 0], // Pixel-based movement relative to initial position
              opacity: [
                baseOpacity,
                Math.min(1, baseOpacity * 1.2), // Reduced opacity variation
                baseOpacity,
              ],
            }}
            transition={{
              duration: particle.duration / speed,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1], // Smoother easing curve
              delay: particle.delay,
            }}
          />
        );
      })}
    </div>
  );
}
