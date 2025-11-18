import { type NavigationPattern } from '../schema';

/**
 * Calculate optimization score for a pattern.
 *
 * @param {NavigationPattern} pattern - Pattern to score
 * @param {number} currentHour - Current hour of day
 * @returns {number} Score (higher is better)
 */
export function calculateScore(pattern: NavigationPattern, currentHour: number): number {
  // Frequency score (0-40 points)
  // More frequent usage at this time = higher score
  const frequencyScore = Math.min(pattern.frequency * 4, 40);

  // Recency score (0-20 points)
  // Closer to current hour = higher score
  const hourDiff = Math.abs(pattern.hourOfDay - currentHour);
  const recencyScore = Math.max(0, 20 - hourDiff * 5);

  // Time spent score (0-20 points)
  // More time spent = higher score (capped at 5 minutes = 300000ms)
  const timeSpentScore = Math.min((pattern.averageTimeSpent / 300000) * 20, 20);

  // Return frequency score (0-20 points)
  // Higher return frequency = higher score
  const returnFrequencyScore = Math.min(pattern.returnFrequency * 3, 20);

  return frequencyScore + recencyScore + timeSpentScore + returnFrequencyScore;
}
