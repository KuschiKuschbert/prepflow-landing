'use client';

/**
 * Hook for managing Train Off Track game logic
 * Light, non-distracting game mechanics - simple click interaction
 */

import { useState, useEffect, useCallback } from 'react';
import { useTrainOffTrackSounds } from './useTrainOffTrackSounds';
import { throwConfetti } from '@/hooks/useConfetti';

export const useTrainOffTrackGame = () => {
  // Initialize with fixed value to prevent hydration mismatch
  // Random value will be set on client after mount
  const [fixesNeeded, setFixesNeeded] = useState(4);
  const [fixed, setFixed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const sounds = useTrainOffTrackSounds();

  // Set random fixes needed value after mount to prevent hydration mismatch
  useEffect(() => {
    setFixesNeeded(Math.floor(Math.random() * 3) + 3); // 3-5 fixes needed
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sounds.cleanup();
    };
  }, [sounds]);

  // Handle fix track click
  const handleFixTrack = useCallback(() => {
    if (fixed) return;

    if (!audioReady) {
      const initialized = sounds.initAudio();
      setAudioReady(initialized);
    }

    sounds.playTrainWhistleSound();

    setFixesNeeded(prev => {
      const newFixes = prev - 1;
      if (newFixes === 0) {
        setFixed(true);
        sounds.playSuccessSound();

        // Trigger confetti
        throwConfetti(1.5);
      }
      return newFixes;
    });
  }, [fixed, audioReady, sounds]);

  return {
    fixesNeeded,
    fixed,
    reducedMotion,
    handleFixTrack,
  };
};
