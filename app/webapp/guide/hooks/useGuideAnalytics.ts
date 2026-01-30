import type { Guide, GuideStep } from '../data/guide-types';
import { useGuideEngagementTracking } from './useGuideEngagementTracking';
import { useGuideEventHandlers } from './useGuideEventHandlers';

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
  // Initialize tracking and get refs
  const { guideStartTimeRef, stepStartTimeRef, previousStepIndexRef } = useGuideEngagementTracking({
    currentGuide,
    currentStepIndex,
    currentStep,
    progress,
    updateProgress,
  });

  // Get event handlers (passing refs for timing logic)
  const { onSelectGuide, onNextStep, onPrevStep, onComplete, onBackToList } = useGuideEventHandlers(
    {
      currentGuide,
      currentStepIndex,
      currentStep,
      guideStartTimeRef,
      stepStartTimeRef,
      previousStepIndexRef,
    },
  );

  return { onSelectGuide, onNextStep, onPrevStep, onComplete, onBackToList };
}
