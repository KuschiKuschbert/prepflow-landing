import { trackEvent } from '@/lib/analytics';
import { useEffect, useRef } from 'react';
import type { Guide, GuideStep } from '../data/guide-types';

interface UseGuideEngagementTrackingProps {
  currentGuide: Guide | null;
  currentStepIndex: number | undefined;
  currentStep: GuideStep | null;
  progress: number;
  updateProgress: (guideId: string, stepIndex: number) => void;
}

export function useGuideEngagementTracking({
  currentGuide,
  currentStepIndex,
  currentStep,
  progress,
  updateProgress,
}: UseGuideEngagementTrackingProps) {
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

  return { guideStartTimeRef, stepStartTimeRef, previousStepIndexRef };
}
