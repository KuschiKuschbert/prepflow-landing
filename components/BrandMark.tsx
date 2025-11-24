// PrepFlow Personality System - BrandMark Component with Seasonal Overlays and Framer Motion

'use client';

import OptimizedImage from '@/components/OptimizedImage';
import { checkSeasonalMatch } from '@/lib/personality/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BrandMarkProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  /**
   * Enable floating animation
   */
  floating?: boolean;
  /**
   * Enable glow effect on hover
   */
  glowOnHover?: boolean;
  /**
   * Animation intensity (0-1)
   */
  animationIntensity?: number;
}

export function BrandMark({
  src = '/images/prepflow-logo.png',
  alt = 'PrepFlow Logo',
  width = 24,
  height = 24,
  className = '',
  onClick,
  onTouchStart,
  onTouchEnd,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  floating = true,
  glowOnHover = true,
  animationIntensity = 1,
}: BrandMarkProps) {
  const [seasonalEffect, setSeasonalEffect] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const effect = checkSeasonalMatch();
    setSeasonalEffect(effect);
    if (effect) {
      document.documentElement.setAttribute('data-seasonal', effect);
    }

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const shouldAnimate = floating && !reducedMotion && animationIntensity > 0;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
      animate={
        shouldAnimate
          ? {
              y: [0, -8 * animationIntensity, 0],
            }
          : {}
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <motion.div
        onClick={onClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        className="relative z-10 h-full w-full"
        whileHover={
          glowOnHover && !reducedMotion
            ? {
                scale: 1.1,
              }
            : {}
        }
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      >
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="24px"
          priority={true}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </motion.div>
      {/* Glow effect on hover */}
      {glowOnHover && !reducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle, #29E7CD40, transparent 70%)',
          }}
          whileHover={{
            opacity: 0.6,
          }}
          aria-hidden="true"
        />
      )}
      {/* Seasonal overlays rendered via CSS based on data-seasonal attribute */}
      {seasonalEffect && (
        <div className={`pf-seasonal-overlay pf-seasonal-${seasonalEffect}`} aria-hidden="true" />
      )}
    </motion.div>
  );
}
