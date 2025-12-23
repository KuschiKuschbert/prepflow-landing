// PrepFlow Adaptive Navigation Optimization - Optimization Engine

import { type NavigationItemConfig } from '@/app/webapp/components/navigation/nav-items';
import { type OptimizationResult } from './schema';
import { getCachedOptimization, cacheOptimization } from './localStorage';
import { getUsagePatterns, detectPatternChange } from './patternAnalyzer';
import { getUsageLogs } from './localStorage';
import { getAdaptiveNavSettings } from './store';
import { logger } from '@/lib/logger';
import { createOptimizationResult } from './optimizer/helpers/createOptimizationResult';
import { applyOptimization } from './optimizer/helpers/applyOptimization';

let patternVersion = 0;

/**
 * Optimize navigation items ordering based on usage patterns.
 *
 * @param {NavigationItemConfig[]} items - Original navigation items
 * @param {string[]} selectedSections - Sections to optimize
 * @returns {Promise<NavigationItemConfig[]>} Optimized navigation items
 */
export async function optimizeNavigationItems(
  items: NavigationItemConfig[],
  selectedSections: string[],
): Promise<NavigationItemConfig[]> {
  try {
    const settings = getAdaptiveNavSettings();
    if (!settings.enabled || selectedSections.length === 0) {
      return items; // Return original if optimization disabled or no sections selected
    }

    // Check cache first
    const cached = getCachedOptimization();
    if (cached && cached.patternVersion === patternVersion) {
      // Apply cached optimization
      return applyOptimization(items, cached, selectedSections);
    }

    // Check if patterns have changed
    const allLogs = getUsageLogs(30);
    const patternsChanged = detectPatternChange(allLogs);

    if (patternsChanged) {
      patternVersion++; // Increment version when patterns change
    }

    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentDayOfWeek = now.getDay();

    // Get usage patterns (with timeout)
    const patternsPromise = getUsagePatterns(currentHour, currentDayOfWeek);
    const timeoutPromise = new Promise<NavigationPattern[]>(resolve =>
      setTimeout(() => resolve([]), 2000),
    ); // 2 second timeout

    const patterns = await Promise.race([patternsPromise, timeoutPromise]);

    // If no patterns available, return original
    if (patterns.length === 0) {
      return items;
    }

    // Create optimization result
    const optimizationResult = createOptimizationResult(items, patterns, selectedSections, patternVersion);

    // Cache the result
    cacheOptimization(optimizationResult);

    // Apply optimization
    return applyOptimization(items, optimizationResult, selectedSections);
  } catch (error) {
    logger.error('[optimizer.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // On any error, return original items
    return items;
  }
}


/**
 * Reset optimization cache (useful for testing or manual reset).
 */
export function resetOptimizationCache(): void {
  patternVersion = 0;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('prepflow-nav-optimization-cache');
  }
}
