import { type NavigationUsageLog, type NavigationPattern } from '../schema';
import { calculateScore } from './scoring';

/**
 * Analyze usage patterns by time-of-day from usage logs.
 *
 * @param {NavigationUsageLog[]} logs - Usage logs to analyze
 * @param {number} currentHour - Current hour of day (0-23)
 * @param {number} currentDayOfWeek - Current day of week (0-6, optional)
 * @returns {NavigationPattern[]} Array of patterns with scores
 */
export function analyzePatterns(
  logs: NavigationUsageLog[],
  currentHour: number,
  currentDayOfWeek?: number,
): NavigationPattern[] {
  if (logs.length === 0) {
    return [];
  }

  // Group logs by href and hour
  const patternMap = new Map<string, NavigationPattern>();

  logs.forEach(log => {
    // Filter by current day of week if specified, otherwise use all days
    if (currentDayOfWeek !== undefined && log.dayOfWeek !== currentDayOfWeek) {
      return;
    }

    // Focus on logs around the current hour (±2 hours for context)
    const hourDiff = Math.abs(log.hourOfDay - currentHour);
    if (hourDiff > 2) {
      return; // Skip logs too far from current hour
    }

    const key = log.href;
    if (!patternMap.has(key)) {
      patternMap.set(key, {
        href: log.href,
        hourOfDay: log.hourOfDay,
        dayOfWeek: currentDayOfWeek,
        frequency: 0,
        averageTimeSpent: 0,
        returnFrequency: 0,
        score: 0,
      });
    }

    const pattern = patternMap.get(key)!;
    pattern.frequency += 1;

    if (log.timeSpent) {
      // Calculate running average
      const currentAvg = pattern.averageTimeSpent;
      const count = pattern.frequency;
      pattern.averageTimeSpent = (currentAvg * (count - 1) + log.timeSpent) / count;
    }

    if (log.returnFrequency) {
      // Use maximum return frequency seen
      pattern.returnFrequency = Math.max(pattern.returnFrequency, log.returnFrequency);
    }
  });

  // Calculate scores for each pattern
  const patterns = Array.from(patternMap.values());
  patterns.forEach(pattern => {
    pattern.score = calculateScore(pattern, currentHour);
  });

  // Sort by score (highest first)
  return patterns.sort((a, b) => b.score - a.score);
}
