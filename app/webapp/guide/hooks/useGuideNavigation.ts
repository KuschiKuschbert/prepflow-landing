/**
 * Hook for managing guide navigation state.
 * Handles step navigation, progress tracking, and guide selection.
 */

import { useState, useCallback } from 'react';
import type { Guide, GuideStep } from '../data/guide-types';

interface UseGuideNavigationReturn {
  currentGuide: Guide | null;
  currentStepIndex: number;
  currentStep: GuideStep | null;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number; // 0-100
  setGuide: (guide: Guide | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  reset: () => void;
}

export function useGuideNavigation(): UseGuideNavigationReturn {
  const [currentGuide, setCurrentGuide] = useState<Guide | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = currentGuide?.steps[currentStepIndex] || null;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentGuide ? currentStepIndex === currentGuide.steps.length - 1 : true;
  const progress = currentGuide
    ? Math.round(((currentStepIndex + 1) / currentGuide.steps.length) * 100)
    : 0;

  const setGuide = useCallback((guide: Guide | null) => {
    setCurrentGuide(guide);
    setCurrentStepIndex(0);
  }, []);

  const nextStep = useCallback(() => {
    if (currentGuide && !isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentGuide, isLastStep]);

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [isFirstStep]);

  const goToStep = useCallback(
    (index: number) => {
      if (currentGuide && index >= 0 && index < currentGuide.steps.length) {
        setCurrentStepIndex(index);
      }
    },
    [currentGuide],
  );

  const reset = useCallback(() => {
    setCurrentGuide(null);
    setCurrentStepIndex(0);
  }, []);

  return {
    currentGuide,
    currentStepIndex,
    currentStep,
    isFirstStep,
    isLastStep,
    progress,
    setGuide,
    nextStep,
    prevStep,
    goToStep,
    reset,
  };
}


