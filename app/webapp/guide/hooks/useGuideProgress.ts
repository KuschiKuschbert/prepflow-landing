/**
 * Hook for tracking user progress through guides.
 * Persists progress to localStorage and provides completion tracking.
 */

import { useEffect, useState, useCallback } from 'react';
import { loadProgress, saveProgress } from './useGuideProgress/helpers/storage';
import {
  createProgressUpdate,
  createStepCompleteUpdate,
  createGuideCompleteUpdate,
} from './useGuideProgress/helpers/progressUpdates';
import type { GuideProgress } from './useGuideProgress/types';

interface UseGuideProgressReturn {
  getProgress: (guideId: string) => GuideProgress | null;
  updateProgress: (guideId: string, stepIndex: number) => void;
  markStepComplete: (guideId: string, stepIndex: number) => void;
  markGuideComplete: (guideId: string) => void;
  isStepComplete: (guideId: string, stepIndex: number) => boolean;
  isGuideComplete: (guideId: string) => boolean;
  getCompletionRate: (guideId: string) => number;
  clearProgress: (guideId: string) => void;
}

export function useGuideProgress(): UseGuideProgressReturn {
  const [progress, setProgress] = useState<Record<string, GuideProgress>>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const getProgress = useCallback(
    (guideId: string): GuideProgress | null => {
      return progress[guideId] || null;
    },
    [progress],
  );

  const updateProgress = useCallback((guideId: string, stepIndex: number) => {
    setProgress(prev => ({
      ...prev,
      [guideId]: createProgressUpdate(guideId, stepIndex, prev[guideId]),
    }));
  }, []);

  const markStepComplete = useCallback((guideId: string, stepIndex: number) => {
    setProgress(prev => ({
      ...prev,
      [guideId]: createStepCompleteUpdate(guideId, stepIndex, prev[guideId]),
    }));
  }, []);

  const markGuideComplete = useCallback((guideId: string) => {
    setProgress(prev => ({
      ...prev,
      [guideId]: createGuideCompleteUpdate(guideId, prev[guideId]),
    }));
  }, []);

  const isStepComplete = useCallback(
    (guideId: string, stepIndex: number): boolean =>
      progress[guideId]?.completedSteps.includes(stepIndex) || false,
    [progress],
  );

  const isGuideComplete = useCallback(
    (guideId: string): boolean => progress[guideId]?.completedAt !== undefined,
    [progress],
  );

  const getCompletionRate = useCallback(
    (guideId: string): number => progress[guideId]?.completedSteps.length || 0,
    [progress],
  );

  const clearProgress = useCallback((guideId: string) => {
    setProgress(prev => {
      const updated = { ...prev };
      delete updated[guideId];
      return updated;
    });
  }, []);

  return {
    getProgress,
    updateProgress,
    markStepComplete,
    markGuideComplete,
    isStepComplete,
    isGuideComplete,
    getCompletionRate,
    clearProgress,
  };
}



