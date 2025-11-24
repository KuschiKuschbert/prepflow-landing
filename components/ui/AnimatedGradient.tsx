'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedGradientProps {
  /**
   * Colors for the gradient
   */
  colors?: string[];
  /**
   * Animation speed (seconds per cycle)
   */
  duration?: number;
  /**
   * Gradient direction (degrees)
   */
  angle?: number;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Opacity of the gradient
   */
  opacity?: number;
}

const defaultColors = ['#29E7CD', '#D925C7', '#3B82F6'];

/**
 * AnimatedGradient component with smooth color transitions
 * Performance optimized
 */
export function AnimatedGradient({
  colors = defaultColors,
  duration = 20,
  angle = 135,
  className = '',
  opacity = 0.1,
}: AnimatedGradientProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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

  // Create gradient stops that will animate
  const gradientStops = colors.map((color, index) => ({
    color,
    position: (index / (colors.length - 1)) * 100,
  }));

  // Don't render animated version on server to prevent hydration mismatch
  // Always render the same structure on server and client
  if (!isMounted) {
    return (
      <div
        className={`fixed inset-0 -z-10 ${className}`}
        style={{
          background: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
          opacity,
        }}
        aria-hidden="true"
      />
    );
  }

  if (reducedMotion) {
    // Static gradient for reduced motion
    return (
      <div
        className={`fixed inset-0 -z-10 ${className}`}
        style={{
          background: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
          opacity,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div
      className={`fixed inset-0 -z-10 ${className}`}
      aria-hidden="true"
      style={{
        willChange: 'opacity',
      }}
      animate={{
        background: [
          `linear-gradient(${angle}deg, ${colors.join(', ')})`,
          `linear-gradient(${angle + 45}deg, ${colors.slice(1).concat(colors[0]).join(', ')})`,
          `linear-gradient(${angle + 90}deg, ${colors.slice(2).concat(colors.slice(0, 2)).join(', ')})`,
          `linear-gradient(${angle}deg, ${colors.join(', ')})`,
        ],
        opacity: [opacity, opacity * 1.1, opacity], // Reduced opacity variation for smoother animation
      }}
      transition={{
        duration: duration * 1.5, // Slower animation for smoother performance
        repeat: Infinity,
        ease: 'linear', // Linear easing for smoother gradient transitions
      }}
    />
  );
}
