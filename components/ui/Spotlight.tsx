'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface SpotlightProps {
  /**
   * Color of the spotlight (cyan, magenta, blue, or custom hex)
   */
  color?: 'cyan' | 'magenta' | 'blue' | string;
  /**
   * Size of the spotlight in pixels
   */
  size?: number;
  /**
   * Opacity of the spotlight (0-1)
   */
  opacity?: number;
  /**
   * Whether to follow mouse cursor
   */
  followCursor?: boolean;
  /**
   * Fixed position (x, y) if not following cursor
   */
  position?: { x: number; y: number };
  /**
   * Additional className
   */
  className?: string;
}

const colorMap = {
  cyan: '#29E7CD',
  magenta: '#D925C7',
  blue: '#3B82F6',
};

/**
 * Spotlight component that creates a radial gradient spotlight effect
 * Can follow mouse cursor or be positioned fixed
 */
export function Spotlight({
  color = 'cyan',
  size = 400,
  opacity = 0.15,
  followCursor = true,
  position,
  className = '',
}: SpotlightProps) {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const fixedX = useMotionValue(position?.x ?? 0);
  const fixedY = useMotionValue(position?.y ?? 0);

  // Smooth spring animations for cursor following - optimized for performance
  const springConfig = { damping: 60, stiffness: 200 }; // Reduced stiffness for smoother, less jittery movement
  const x = useSpring(followCursor ? mouseX : fixedX, springConfig);
  const y = useSpring(followCursor ? mouseY : fixedY, springConfig);

  // Transform to center the spotlight on cursor
  const spotlightX = useTransform(x, value => value - size / 2);
  const spotlightY = useTransform(y, value => value - size / 2);

  const spotlightColor = colorMap[color as keyof typeof colorMap] || color;

  // Only render on client to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!followCursor || typeof window === 'undefined') return;

    // Check for reduced motion preference
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Throttle mouse updates for performance (max 30fps for smoother performance)
    let rafId: number;
    let lastUpdate = 0;
    const throttleMs = 33; // ~30fps instead of 60fps for better performance

    const throttledMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleMs) return;
      lastUpdate = now;

      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleMouseMove(e);
        rafId = 0;
      });
    };

    window.addEventListener('mousemove', throttledMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', throttledMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [followCursor, mouseX, mouseY]);

  useEffect(() => {
    if (position && !followCursor) {
      fixedX.set(position.x);
      fixedY.set(position.y);
    }
  }, [position, followCursor, fixedX, fixedY]);

  // Don't render on server to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 -z-10 ${className}`}
      aria-hidden="true"
    >
      <motion.div
        style={{
          x: spotlightX,
          y: spotlightY,
          width: size,
          height: size,
          background: `radial-gradient(circle, ${spotlightColor} ${opacity * 100}%, transparent 70%)`,
          filter: 'blur(40px)',
          willChange: 'transform',
          transform: 'translateZ(0)', // Force GPU acceleration
        }}
        className="absolute rounded-full"
      />
    </div>
  );
}
