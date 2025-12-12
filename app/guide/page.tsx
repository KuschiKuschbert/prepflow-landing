/**
 * Public guide page for landing page visitors.
 * Shows a subset of guides and prompts sign-in for full access.
 */

'use client';

import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { GuideNavigation } from '../webapp/guide/components/GuideNavigation';
import { GuideViewer } from '../webapp/guide/components/GuideViewer';
import { useGuideNavigation } from '../webapp/guide/hooks/useGuideNavigation';
import { useGuideProgress } from '../webapp/guide/hooks/useGuideProgress';
import { getAllGuides, getGuidesByCategory } from '../webapp/guide/data/guides';
import type { Guide } from '../webapp/guide/data/guide-types';

export default function PublicGuidePage() {
  const { user } = useUser();
  const isAuthenticated = !!user;

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

  // Get public guides (onboarding only for non-authenticated users)
  const publicGuides = isAuthenticated ? getAllGuides() : getGuidesByCategory('onboarding');

  // Track progress when step changes
  useEffect(() => {
    if (currentGuide && currentStepIndex !== undefined) {
      updateProgress(currentGuide.id, currentStepIndex);
    }
  }, [currentGuide, currentStepIndex, updateProgress]);

  const handleSelectGuide = (guide: Guide) => {
    setGuide(guide);
    trackEvent('guide_view', 'engagement', guide.id);
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
    if (currentGuide) {
      markGuideComplete(currentGuide.id);
      trackEvent('guide_complete', 'engagement', currentGuide.id);
      reset();
    }
  };

  const handleBackToList = () => {
    reset();
    trackEvent('guide_back_to_list', 'engagement');
  };

  const handleSignIn = () => {
    trackEvent('guide_sign_in_prompt', 'engagement');
    window.location.href = '/api/auth/login?returnTo=/webapp/guide';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="desktop:px-8 mx-auto max-w-7xl px-4 py-8">
        {!currentGuide ? (
          // Guide selection view
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-fluid-3xl font-bold text-white">PrepFlow Guides</h1>
                <p className="text-fluid-base text-gray-400">
                  Learn how to use PrepFlow with step-by-step guides, interactive demos, and visual
                  walkthroughs.
                </p>
              </div>

              {/* Sign-in prompt for non-authenticated users */}
              {!isAuthenticated && (
                <div className="rounded-2xl border border-[#29E7CD]/30 bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/10 p-6">
                  <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Get Full Access to All Guides
                      </h2>
                      <p className="mt-1 text-sm text-gray-300">
                        Sign in to access workflow guides, reference documentation, and advanced
                        features.
                      </p>
                    </div>
                    <button
                      onClick={handleSignIn}
                      className="shrink-0 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-black transition-all hover:shadow-lg"
                    >
                      Sign In for Full Access
                    </button>
                  </div>
                </div>
              )}

              {/* Link to webapp guide for authenticated users */}
              {isAuthenticated && (
                <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
                  <Link
                    href="/webapp/guide"
                    className="text-sm text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
                  >
                    View all guides in the webapp →
                  </Link>
                </div>
              )}
            </div>

            <GuideNavigation onSelectGuide={handleSelectGuide} guides={publicGuides} />
          </div>
        ) : (
          // Guide viewer
          <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={handleBackToList}
                  className="mb-2 text-sm text-gray-400 transition-colors hover:text-[#29E7CD]"
                  aria-label="Back to guide list"
                >
                  ← Back to Guides
                </button>
                <h1 className="text-fluid-2xl font-bold text-white">{currentGuide.title}</h1>
                <p className="mt-1 text-sm text-gray-400">{currentGuide.description}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
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
                      ? 'bg-[#29E7CD]'
                      : index < currentStepIndex
                        ? 'bg-[#29E7CD]/50'
                        : 'bg-[#2a2a2a]'
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
