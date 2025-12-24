/**
 * Confetti Hook
 *
 * Provides confetti celebration functionality.
 */

import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export const throwConfetti = (intensity: number = 1): void => {
  confetti({
    particleCount: Math.floor(100 * intensity),
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4CAF50', '#E74C3C', '#F1C40F', '#3498DB'],
  });
};
const MILESTONE_THRESHOLDS = [10, 25, 50, 100];
export const isMilestone = (value: number): boolean => MILESTONE_THRESHOLDS.includes(value);
export const useConfetti = () => {
  const triggerConfetti = useCallback((intensity: number = 1) => {
    throwConfetti(intensity);
  }, []);

  return { triggerConfetti, isMilestone };
};
