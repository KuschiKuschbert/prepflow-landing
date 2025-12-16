/**
 * Type definitions for guide progress
 */

export interface GuideProgress {
  guideId: string;
  currentStepIndex: number;
  completedSteps: number[];
  completedAt?: number;
  lastViewedAt: number;
}




