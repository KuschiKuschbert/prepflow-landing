import { type NavigationUsageLog } from '../schema';

const PATTERN_CHANGE_THRESHOLD = 0.2; // 20% difference triggers re-optimization
const DAYS_FOR_COMPARISON = 7; // Compare last 7 days vs previous 7 days

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
