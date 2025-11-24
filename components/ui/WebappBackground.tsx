'use client';

import React, { useState, useEffect } from 'react';
import { backgroundTheme } from '@/lib/theme';
import { LogoWatermark } from './LogoWatermark';
import { FloatingParticles } from './FloatingParticles';

interface WebappBackgroundProps {
  /**
   * Enable mouse-following spotlight effect
   */
  spotlight?: boolean;
  /**
   * Enable grid background
   */
  grid?: boolean;
  /**
   * Enable corner glows
   */
  cornerGlows?: boolean;
  /**
   * Enable logo watermarks
   */
  watermarks?: boolean;
  /**
   * Enable floating particles
   */
  particles?: boolean;
  /**
   * Spotlight intensity (0-1)
   */
  spotlightIntensity?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Webapp Background Component
 *
 * Provides subtle background effects for webapp pages, similar to landing page
 * but optimized for webapp context. Can be used selectively for enhanced pages.
 *
 * @example
 * ```tsx
 * // Minimal background (just spotlight)
 * <WebappBackground spotlight={true} />
 *
 * // Full background effects
 * <WebappBackground
 *   spotlight={true}
 *   grid={true}
 *   cornerGlows={true}
 *   watermarks={true}
 *   particles={true}
 * />
 * ```
 */
export function WebappBackground({
  spotlight = true,
  grid = false,
  cornerGlows = false,
  watermarks = false,
  particles = false,
  spotlightIntensity = 0.08,
  className,
}: WebappBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!spotlight) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [spotlight]);

  return (
    <>
      {/* Base gradient */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: 'linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(8,8,10,1) 100%)',
        }}
      />

      {/* Mouse-following spotlight */}
      {spotlight && (
        <div
          className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(41, 231, 205, ${spotlightIntensity}), transparent 40%)`,
          }}
        />
      )}

      {/* Logo watermarks */}
      {watermarks && <LogoWatermark count={2} opacity={0.015} size={250} />}

      {/* Tron-like neon grid */}
      {grid && (
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(rgba(41,231,205,${backgroundTheme.gridCyanOpacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,${backgroundTheme.gridBlueOpacity}) 1px, transparent 1px)`,
            backgroundSize: `${backgroundTheme.gridSizePx}px ${backgroundTheme.gridSizePx}px`,
            backgroundPosition: '0px 0px, 0px 0px',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          }}
        />
      )}

      {/* Corner glows */}
      {cornerGlows && (
        <>
          <div
            className="pointer-events-none fixed -z-10"
            style={{
              left: 0,
              top: 0,
              width: 300,
              height: 300,
              background: `radial-gradient(closest-side, rgba(41,231,205,${backgroundTheme.cornerCyanOpacity * 0.5}), transparent 70%)`,
            }}
          />
          <div
            className="pointer-events-none fixed -z-10"
            style={{
              right: 0,
              top: 120,
              width: 300,
              height: 300,
              background: `radial-gradient(closest-side, rgba(217,37,199,${backgroundTheme.cornerMagentaOpacity * 0.5}), transparent 70%)`,
            }}
          />
        </>
      )}

      {/* Floating particles */}
      {particles && <FloatingParticles count={30} />}
    </>
  );
}
