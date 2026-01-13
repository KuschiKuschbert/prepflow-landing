/**
 * Landing page background effects component
 * Enhanced with Framer Motion animations
 */

'use client';

import { LogoWatermark } from '@/components/ui/LogoWatermark';
import { backgroundTheme } from '@/lib/theme';
import React from 'react';

const LandingBackground = React.memo(function LandingBackground() {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Base gradient */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-[#0a0a0a] to-[#08080a]" />

      {/* Simple CSS spotlight that follows mouse */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-300"
        style={
          {
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(41, 231, 205, 0.06), transparent 40%)`,
          } as React.CSSProperties
        }
      />

      {/* Logo watermark */}
      <LogoWatermark count={3} opacity={0.02} size={300} />

      {/* Tron-like neon grid */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={
          {
            '--grid-cyan-opacity': backgroundTheme.gridCyanOpacity,
            '--grid-blue-opacity': backgroundTheme.gridBlueOpacity,
            '--grid-size': `${backgroundTheme.gridSizePx}px`,
            backgroundImage: `linear-gradient(rgba(41,231,205,var(--grid-cyan-opacity)) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,var(--grid-blue-opacity)) 1px, transparent 1px)`,
            backgroundSize: 'var(--grid-size) var(--grid-size)',
            maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          } as React.CSSProperties
        }
      />

      {/* Corner glows */}
      <div
        className="pointer-events-none fixed top-0 left-0 -z-10 h-[420px] w-[420px]"
        style={
          {
            '--cyan-opacity': backgroundTheme.cornerCyanOpacity,
            background: `radial-gradient(closest-side, rgba(41,231,205,var(--cyan-opacity)), transparent 70%)`,
          } as React.CSSProperties
        }
      />
      <div
        className="pointer-events-none fixed top-[120px] right-0 -z-10 h-[400px] w-[400px]"
        style={
          {
            '--magenta-opacity': backgroundTheme.cornerMagentaOpacity,
            background: `radial-gradient(closest-side, rgba(217,37,199,var(--magenta-opacity)), transparent 70%)`,
          } as React.CSSProperties
        }
      />

      {/* Fine noise */}
      <div className="pointer-events-none fixed inset-0 -z-10 animate-pulse bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] bg-[length:256px_256px] opacity-[0.02]" />
    </>
  );
});

export default LandingBackground;
