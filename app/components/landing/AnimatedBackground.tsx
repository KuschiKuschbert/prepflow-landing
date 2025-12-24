'use client';

import { useEffect, useRef, useState } from 'react';

import { logger } from '@/lib/logger';
import { useTheme } from '@/lib/theme/useTheme';

interface AnimatedBackgroundProps {
  className?: string;
}

export default function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const waveRef = useRef({ phase: 0, speed: 0.02 });
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Ensure we're on the client - SSR guard
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (typeof window === 'undefined') return;
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);

    // Check for reduced motion preference
    let prefersReducedMotion = false;
    try {
      prefersReducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      logger.error('[AnimatedBackground.tsx] Error in catch block:', {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      });

      // Fallback if matchMedia is not available
      prefersReducedMotion = false;
    }

    // Animation loop
    const animate = () => {
      try {
        if (!canvas || !ctx || typeof window === 'undefined') {
          return;
        }

        if (prefersReducedMotion) {
          // Static background for reduced motion - don't draw waves
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        // Canvas is transparent - GradientOrbs component handles gradient effects
        // This canvas focuses on animated wave rings (like Apple's audio waves)
        // Clear the entire canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const { phase, speed } = waveRef.current;
        waveRef.current.phase += speed;

        // Draw subtle concentric wave rings (like Apple's audio waves)
        // Positioned on the right side to complement the content
        // Context is already scaled by DPR, so use display dimensions
        const displayWidth = window.innerWidth || 1920;
        const displayHeight = window.innerHeight || 1080;
        const waveCenterX = displayWidth * 0.8;
        const waveCenterY = displayHeight * 0.45;
        const numRings = 4;

        // Theme-aware opacity - more visible in light mode, subtle in dark mode
        const baseOpacity = theme === 'light' ? 0.15 : 0.12;
        const opacityStep = theme === 'light' ? 0.025 : 0.02;

        for (let i = 0; i < numRings; i++) {
          const ringPhase = phase + i * 0.4;
          const radius = 80 + i * 50 + Math.sin(ringPhase) * 15;
          const opacity = baseOpacity - i * opacityStep;
          const alpha = Math.max(0, opacity);

          // Theme-aware cyan wave rings - more visible in light mode
          ctx.strokeStyle = `rgba(41, 231, 205, ${alpha})`;
          ctx.lineWidth = theme === 'light' ? 2 : 1.5;
          ctx.beginPath();
          ctx.arc(waveCenterX, waveCenterY, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Enhanced glow effect for inner rings - more visible in light mode
          if (i < 2) {
            const glowOpacity = theme === 'light' ? alpha * 0.5 : alpha * 0.3;
            const glowGradient = ctx.createRadialGradient(
              waveCenterX,
              waveCenterY,
              radius - 3,
              waveCenterX,
              waveCenterY,
              radius + 3,
            );
            glowGradient.addColorStop(0, `rgba(41, 231, 205, ${glowOpacity})`);
            glowGradient.addColorStop(1, 'rgba(41, 231, 205, 0)');
            ctx.strokeStyle = glowGradient;
            ctx.lineWidth = theme === 'light' ? 4 : 3;
            ctx.beginPath();
            ctx.arc(waveCenterX, waveCenterY, radius, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      } catch (error) {
        // Silently fail if there's an error - background animation is not critical
        logger.error('AnimatedBackground error:', error);
      }
    };

    animate();

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme, mounted]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 h-full w-full ${className}`}
      aria-hidden={true}
      style={{ willChange: 'contents' }}
    />
  );
}
