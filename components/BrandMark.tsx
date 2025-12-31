// PrepFlow Personality System - BrandMark Component with Seasonal Overlays and Framer Motion

'use client';

import OptimizedImage from '@/components/OptimizedImage';
import { checkSeasonalMatch } from '@/lib/personality/utils';
import { logger } from '@/lib/logger';
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
  floating = false,
  glowOnHover = true,
  animationIntensity = 1,
}: BrandMarkProps) {
  const [seasonalEffect, setSeasonalEffect] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for seasonal match and also read from DOM (for manual testing)
    const checkSeasonal = () => {
      const domEffect = document.documentElement.getAttribute('data-seasonal');
      const dateEffect = checkSeasonalMatch();
      const effect = domEffect || dateEffect;
      setSeasonalEffect(effect);
      if (dateEffect && !domEffect) {
        document.documentElement.setAttribute('data-seasonal', dateEffect);
      }
    };

    checkSeasonal();

    // Listen for changes to data-seasonal attribute (for manual testing)
    const observer = new MutationObserver(() => {
      checkSeasonal();
    });

    const target = document.documentElement;
    // Defensive check: ensure target is a valid Node before observing
    if (target && target instanceof Node) {
      try {
        observer.observe(target, {
          attributes: true,
          attributeFilter: ['data-seasonal'],
        });
      } catch (error) {
        // Silently fail if observation fails (e.g., element not ready)
        logger.warn('[BrandMark] Failed to observe documentElement:', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Enable floating automatically when seasonal effect is active
  const effectiveFloating = floating || seasonalEffect !== null;
  const shouldAnimate = effectiveFloating && !reducedMotion && animationIntensity > 0;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${seasonalEffect ? 'overflow-visible' : 'overflow-hidden'} ${className}`}
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
          sizes={`${width}px`}
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
          aria-hidden={true}
        />
      )}
      {/* Seasonal overlays rendered via CSS based on data-seasonal attribute */}
      {seasonalEffect && (
        <>
          <div className={`pf-seasonal-overlay pf-seasonal-${seasonalEffect}`} aria-hidden={true} />
          {/* Star Wars sparkles */}
          {seasonalEffect === 'lightsaber' && !reducedMotion && (
            <>
              <div className="pf-lightsaber-sparkle pf-sparkle-1" aria-hidden={true} />
              <div className="pf-lightsaber-sparkle pf-sparkle-2" aria-hidden={true} />
              <div className="pf-lightsaber-sparkle pf-sparkle-3" aria-hidden={true} />
            </>
          )}
          {/* Santa snowflakes */}
          {seasonalEffect === 'santaHat' && !reducedMotion && (
            <>
              <div className="pf-snowflake pf-snowflake-1" aria-hidden={true}>
                ❄️
              </div>
              <div className="pf-snowflake pf-snowflake-2" aria-hidden={true}>
                ❄️
              </div>
              <div className="pf-snowflake pf-snowflake-3" aria-hidden={true}>
                ❄️
              </div>
            </>
          )}
          {/* Chef's Day sparkles */}
          {seasonalEffect === 'toque' && !reducedMotion && (
            <>
              <div className="pf-chef-sparkle pf-chef-sparkle-1" aria-hidden={true}>
                ✨
              </div>
              <div className="pf-chef-sparkle pf-chef-sparkle-2" aria-hidden={true}>
                ✨
              </div>
              <div className="pf-chef-sparkle pf-chef-sparkle-3" aria-hidden={true}>
                ✨
              </div>
            </>
          )}
          {/* New Year confetti */}
          {(seasonalEffect === 'newYear' || seasonalEffect === 'newYearsEve') && !reducedMotion && (
            <>
              <div className="pf-confetti pf-confetti-1" aria-hidden={true}>
                🎊
              </div>
              <div className="pf-confetti pf-confetti-2" aria-hidden={true}>
                🎉
              </div>
              <div className="pf-confetti pf-confetti-3" aria-hidden={true}>
                ✨
              </div>
            </>
          )}
          {/* Valentine hearts */}
          {seasonalEffect === 'valentines' && !reducedMotion && (
            <>
              <div className="pf-heart pf-heart-1" aria-hidden={true}>
                💖
              </div>
              <div className="pf-heart pf-heart-2" aria-hidden={true}>
                💕
              </div>
              <div className="pf-heart pf-heart-3" aria-hidden={true}>
                💗
              </div>
            </>
          )}
          {/* Easter eggs */}
          {seasonalEffect === 'easter' && !reducedMotion && (
            <>
              <div className="pf-easter-egg pf-easter-egg-1" aria-hidden={true}>
                🥚
              </div>
              <div className="pf-easter-egg pf-easter-egg-2" aria-hidden={true}>
                🐣
              </div>
              <div className="pf-easter-egg pf-easter-egg-3" aria-hidden={true}>
                🌸
              </div>
            </>
          )}
          {/* Halloween bats/pumpkins */}
          {seasonalEffect === 'halloween' && !reducedMotion && (
            <>
              <div className="pf-halloween pf-halloween-1" aria-hidden={true}>
                🦇
              </div>
              <div className="pf-halloween pf-halloween-2" aria-hidden={true}>
                🎃
              </div>
              <div className="pf-halloween pf-halloween-3" aria-hidden={true}>
                👻
              </div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
}
