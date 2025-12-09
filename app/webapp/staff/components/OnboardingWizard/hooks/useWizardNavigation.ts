import { useCallback } from 'react';
import type { WizardStep } from '../types';

interface UseWizardNavigationProps {
  currentStep: WizardStep;
  totalSteps: number;
  setCurrentStep: (step: WizardStep) => void;
}

/**
 * Hook for wizard navigation (next/previous)
 */
export function useWizardNavigation({
  currentStep,
  totalSteps,
  setCurrentStep,
}: UseWizardNavigationProps) {
  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  }, [currentStep, totalSteps, setCurrentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  }, [currentStep, setCurrentStep]);

  return {
    handleNext,
    handlePrevious,
  };
}
