import { trackEvent } from '@/lib/analytics';
import { MutableRefObject } from 'react';
import type { Guide, GuideStep } from '../data/guide-types';

interface UseGuideEventHandlersProps {
  currentGuide: Guide | null;
  currentStepIndex: number | undefined;
  currentStep: GuideStep | null;
  guideStartTimeRef: MutableRefObject<number | null>;
  stepStartTimeRef: MutableRefObject<number | null>;
  previousStepIndexRef: MutableRefObject<number | null>;
}

export function useGuideEventHandlers({
  currentGuide,
  currentStepIndex,
  currentStep,
  guideStartTimeRef,
  stepStartTimeRef,
  previousStepIndexRef,
}: UseGuideEventHandlersProps) {
  const onSelectGuide = (guide: Guide) => {
    trackEvent(
      'guide_view',
      'engagement',
      `${guide.id}_${guide.category}_${guide.difficulty || 'unknown'}`,
      guide.steps.length,
    );
  };

  const onNextStep = () => {
    if (currentGuide && currentStep && currentStepIndex !== undefined) {
      trackEvent('guide_step_next', 'engagement', currentStep.id, currentStepIndex);
    }
  };

  const onPrevStep = () => {
    if (currentGuide && currentStep && currentStepIndex !== undefined) {
      trackEvent('guide_step_prev', 'engagement', currentStep.id, currentStepIndex);
    }
  };

  const onComplete = (reset: () => void, markGuideComplete: (id: string) => void) => {
    if (currentGuide && guideStartTimeRef.current) {
      const totalTime = Math.round((Date.now() - guideStartTimeRef.current) / 1000); // seconds
      markGuideComplete(currentGuide.id);
      trackEvent(
        'guide_complete',
        'engagement',
        `${currentGuide.id}_${currentGuide.category}`,
        currentGuide.steps.length,
      );
      // Track completion time
      trackEvent('guide_completion_time', 'engagement', `${currentGuide.id}_complete`, totalTime);
      // Reset tracking
      guideStartTimeRef.current = null;
      stepStartTimeRef.current = null;
      previousStepIndexRef.current = null;
      reset();
    }
  };

  const onBackToList = (reset: () => void) => {
    // Track drop-off before resetting
    if (currentGuide && guideStartTimeRef.current) {
      const totalTime = Math.round((Date.now() - guideStartTimeRef.current) / 1000); // seconds
      trackEvent('guide_dropoff', 'engagement', `${currentGuide.id}_back_to_list`, totalTime);
      // Reset tracking
      guideStartTimeRef.current = null;
      stepStartTimeRef.current = null;
      previousStepIndexRef.current = null;
    }
    reset();
    trackEvent('guide_back_to_list', 'engagement');
  };

  return { onSelectGuide, onNextStep, onPrevStep, onComplete, onBackToList };
}
