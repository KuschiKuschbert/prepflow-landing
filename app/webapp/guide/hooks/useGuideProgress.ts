/**
 * Hook for tracking user progress through guides.
 * Persists progress to localStorage and provides completion tracking.
 */

import { useEffect, useState, useCallback } from 'react';
import type { Guide } from '../data/guide-types';

interface GuideProgress {
  guideId: string;
  currentStepIndex: number;
  completedSteps: number[];
  completedAt?: number;
  lastViewedAt: number;
}

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

const STORAGE_KEY = 'prepflow_guide_progress';

function loadProgress(): Record<string, GuideProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, GuideProgress>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage errors
  }
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
    setProgress(prev => {
      const existing = prev[guideId];
      return {
        ...prev,
        [guideId]: {
          guideId,
          currentStepIndex: stepIndex,
          completedSteps: existing?.completedSteps || [],
          lastViewedAt: Date.now(),
        },
      };
    });
  }, []);

  const markStepComplete = useCallback((guideId: string, stepIndex: number) => {
    setProgress(prev => {
      const existing = prev[guideId];
      const completedSteps = existing?.completedSteps || [];
      if (!completedSteps.includes(stepIndex)) {
        completedSteps.push(stepIndex);
      }
      return {
        ...prev,
        [guideId]: {
          guideId,
          currentStepIndex: existing?.currentStepIndex || stepIndex,
          completedSteps,
          lastViewedAt: Date.now(),
        },
      };
    });
  }, []);

  const markGuideComplete = useCallback((guideId: string) => {
    setProgress(prev => {
      const existing = prev[guideId];
      return {
        ...prev,
        [guideId]: {
          guideId,
          currentStepIndex: existing?.currentStepIndex || 0,
          completedSteps: existing?.completedSteps || [],
          completedAt: Date.now(),
          lastViewedAt: Date.now(),
        },
      };
    });
  }, []);

  const isStepComplete = useCallback(
    (guideId: string, stepIndex: number): boolean => {
      const guideProgress = progress[guideId];
      return guideProgress?.completedSteps.includes(stepIndex) || false;
    },
    [progress],
  );

  const isGuideComplete = useCallback(
    (guideId: string): boolean => {
      const guideProgress = progress[guideId];
      return guideProgress?.completedAt !== undefined;
    },
    [progress],
  );

  const getCompletionRate = useCallback(
    (guideId: string): number => {
      const guideProgress = progress[guideId];
      if (!guideProgress) return 0;
      // This will be calculated based on total steps when we have the guide data
      return guideProgress.completedSteps.length;
    },
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
