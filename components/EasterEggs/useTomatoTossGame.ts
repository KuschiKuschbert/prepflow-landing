'use client';

/**
 * Hook for managing Tomato Toss game logic
 */

import { throwConfetti } from '@/hooks/useConfetti';
import { addStat, addSessionStat, STAT_KEYS } from '@/lib/arcadeStats';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTomatoTossSounds } from './useTomatoTossSounds';

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

  const rafRef = useRef<number | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const lastSecondRef = useRef<number>(0);
  const gameFinishedRef = useRef<boolean>(false);
  const alertShownRef = useRef<boolean>(false);
  const sounds = useTomatoTossSounds();
  const MAX_SPLATTERS = 150;
  const GAME_DURATION = 5; // 5 seconds

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sounds object is stable, initialize once on mount

  // Initialize timer on mount (click-independent via requestAnimationFrame)
  useEffect(() => {
    startTimestampRef.current = performance.now();
    const tick = () => {
      if (startTimestampRef.current == null) return;
      const elapsedMs = performance.now() - startTimestampRef.current;
      const elapsedSec = Math.floor(elapsedMs / 1000);

      if (elapsedSec !== lastSecondRef.current) {
        lastSecondRef.current = elapsedSec;
        setPlayTime(elapsedSec);

        // Auto-finish after 10 seconds
        if (elapsedSec >= GAME_DURATION && !gameFinishedRef.current) {
          setGameFinished(true);
          sounds.playAlertSound();
        }

        // Alert after 30 seconds (legacy)
        if (elapsedSec >= 30 && !alertShownRef.current) {
          setAlertShown(true);
          sounds.playAlertSound();
        }
      }

      if (!gameFinishedRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sounds]);

  // Keep refs in sync with state (avoid restarting effect)
  useEffect(() => {
    gameFinishedRef.current = gameFinished;
  }, [gameFinished]);
  useEffect(() => {
    alertShownRef.current = alertShown;
  }, [alertShown]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sounds.cleanup();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [sounds]); // sounds object is stable, cleanup only on unmount

  // Easing function for aggressive, fast throws
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  // Handle tomato throw
  const handleThrow = useCallback(
    (clientX: number, clientY: number, wallBounds: DOMRect) => {
      // Ignore input when game has finished
      if (gameFinishedRef.current) return;
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

      // Animate tomato (aggressive straight throw, 0.3s ease-out)
      const duration = reducedMotion ? 0.2 : 0.3;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const linear = Math.min(elapsed / (duration * 1000), 1);
        const progress = easeOutCubic(linear);

        setTomatoes(prev => prev.map(t => (t.id === tomatoId ? { ...t, progress } : t)));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Impact - create splatter
          sounds.playSplatSound();

          // Aggressive splash: core splat + radial droplets
          const now = Date.now();
          const newSplatters: Splatter[] = [];

          // Core splat
          newSplatters.push({
            x: endX,
            y: endY,
            rotation: Math.random() * 20 - 10,
            scale: 1.4,
            opacity: 0.95,
            id: `splatter-core-${now}-${Math.random()}`,
          });

          // Radial droplets
          const dropletCount = 16;
          for (let i = 0; i < dropletCount; i++) {
            const angle = (i / dropletCount) * Math.PI * 2 + Math.random() * 0.3;
            const distance = 20 + Math.random() * 40; // px
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            newSplatters.push({
              x: endX + dx,
              y: endY + dy,
              rotation: Math.random() * 180 - 90,
              scale: Math.random() * 0.5 + 0.4,
              opacity: Math.random() * 0.4 + 0.5,
              id: `splatter-drop-${now}-${i}-${Math.random()}`,
            });
          }

          setSplatters(prev => {
            const updated = [...prev, ...newSplatters];
            return updated.length > MAX_SPLATTERS ? updated.slice(-MAX_SPLATTERS) : updated;
          });

          setThrows(prev => {
            const newThrows = prev + 1;

            // Update both global and session stats simultaneously
            const newGlobalTotal = addStat(STAT_KEYS.TOMATOES, 1);
            const newSessionTotal = addSessionStat(STAT_KEYS.TOMATOES, 1);

            // Check milestones and trigger confetti
            // Global milestones (persistent)
            if ([10, 25, 50, 100].includes(newGlobalTotal)) {
              throwConfetti(1.5);
            }
            // Session milestones (current session)
            if ([10, 25, 50, 100].includes(newSessionTotal)) {
              throwConfetti(1);
            }
            // Legacy session throws milestone
            if ([10, 25, 50, 100].includes(newThrows)) {
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
