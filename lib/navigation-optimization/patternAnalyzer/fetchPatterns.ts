import { type NavigationUsageLog, type NavigationPattern } from '../schema';
import { getUsageLogs } from '../localStorage';
import { analyzePatterns } from './patternAnalysis';

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
