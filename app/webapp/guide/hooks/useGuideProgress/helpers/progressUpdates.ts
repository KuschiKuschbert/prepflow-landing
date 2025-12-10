/**
 * Helper functions for updating guide progress
 */

import type { GuideProgress } from '../types';

export function createProgressUpdate(
  guideId: string,
  stepIndex: number,
  existing: GuideProgress | undefined,
): GuideProgress {
  return {
    guideId,
    currentStepIndex: stepIndex,
    completedSteps: existing?.completedSteps || [],
    lastViewedAt: Date.now(),
  };
}

export function createStepCompleteUpdate(
  guideId: string,
  stepIndex: number,
  existing: GuideProgress | undefined,
): GuideProgress {
  const completedSteps = existing?.completedSteps || [];
  if (!completedSteps.includes(stepIndex)) {
    completedSteps.push(stepIndex);
  }
  return {
    guideId,
    currentStepIndex: existing?.currentStepIndex || stepIndex,
    completedSteps,
    lastViewedAt: Date.now(),
  };
}

export function createGuideCompleteUpdate(
  guideId: string,
  existing: GuideProgress | undefined,
): GuideProgress {
  return {
    guideId,
    currentStepIndex: existing?.currentStepIndex || 0,
    completedSteps: existing?.completedSteps || [],
    completedAt: Date.now(),
    lastViewedAt: Date.now(),
  };
}



