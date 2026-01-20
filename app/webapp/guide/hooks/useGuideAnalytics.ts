import { trackEvent } from '@/lib/analytics';
import { useEffect, useRef } from 'react';
import type { Guide, GuideStep } from '../data/guide-types';

interface UseGuideAnalyticsProps {
  currentGuide: Guide | null;
  currentStepIndex: number | undefined;
  currentStep: GuideStep | null;
  progress: number;
  markStepComplete: (guideId: string, stepIndex: number) => void;
  markGuideComplete: (guideId: string) => void;
  updateProgress: (guideId: string, stepIndex: number) => void;
}

export function useGuideAnalytics({
  currentGuide,
  currentStepIndex,
  currentStep,
  progress,
  updateProgress,
}: UseGuideAnalyticsProps) {
  const guideStartTimeRef = useRef<number | null>(null);
  const stepStartTimeRef = useRef<number | null>(null);
  const previousStepIndexRef = useRef<number | null>(null);

  // Track progress when step changes
  useEffect(() => {
    if (currentGuide && currentStepIndex !== undefined) {
      updateProgress(currentGuide.id, currentStepIndex);
    }
  }, [currentGuide, currentStepIndex, updateProgress]);

  // Track guide start time
  useEffect(() => {
    if (currentGuide && !guideStartTimeRef.current) {
      guideStartTimeRef.current = Date.now();
      trackEvent('guide_start', 'engagement', currentGuide.id, currentGuide.steps.length);
    }
  }, [currentGuide]);

  // Track step time spent and drop-off
  useEffect(() => {
    if (!currentGuide || currentStepIndex === undefined) return;

    // Track time spent on previous step
    if (stepStartTimeRef.current && previousStepIndexRef.current !== null) {
      const timeSpent = Math.round((Date.now() - stepStartTimeRef.current) / 1000); // seconds
      const previousStep = currentGuide.steps[previousStepIndexRef.current];
      if (previousStep) {
        trackEvent(
          'guide_step_time',
          'engagement',
          `${previousStep.id}_${previousStep.format}`,
          timeSpent,
        );
      }
    }

    // Track drop-off if user goes back or leaves
    if (previousStepIndexRef.current !== null && currentStepIndex < previousStepIndexRef.current) {
      // User went back - track as potential drop-off point
      const dropOffStep = currentGuide.steps[previousStepIndexRef.current];
      if (dropOffStep) {
        trackEvent(
          'guide_dropoff',
          'engagement',
          `${currentGuide.id}_step_${previousStepIndexRef.current}`,
          previousStepIndexRef.current,
        );
      }
    }

    // Start tracking time for current step
    stepStartTimeRef.current = Date.now();
    previousStepIndexRef.current = currentStepIndex;

    // Track format preferences when step changes
    if (currentStep) {
      trackEvent(
        'guide_format_view',
        'engagement',
        `${currentStep.format}_${currentGuide.id}_${currentStep.id}`,
        currentStepIndex,
      );
    }
  }, [currentStep, currentGuide, currentStepIndex]);

  // Track total guide time and drop-off when component unmounts or guide changes
  useEffect(() => {
    return () => {
      if (currentGuide && guideStartTimeRef.current) {
        const totalTime = Math.round((Date.now() - guideStartTimeRef.current) / 1000); // seconds
        const isComplete = progress === 100;

        if (!isComplete) {
          // Track drop-off with total time spent
          trackEvent('guide_dropoff', 'engagement', `${currentGuide.id}_incomplete`, totalTime);
        }

        // Track total time spent (whether complete or not)
        trackEvent(
          'guide_time_spent',
          'engagement',
          `${currentGuide.id}_${isComplete ? 'complete' : 'incomplete'}`,
          totalTime,
        );

        // Reset tracking
        guideStartTimeRef.current = null;
        stepStartTimeRef.current = null;
        previousStepIndexRef.current = null;
      }
    };
  }, [currentGuide, progress]);

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
