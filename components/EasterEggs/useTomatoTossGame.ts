'use client';

/**
 * Hook for managing Tomato Toss game logic
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTomatoTossSounds } from './useTomatoTossSounds';
import { addStat, STAT_KEYS } from '@/lib/arcadeStats';
import { throwConfetti } from '@/hooks/useConfetti';

interface Splatter {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  id: string;
}

interface Tomato {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
}

export const useTomatoTossGame = () => {
  const [throws, setThrows] = useState(0);
  const [splatters, setSplatters] = useState<Splatter[]>([]);
  const [playTime, setPlayTime] = useState(0);
  const [alertShown, setAlertShown] = useState(false);
  const [tomatoes, setTomatoes] = useState<Tomato[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const playTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sounds = useTomatoTossSounds();
  const MAX_SPLATTERS = 50;
  const GAME_DURATION = 20; // 20 seconds

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Initialize audio on mount
  useEffect(() => {
    const initialized = sounds.initAudio();
    setAudioReady(initialized);
  }, [sounds]);

  // Initialize timer on mount
  useEffect(() => {
    playTimeIntervalRef.current = setInterval(() => {
      setPlayTime(prev => {
        const newTime = prev + 1;

        // Auto-finish after 20 seconds
        if (newTime >= GAME_DURATION && !gameFinished) {
          setGameFinished(true);
          sounds.playAlertSound();
        }

        // Alert after 30 seconds (legacy)
        if (newTime >= 30 && !alertShown) {
          setAlertShown(true);
          sounds.playAlertSound();
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (playTimeIntervalRef.current) {
        clearInterval(playTimeIntervalRef.current);
      }
    };
  }, [alertShown, sounds, gameFinished]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sounds.cleanup();
      if (playTimeIntervalRef.current) {
        clearInterval(playTimeIntervalRef.current);
      }
    };
  }, [sounds]);

  // Handle tomato throw
  const handleThrow = useCallback(
    (clientX: number, clientY: number, wallBounds: DOMRect) => {
      if (!audioReady) {
        const initialized = sounds.initAudio();
        setAudioReady(initialized);
      }

      sounds.playThrowSound();

      // Calculate start position (center-bottom of screen, relative to wall)
      const startX = window.innerWidth / 2 - wallBounds.left;
      const startY = window.innerHeight - 100 - wallBounds.top;

      // Calculate end position (relative to wall)
      const endX = clientX - wallBounds.left;
      const endY = clientY - wallBounds.top;

      // Create tomato projectile
      const tomatoId = `tomato-${Date.now()}-${Math.random()}`;
      const newTomato: Tomato = {
        id: tomatoId,
        startX,
        startY,
        endX,
        endY,
        progress: 0,
      };

      setTomatoes(prev => [...prev, newTomato]);

      // Animate tomato
      const duration = reducedMotion ? 0.2 : 0.4;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);

        setTomatoes(prev => prev.map(t => (t.id === tomatoId ? { ...t, progress } : t)));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Impact - create splatter
          sounds.playSplatSound();

          const splatter: Splatter = {
            x: endX,
            y: endY,
            rotation: Math.random() * 90 - 45, // -45 to 45 degrees
            scale: Math.random() * 0.4 + 0.8, // 0.8 to 1.2
            opacity: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
            id: `splatter-${Date.now()}-${Math.random()}`,
          };

          setSplatters(prev => {
            const updated = [...prev, splatter];
            // Limit splatters to prevent memory issues
            if (updated.length > MAX_SPLATTERS) {
              return updated.slice(-MAX_SPLATTERS);
            }
            return updated;
          });

          setThrows(prev => {
            const newThrows = prev + 1;

            // Update stats
            const newTotal = addStat(STAT_KEYS.TOMATOES, 1);

            // Check milestones and trigger confetti
            if ([10, 25, 50, 100].includes(newTotal)) {
              throwConfetti(1.5);
            } else if ([10, 25, 50, 100].includes(newThrows)) {
              // Session milestones too
              throwConfetti(1);
            }

            // Play confetti sound at >20 throws (legacy)
            if (newThrows === 21) {
              sounds.playConfettiSound();
            }

            return newThrows;
          });

          // Remove tomato after animation
          setTomatoes(prev => prev.filter(t => t.id !== tomatoId));
        }
      };

      requestAnimationFrame(animate);
    },
    [audioReady, sounds, reducedMotion],
  );

  return {
    throws,
    splatters,
    tomatoes,
    playTime,
    alertShown,
    reducedMotion,
    handleThrow,
    gameFinished,
  };
};
