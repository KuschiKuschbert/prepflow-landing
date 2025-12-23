/**
 * Main guide page.
 * Orchestrates guide selection, navigation, and viewing.
 */

'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { GuideNavigation } from './components/GuideNavigation';
import { GuideViewer } from './components/GuideViewer';
import { useGuideNavigation } from './hooks/useGuideNavigation';
import { useGuideProgress } from './hooks/useGuideProgress';
import type { Guide } from './data/guide-types';

export default function GuidePage() {
  const {
    currentGuide,
    currentStepIndex,
    currentStep,
    isFirstStep,
    isLastStep,
    progress,
    setGuide,
    nextStep,
    prevStep,
    reset,
  } = useGuideNavigation();

  const { updateProgress, markStepComplete, markGuideComplete } = useGuideProgress();

  // Time tracking refs
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

  const handleSelectGuide = (guide: Guide) => {
    setGuide(guide);
    trackEvent(
      'guide_view',
      'engagement',
      `${guide.id}_${guide.category}_${guide.difficulty || 'unknown'}`,
      guide.steps.length,
    );
  };

  const handleNext = () => {
    if (currentGuide && currentStep) {
      markStepComplete(currentGuide.id, currentStepIndex);
      trackEvent('guide_step_next', 'engagement', currentStep.id, currentStepIndex);
    }
    nextStep();
  };

  const handlePrevious = () => {
    if (currentGuide && currentStep) {
      trackEvent('guide_step_prev', 'engagement', currentStep.id, currentStepIndex);
    }
    prevStep();
  };

  const handleComplete = () => {
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

  const handleBackToList = () => {
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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="desktop:px-8 mx-auto max-w-[1400px] large-desktop:max-w-[1400px] xl:max-w-[1400px] 2xl:max-w-[1600px] px-4 py-8">
        {!currentGuide ? (
          // Guide selection view
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-fluid-3xl font-bold text-[var(--foreground)]">PrepFlow Guides</h1>
              <p className="text-fluid-base text-[var(--foreground-muted)]">
                Learn how to use PrepFlow with step-by-step guides, interactive demos, and visual
                walkthroughs.
              </p>
            </div>
            <GuideNavigation onSelectGuide={handleSelectGuide} />
          </div>
        ) : (
          // Guide viewer
          <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={handleBackToList}
                  className="mb-2 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--primary)]"
                  aria-label="Back to guide list"
                >
                  ← Back to Guides
                </button>
                <h1 className="text-fluid-2xl font-bold text-[var(--foreground)]">{currentGuide.title}</h1>
                <p className="mt-1 text-sm text-[var(--foreground-muted)]">{currentGuide.description}</p>
              </div>
              <div className="text-right text-sm text-[var(--foreground-subtle)]">
                Step {currentStepIndex + 1} of {currentGuide.steps.length}
              </div>
            </div>

            {/* Step indicator dots */}
            <div className="flex gap-2">
              {currentGuide.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index === currentStepIndex
                      ? 'bg-[var(--primary)]'
                      : index < currentStepIndex
                        ? 'bg-[var(--primary)]/50'
                        : 'bg-[var(--muted)]'
                  }`}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                />
              ))}
            </div>

            {/* Guide viewer */}
            {currentStep && (
              <GuideViewer
                step={currentStep}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onComplete={handleComplete}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                progress={progress}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
