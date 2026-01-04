'use client';

import { useEffect, useRef, useState } from 'react';

import { logger } from '@/lib/logger';

interface PulsatingConcentricTrianglesProps {
  className?: string;
}

/**
 * Draws an equilateral triangle on the canvas
 */
function drawTriangle(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  rotation: number,
) {
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI * 2 * i) / 3 + rotation;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
}

export default function PulsatingConcentricTriangles({
  className = '',
}: PulsatingConcentricTrianglesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const waveRef = useRef({ phase: 0, speed: 0.02 });
  const rotationRef = useRef({ phase: 0, speed: 0.005 });
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
      logger.error('[PulsatingConcentricTriangles.tsx] Error checking reduced motion:', {
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      });
      prefersReducedMotion = false;
    }

    // Animation loop
    const animate = () => {
      try {
        if (!canvas || !ctx || typeof window === 'undefined') {
          return;
        }

        if (prefersReducedMotion) {
          // Static background for reduced motion - don't draw triangles
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        // Calculate display dimensions (CSS pixel space, not buffer dimensions)
        const displayWidth = window.innerWidth || 1920;
        const displayHeight = window.innerHeight || 1080;

        // Clear the entire canvas first (use CSS dimensions since context is scaled)
        ctx.clearRect(0, 0, displayWidth, displayHeight);

        const { phase, speed } = waveRef.current;
        const { phase: rotationPhase, speed: rotationSpeed } = rotationRef.current;
        waveRef.current.phase += speed;
        rotationRef.current.phase += rotationSpeed;

        // Position at 80% width, 45% height (matching PrepFlow)
        const triangleCenterX = displayWidth * 0.8;
        const triangleCenterY = displayHeight * 0.45;
        const numTriangles = 4;

        // Opacity settings (matching PrepFlow's baseOpacity and opacityStep)
        const baseOpacity = 0.12;
        const opacityStep = 0.02;

        for (let i = 0; i < numTriangles; i++) {
          const trianglePhase = phase + i * 0.4;
          const baseRadius = 80 + i * 50;
          const radius = baseRadius + Math.sin(trianglePhase) * 15;
          const opacity = baseOpacity - i * opacityStep;
          const alpha = Math.max(0, opacity);

          // Rotation: each triangle rotates at different speeds for visual interest
          const rotation = rotationPhase + i * 0.3;

          // CurbOS brand color: #C0FF02 (lime green)
          ctx.strokeStyle = `rgba(192, 255, 2, ${alpha})`;
          ctx.lineWidth = 1.5;
          drawTriangle(ctx, triangleCenterX, triangleCenterY, radius, rotation);

          // Enhanced glow effect for inner triangles (matching PrepFlow)
          if (i < 2) {
            const glowOpacity = alpha * 0.3;
            // Create a subtle glow by drawing a slightly larger triangle with lower opacity
            ctx.strokeStyle = `rgba(192, 255, 2, ${glowOpacity})`;
            ctx.lineWidth = 3;
            drawTriangle(ctx, triangleCenterX, triangleCenterY, radius + 3, rotation);
            // Redraw the main triangle on top
            ctx.strokeStyle = `rgba(192, 255, 2, ${alpha})`;
            ctx.lineWidth = 1.5;
            drawTriangle(ctx, triangleCenterX, triangleCenterY, radius, rotation);
          }
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      } catch (error) {
        // Silently fail if there's an error - background animation is not critical
        logger.error('PulsatingConcentricTriangles error:', error);
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
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden={true}
      style={{ willChange: 'contents' }}
    />
  );
}
