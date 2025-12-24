/**
 * Background PNG Generator Page
 *
 * Access at: http://localhost:3000/generate-background
 *
 * This page renders the background and provides a download button
 */

'use client';

import React, { useRef } from 'react';
import { useAlert } from '@/hooks/useAlert';
import { backgroundTheme } from '@/lib/theme';
import { logger } from '@/lib/logger';

/**
 * Background PNG Generator Page
 *
 * @component
 * @returns {JSX.Element} Rendered background generator page
 */
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
        // @ts-expect-error - scale is valid but not in types
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
        a.download = 'prepflow-background.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        await showAlert({
          title: 'Download Complete',
          message: 'Background downloaded! Save it to public/images/background.png',
          variant: 'info',
        });
      }, 'image/png');
    } catch (error) {
      logger.error('Error generating background:', error);
      await showAlert({
        title: 'Error',
        message: 'html2canvas not available. Please use the Node.js script instead.',
        variant: 'danger',
      });
    }
  };

  // Logo watermark positions
  const logoPositions = [
    { x: 10, y: 15, rotation: 0, scale: 0.8 },
    { x: 40, y: 40, rotation: 15, scale: 0.9 },
    { x: 70, y: 65, rotation: 30, scale: 1.0 },
  ];

  const mouseX = 960; // Center
  const mouseY = 540; // Center

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
            Download Background PNG
          </button>
          <p className="mt-2 text-sm text-gray-400">Click to download a 1920x1080px PNG</p>
        </div>

        {/* Background Container */}
        <div
          ref={containerRef}
          className="relative h-[1080px] w-[1920px] overflow-hidden"
          style={{ margin: '0 auto' }}
        >
          {/* Base gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(8,8,10,1) 100%)',
            }}
          />

          {/* Spotlight (fixed position) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(41, 231, 205, 0.06), transparent 40%)`,
            }}
          />

          {/* Logo watermarks */}
          {logoPositions.map((pos, i) => (
            <div
              key={i}
              className="pointer-events-none absolute opacity-[0.02]"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: '300px',
                height: '300px',
                transform: `rotate(${pos.rotation}deg) scale(${pos.scale})`,
              }}
            >
              <svg width="300" height="300" viewBox="0 0 300 300">
                <circle
                  cx="150"
                  cy="150"
                  r="100"
                  fill="rgba(41,231,205,0.02)"
                  stroke="rgba(41,231,205,0.04)"
                  strokeWidth="2"
                />
              </svg>
            </div>
          ))}

          {/* Tron-like neon grid */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(41,231,205,${backgroundTheme.gridCyanOpacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,${backgroundTheme.gridBlueOpacity}) 1px, transparent 1px)`,
              backgroundSize: `${backgroundTheme.gridSizePx}px ${backgroundTheme.gridSizePx}px`,
              backgroundPosition: '0px 0px, 0px 0px',
              maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
            }}
          />

          {/* Corner glows */}
          <div
            className="pointer-events-none absolute top-0 left-0"
            style={{
              width: '420px',
              height: '420px',
              background: `radial-gradient(closest-side, rgba(41,231,205,${backgroundTheme.cornerCyanOpacity}), transparent 70%)`,
            }}
          />
          <div
            className="pointer-events-none absolute top-[120px] right-0"
            style={{
              width: '400px',
              height: '400px',
              background: `radial-gradient(closest-side, rgba(217,37,199,${backgroundTheme.cornerMagentaOpacity}), transparent 70%)`,
            }}
          />

          {/* Fine noise */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.02]"
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
