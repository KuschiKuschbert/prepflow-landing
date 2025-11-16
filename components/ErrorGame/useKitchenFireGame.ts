'use client';

/**
 * Hook for managing Kitchen's on Fire game logic
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useKitchenFireSounds } from './useKitchenFireSounds';
import { addStat, addSessionStat, STAT_KEYS } from '@/lib/arcadeStats';
import { throwConfetti } from '@/hooks/useConfetti';

export const useKitchenFireGame = () => {
  // Initialize with fixed value to prevent hydration mismatch
  // Random value will be set on client after mount
  const [flames, setFlames] = useState(12);
  const [extinguished, setExtinguished] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [alertShown, setAlertShown] = useState(false);
  const [fastestTime, setFastestTime] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const playTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sounds = useKitchenFireSounds();

  // Set random flames value after mount to prevent hydration mismatch
  useEffect(() => {
    setFlames(Math.floor(Math.random() * 8) + 8);
  }, []);

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

  // Load fastest time from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kitchenFireFastestTime');
      if (stored) {
        setFastestTime(parseInt(stored, 10));
      }
    }
  }, []);

  // Initialize timer on mount
  useEffect(() => {
    playTimeIntervalRef.current = setInterval(() => {
      setPlayTime(prev => {
        const newTime = prev + 1;
        if (newTime >= 45 && !alertShown) {
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
  }, [alertShown, sounds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sounds.cleanup();
      if (playTimeIntervalRef.current) {
        clearInterval(playTimeIntervalRef.current);
      }
    };
  }, [sounds]);

  // Handle spray water click
  const handleSprayWater = useCallback(() => {
    if (extinguished) return;

    if (!audioReady) {
      const initialized = sounds.initAudio();
      setAudioReady(initialized);
      if (initialized) {
        setTimeout(() => {
          sounds.startFireLoop();
        }, 100);
      }
    } else {
      sounds.startFireLoop();
    }

    sounds.playExtinguisherSound();
    setFlames(prev => {
      const newFlames = prev - 1;
      if (newFlames === 0) {
        setExtinguished(true);
        sounds.stopFireLoop();
        sounds.playSuccessSound();

        // Update stats (both persistent and session)
        addStat(STAT_KEYS.FIRES, 1);
        addSessionStat(STAT_KEYS.FIRES, 1);

        // Trigger confetti
        throwConfetti(1.5);

        if (typeof window !== 'undefined') {
          const currentBest = fastestTime;
          if (!currentBest || playTime < currentBest) {
            const newBest = playTime;
            setFastestTime(newBest);
            localStorage.setItem('kitchenFireFastestTime', newBest.toString());
          }
        }
      }
      return newFlames;
    });
  }, [extinguished, audioReady, fastestTime, playTime, sounds]);

  return {
    flames,
    extinguished,
    playTime,
    alertShown,
    fastestTime,
    reducedMotion,
    handleSprayWater,
  };
};
