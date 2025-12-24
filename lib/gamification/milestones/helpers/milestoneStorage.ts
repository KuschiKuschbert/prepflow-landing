import { MILESTONE_STORAGE_KEY } from '../constants';

/**
 * Load shown milestones from storage
 */
export function loadShownMilestones(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const stored = localStorage.getItem(MILESTONE_STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    // Ignore errors
  }

  return new Set();
}

/**
 * Save shown milestone to storage
 */
export function saveShownMilestone(milestoneId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const shown = loadShownMilestones();
    shown.add(milestoneId);
    localStorage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify(Array.from(shown)));
  } catch {
    // Ignore errors
  }
}

/**
 * Check if milestone has been shown
 */
export function hasMilestoneBeenShown(milestoneId: string): boolean {
  return loadShownMilestones().has(milestoneId);
}
