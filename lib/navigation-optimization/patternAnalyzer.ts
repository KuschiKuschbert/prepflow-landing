// PrepFlow Adaptive Navigation Optimization - Pattern Analyzer

import { type NavigationUsageLog, type NavigationPattern } from './schema';
import { getUsageLogs } from './localStorage';

const PATTERN_CHANGE_THRESHOLD = 0.2; // 20% difference triggers re-optimization
const DAYS_FOR_COMPARISON = 7; // Compare last 7 days vs previous 7 days

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

/**
 * Calculate optimization score for a pattern.
 *
 * @param {NavigationPattern} pattern - Pattern to score
 * @param {number} currentHour - Current hour of day
 * @returns {number} Score (higher is better)
 */
function calculateScore(pattern: NavigationPattern, currentHour: number): number {
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

/**
 * Detect if usage patterns have changed significantly.
 *
 * @param {NavigationUsageLog[]} allLogs - All usage logs
 * @returns {boolean} True if patterns have changed significantly
 */
export function detectPatternChange(allLogs: NavigationUsageLog[]): boolean {
  if (allLogs.length < 10) {
    return false; // Not enough data to detect changes
  }

  const now = Date.now();
  const sevenDaysAgo = now - DAYS_FOR_COMPARISON * 24 * 60 * 60 * 1000;
  const fourteenDaysAgo = now - DAYS_FOR_COMPARISON * 2 * 24 * 60 * 60 * 1000;

  // Get logs from last 7 days
  const recentLogs = allLogs.filter(log => log.timestamp >= sevenDaysAgo && log.timestamp < now);

  // Get logs from previous 7 days
  const previousLogs = allLogs.filter(
    log => log.timestamp >= fourteenDaysAgo && log.timestamp < sevenDaysAgo,
  );

  if (recentLogs.length === 0 || previousLogs.length === 0) {
    return false; // Not enough data for comparison
  }

  // Group by href and calculate usage frequency
  const recentUsage = new Map<string, number>();
  const previousUsage = new Map<string, number>();

  recentLogs.forEach(log => {
    recentUsage.set(log.href, (recentUsage.get(log.href) || 0) + 1);
  });

  previousLogs.forEach(log => {
    previousUsage.set(log.href, (previousUsage.get(log.href) || 0) + 1);
  });

  // Check for significant changes
  const allHrefs = new Set([...recentUsage.keys(), ...previousUsage.keys()]);
  let significantChanges = 0;

  allHrefs.forEach(href => {
    const recent = recentUsage.get(href) || 0;
    const previous = previousUsage.get(href) || 0;
    const total = recent + previous;

    if (total === 0) {
      return;
    }

    const change = Math.abs(recent - previous) / total;
    if (change > PATTERN_CHANGE_THRESHOLD) {
      significantChanges++;
    }
  });

  // If more than 30% of items have significant changes, patterns have changed
  return significantChanges / allHrefs.size > 0.3;
}

/**
 * Get usage patterns for current time from localStorage and server.
 *
 * @param {number} currentHour - Current hour of day (0-23)
 * @param {number} currentDayOfWeek - Current day of week (0-6, optional)
 * @returns {Promise<NavigationPattern[]>} Array of patterns
 */
export async function getUsagePatterns(
  currentHour: number,
  currentDayOfWeek?: number,
): Promise<NavigationPattern[]> {
  // Get logs from localStorage (recent data)
  const localLogs = getUsageLogs(30);

  // Try to fetch from server (non-blocking, with timeout)
  let serverLogs: NavigationUsageLog[] = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5 second timeout

    const response = await fetch('/api/navigation-optimization/patterns', {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      serverLogs = data.logs || [];
    }
  } catch {
    // Ignore errors (timeout, network, etc.), use local logs only
  }

  // Merge logs (deduplicate by timestamp and href)
  const logMap = new Map<string, NavigationUsageLog>();
  localLogs.forEach(log => {
    const key = `${log.href}-${log.timestamp}`;
    logMap.set(key, log);
  });
  serverLogs.forEach(log => {
    const key = `${log.href}-${log.timestamp}`;
    logMap.set(key, log); // Server logs override local logs
  });

  const allLogs = Array.from(logMap.values());

  // Analyze patterns
  return analyzePatterns(allLogs, currentHour, currentDayOfWeek);
}
