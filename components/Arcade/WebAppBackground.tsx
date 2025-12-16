/**
 * WebApp Background Component
 *
 * Reusable background graphics matching the webapp theme.
 * Includes gradient base, neon grid, corner glows, and noise texture.
 */

import React from 'react';
import { backgroundTheme } from '@/lib/theme';

interface WebAppBackgroundProps {
  compact?: boolean;
}

const WebAppBackground: React.FC<WebAppBackgroundProps> = ({ compact = false }) => {
  return (
    <>
      {/* Base gradient - adapts to light/dark mode */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'var(--background-gradient, linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(8,8,10,1) 100%))',
        }}
      />

      {/* Tron-like neon grid */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(41,231,205,${compact ? backgroundTheme.gridCyanOpacity * 0.5 : backgroundTheme.gridCyanOpacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,${compact ? backgroundTheme.gridBlueOpacity * 0.5 : backgroundTheme.gridBlueOpacity}) 1px, transparent 1px)`,
          backgroundSize: `${compact ? backgroundTheme.gridSizePx * 1.2 : backgroundTheme.gridSizePx}px ${compact ? backgroundTheme.gridSizePx * 1.2 : backgroundTheme.gridSizePx}px`,
          backgroundPosition: '0px 0px, 0px 0px',
          maskImage: 'radial-gradient(120% 80% at 50% 20%, black 60%, transparent 100%)',
        }}
      />

      {/* Corner glows */}
      <div
        className="pointer-events-none fixed -z-10"
        style={{
          left: 0,
          top: 0,
          width: compact ? 280 : 420,
          height: compact ? 280 : 420,
          background: `radial-gradient(closest-side, rgba(41,231,205,${compact ? backgroundTheme.cornerCyanOpacity * 0.6 : backgroundTheme.cornerCyanOpacity}), transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none fixed -z-10"
        style={{
          right: 0,
          top: 120,
          width: compact ? 260 : 400,
          height: compact ? 260 : 400,
          background: `radial-gradient(closest-side, rgba(217,37,199,${compact ? backgroundTheme.cornerMagentaOpacity * 0.6 : backgroundTheme.cornerMagentaOpacity}), transparent 70%)`,
        }}
      />

      {/* Fine noise */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/></filter><rect width="64" height="64" filter="url(%23n)" opacity="0.5"/></svg>\')',
          backgroundSize: '256px 256px',
        }}
      />
    </>
  );
};

export default WebAppBackground;
