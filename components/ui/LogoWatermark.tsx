'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LogoWatermarkProps {
  /**
   * Logo source path
   */
  src?: string;
  /**
   * Number of watermark instances
   */
  count?: number;
  /**
   * Opacity of watermarks (0-1)
   */
  opacity?: number;
  /**
   * Size of each watermark in pixels
   */
  size?: number;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * LogoWatermark component creates subtle logo watermarks in the background
 * Multiple instances for depth effect
 */
export function LogoWatermark({
  src = '/images/prepflow-logo.png',
  count = 3,
  opacity = 0.03,
  size = 200,
  className = '',
}: LogoWatermarkProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
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

  // Generate positions for watermarks
  const positions = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 30 + 10) % 100, // Spread across the page
    y: (i * 25 + 15) % 100,
    rotation: i * 15, // Slight rotation variation
    scale: 0.8 + (i % 3) * 0.1, // Varying sizes
  }));

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {positions.map(pos => (
        <motion.div
          key={pos.id}
          className="absolute"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            opacity,
            transform: `rotate(${pos.rotation}deg) scale(${pos.scale})`,
          }}
          animate={
            !reducedMotion
              ? {
                  opacity: [opacity, opacity * 1.5, opacity],
                  rotate: [pos.rotation, pos.rotation + 5, pos.rotation],
                }
              : {}
          }
          transition={{
            duration: 8 + pos.id * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: pos.id * 1.5,
          }}
        >
          <Image
            src={src}
            alt=""
            width={size}
            height={size}
            className="h-auto w-auto"
            aria-hidden="true"
          />
        </motion.div>
      ))}
    </div>
  );
}
