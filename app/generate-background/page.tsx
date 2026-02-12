/**
 * Background PNG Generator Page
 *
 * Access at: http://localhost:3000/generate-background
 *
 * This page renders the comprehensive background with all layers:
 * 1. Base Gradient
 * 2. LandingBackground elements (Grid, Spotlights, Watermarks, Noise)
 * 3. GradientOrbs (Colored blurs)
 * 4. AnimatedBackground (Concentric rings)
 * 5. BackgroundLogo (Large blurred logo)
 */

'use client';

import { useAlert } from '@/hooks/useAlert';
import { logger } from '@/lib/logger';
import { backgroundTheme } from '@/lib/theme';
import { useRef } from 'react';

export default function GenerateBackgroundPage() {
  const { showAlert, AlertDialog } = useAlert();
  const containerRef = useRef<HTMLDivElement>(null);

  const downloadBackground = async () => {
    if (!containerRef.current) return;

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(containerRef.current, {
        width: 1920,
        height: 1080,
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: '#0a0a0a',
        logging: false,
      });

      // Convert to blob and download
      canvas.toBlob(async blob => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prepflow-background-full.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        await showAlert({
          title: 'Download Complete',
          message: 'Full background downloaded!',
          variant: 'info',
        });
      }, 'image/png');
    } catch (error) {
      logger.error('Error generating background:', error);
      await showAlert({
        title: 'Error',
        message: 'html2canvas failed. Please use the Node.js script.',
        variant: 'danger',
      });
    }
  };

  return (
    <>
      <AlertDialog />
      <div className="relative min-h-screen bg-[#0a0a0a]">
        {/* Controls */}
        <div className="fixed top-4 left-4 z-[1000] rounded-xl border border-[#2a2a2a] bg-[#1f1f1f]/95 p-4">
          <button
            onClick={downloadBackground}
            className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
          >
            Download Full Background
          </button>
          <p className="mt-2 text-sm text-gray-400">1920x1080px with all effects</p>
        </div>

        {/*
          Background Container
          Fixed to 1920x1080 for consistent export
        */}
        <div
          ref={containerRef}
          className="relative h-[1080px] w-[1920px] overflow-hidden bg-[#0a0a0a]"
          style={{ margin: '0 auto' }}
        >
          {/* =========================================
             LAYER 1: Base Gradient & Grid (LandingBackground)
             ========================================= */}

          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#08080a]" />

          {/* Static Spotlight (Center) */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(800px circle at 50% 50%, rgba(41, 231, 205, 0.04), transparent 50%)`,
            }}
          />

          {/* Tron-like neon grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(41,231,205,${backgroundTheme.gridCyanOpacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,${backgroundTheme.gridBlueOpacity}) 1px, transparent 1px)`,
              backgroundSize: `${backgroundTheme.gridSizePx}px ${backgroundTheme.gridSizePx}px`,
              maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
            }}
          />

          {/* =========================================
             LAYER 2: Gradient Orbs (Colored Blurs)
             ========================================= */}

          {/* Primary Cyan Orb - Top Left */}
          <div
            className="absolute -top-[200px] -left-[200px] h-[800px] w-[800px] rounded-full blur-3xl"
            style={{ background: 'var(--primary)', opacity: 0.08 }}
          />

          {/* Secondary Magenta Orb - Bottom Right */}
          <div
            className="absolute -right-[250px] -bottom-[250px] h-[1000px] w-[1000px] rounded-full blur-3xl"
            style={{ background: 'var(--accent)', opacity: 0.06 }}
          />

          {/* Blue Accent Orb - Center */}
          <div
            className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: 'var(--secondary)', opacity: 0.05 }}
          />

          {/* =========================================
             LAYER 3: Concentric Rings / Waves (AnimatedBackground)
             Recreated as static SVG for perfect vector quality
             ========================================= */}

          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            {/* Center slightly offset as per original animation (80% W, 45% H) */}
            <svg width="100%" height="100%" viewBox="0 0 1920 1080">
              <g transform="translate(1536, 486)">
                {' '}
                {/* 0.8 * 1920, 0.45 * 1080 */}
                {[0, 1, 2, 3].map(i => {
                  const radius = 200 + i * 120; // Expanded for static view
                  const opacity = 0.5 - i * 0.1;
                  return (
                    <circle
                      key={i}
                      cx="0"
                      cy="0"
                      r={radius}
                      fill="none"
                      stroke="rgba(41, 231, 205, 1)"
                      strokeWidth="1.5"
                      strokeOpacity={opacity}
                    />
                  );
                })}
                {/* Glow effect for inner rings */}
                <circle
                  cx="0"
                  cy="0"
                  r="200"
                  fill="none"
                  stroke="rgba(41,231,205,0.3)"
                  strokeWidth="4"
                  filter="blur(4px)"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="320"
                  fill="none"
                  stroke="rgba(41,231,205,0.2)"
                  strokeWidth="4"
                  filter="blur(4px)"
                />
              </g>
            </svg>
          </div>

          {/* =========================================
             LAYER 4: Corner Glows & Details
             ========================================= */}

          <div
            className="absolute top-0 left-0 h-[420px] w-[420px]"
            style={{
              background: `radial-gradient(closest-side, rgba(41,231,205,${backgroundTheme.cornerCyanOpacity}), transparent 70%)`,
            }}
          />
          <div
            className="absolute top-[120px] right-0 h-[400px] w-[400px]"
            style={{
              background: `radial-gradient(closest-side, rgba(217,37,199,${backgroundTheme.cornerMagentaOpacity}), transparent 70%)`,
            }}
          />

          {/* =========================================
             LAYER 5: Logo Watermarks & Noise
             ========================================= */}

          {/* Main Large Blurred Logo (BackgroundLogo.tsx) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] blur-xl">
            {/* Using SVG placeholder since next/image might not load in simple screenshot if not running */}
            <svg width="800" height="800" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* =========================================
             LAYER 6: Floating Particles (Stars)
             Static implementation of FloatingParticles.tsx
             ========================================= */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(40)].map((_, i) => {
              // Deterministic "random" positions based on index for consistent export
              const x = (i * 37) % 100;
              const y = (i * 73) % 100;
              const size = 2 + (i % 5);
              const color = ['#29E7CD', '#D925C7', '#3B82F6'][i % 3];
              const opacity = 0.4 + (i % 5) / 10;

              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    opacity: opacity,
                    filter: `blur(${size / 2}px)`,
                    boxShadow: `0 0 ${size * 2}px ${color}40`,
                  }}
                />
              );
            })}
          </div>

          {/* Specs / Fine Noise */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/></filter><rect width="64" height="64" filter="url(%23n)" opacity="0.5"/></svg>\')',
              backgroundSize: '256px 256px',
            }}
          />
        </div>
      </div>
    </>
  );
}
