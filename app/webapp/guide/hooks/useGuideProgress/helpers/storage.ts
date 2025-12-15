/**
 * Helper functions for localStorage operations for guide progress
 */

import type { GuideProgress } from '../types';

const STORAGE_KEY = 'prepflow_guide_progress';

export function loadProgress(): Record<string, GuideProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: Record<string, GuideProgress>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage errors
  }
}
