/**
 * Confetti Hook
 *
 * Provides confetti celebration functionality with sound effects.
 */

import { useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';
import { isArcadeMuted } from '@/lib/arcadeMute';

let popSound: Howl | null = null;

/**
 * Initialize pop sound (lazy load)
 */
const initPopSound = (): Howl | null => {
  if (typeof window === 'undefined') return null;

  if (!popSound) {
    try {
      popSound = new Howl({
        src: ['/sfx/pop.mp3'],
        volume: 0.4,
        preload: false,
      });
    } catch (error) {
      console.warn('Failed to load pop sound, using fallback');
      // Fallback: create simple beep using Web Audio API
      popSound = null;
    }
  }

  return popSound;
};

/**
 * Play pop sound (with mute check)
 */
const playPopSound = (): void => {
  if (isArcadeMuted()) return;

  const sound = initPopSound();
  if (sound) {
    try {
      sound.play();
    } catch (error) {
      // Fallback: create simple beep
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (e) {
        // Silently fail if audio is not available
      }
    }
  }
};

/**
 * Throw confetti with optional intensity
 */
export const throwConfetti = (intensity: number = 1): void => {
  confetti({
    particleCount: Math.floor(100 * intensity),
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4CAF50', '#E74C3C', '#F1C40F', '#3498DB'],
  });

  playPopSound();
};

/**
 * Check if value is a milestone threshold
 */
const MILESTONE_THRESHOLDS = [10, 25, 50, 100];

export const isMilestone = (value: number): boolean => {
  return MILESTONE_THRESHOLDS.includes(value);
};

/**
 * React hook for confetti functionality
 */
export const useConfetti = () => {
  const triggerConfetti = useCallback((intensity: number = 1) => {
    throwConfetti(intensity);
  }, []);

  return { triggerConfetti, isMilestone };
};
