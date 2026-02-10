'use client';

import { useEffect, useRef, useState } from 'react';

import { logger } from '@/lib/logger';

interface AnimatedBackgroundProps {
  className?: string;
  theme?: string;
}

export default function AnimatedBackground({
  className = '',
  theme = 'dark',
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasAnimation(canvasRef, theme);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 h-full w-full ${className}`}
      aria-hidden={true}
      style={{ willChange: 'contents' }}
    />
  );
}

function useCanvasAnimation(canvasRef: React.RefObject<HTMLCanvasElement | null>, theme: string) {
  const animationFrameRef = useRef<number | undefined>(undefined);
  const waveRef = useRef({ phase: 0, speed: 0.02 });
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

    // Animation loop with visibility check and throttling
    let lastFrameTime = 0;
    const targetFPS = 30; // Cap at 30 FPS for background effect
    const frameInterval = 1000 / targetFPS;

    const animate = (timestamp: number) => {
      try {
        if (!canvas || !ctx || typeof window === 'undefined') {
          return;
        }

        // Stop if tab is hidden
        if (document.hidden) {
           animationFrameRef.current = requestAnimationFrame(animate);
           return;
        }

        // Throttle frame rate
        const elapsed = timestamp - lastFrameTime;
        if (elapsed < frameInterval) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        lastFrameTime = timestamp - (elapsed % frameInterval);

        if (prefersReducedMotion) {
          // Static background for reduced motion - don't draw waves
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        // Canvas is transparent - GradientOrbs component handles gradient effects
        // This canvas focuses on animated wave rings (like Apple's audio waves)
        // Context is already scaled by DPR, so use display dimensions
        const displayWidth = window.innerWidth || 1920;
        const displayHeight = window.innerHeight || 1080;

        // Clear the entire canvas first (use CSS dimensions since context is scaled)
        ctx.clearRect(0, 0, displayWidth, displayHeight);

        const { phase, speed } = waveRef.current;
        waveRef.current.phase += speed;
        // Adjust center slightly based on phase for organic movement
        const waveCenterX = displayWidth * 0.8 + Math.sin(phase * 0.5) * 20;
        const waveCenterY = displayHeight * 0.45 + Math.cos(phase * 0.3) * 20;
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

    animationFrameRef.current = requestAnimationFrame(animate); // Start loop using RAF time handling

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme, mounted]);
}
