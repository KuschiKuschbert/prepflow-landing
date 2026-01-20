/**
 * Main guide page.
 * Orchestrates guide selection, navigation, and viewing.
 */

'use client';

import { GuideNavigation } from './components/GuideNavigation';
import { GuideViewer } from './components/GuideViewer';
import type { Guide } from './data/guide-types';
import { useGuideAnalytics } from './hooks/useGuideAnalytics';
import { useGuideNavigation } from './hooks/useGuideNavigation';
import { useGuideProgress } from './hooks/useGuideProgress';

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

  // Analytics tracking
  const { onSelectGuide, onNextStep, onPrevStep, onComplete, onBackToList } = useGuideAnalytics({
    currentGuide,
    currentStepIndex,
    currentStep,
    progress,
    markStepComplete,
    markGuideComplete,
    updateProgress,
  });

  const handleSelectGuide = (guide: Guide) => {
    setGuide(guide);
    onSelectGuide(guide);
  };

  const handleNext = () => {
    if (currentGuide && currentStepIndex !== undefined) {
      markStepComplete(currentGuide.id, currentStepIndex);
      onNextStep();
    }
    nextStep();
  };

  const handlePrevious = () => {
    onPrevStep();
    prevStep();
  };

  const handleComplete = () => {
    onComplete(reset, markGuideComplete);
  };

  const handleBackToList = () => {
    onBackToList(reset);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="desktop:px-8 large-desktop:max-w-[1400px] mx-auto max-w-[1400px] px-4 py-8 xl:max-w-[1400px] 2xl:max-w-[1600px]">
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
                <h1 className="text-fluid-2xl font-bold text-[var(--foreground)]">
                  {currentGuide.title}
                </h1>
                <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                  {currentGuide.description}
                </p>
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
