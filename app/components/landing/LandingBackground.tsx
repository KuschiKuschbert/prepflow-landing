/**
 * Landing page background effects component
 */

import React from 'react';

const LandingBackground = React.memo(function LandingBackground() {
  return (
    <>
      {/* Base gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(8,8,10,1) 100%)',
        }}
      />

      {/* Tron-like neon grid */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(41,231,205,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          backgroundPosition: '0px 0px, 0px 0px',
          maskImage: 'radial-gradient(120% 80% at 50% 20%, black 60%, transparent 100%)',
        }}
      />

      {/* Diagonal sweep removed: static background only */}

      {/* Corner glows */}
      <div
        className="pointer-events-none fixed -z-10"
        style={{
          left: 0,
          top: 0,
          width: 420,
          height: 420,
          background: 'radial-gradient(closest-side, rgba(41,231,205,0.18), transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none fixed -z-10"
        style={{
          right: 0,
          top: 120,
          width: 400,
          height: 400,
          background: 'radial-gradient(closest-side, rgba(217,37,199,0.16), transparent 70%)',
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

      {/* No keyframes (no animation) */}
    </>
  );
});

export default LandingBackground;
