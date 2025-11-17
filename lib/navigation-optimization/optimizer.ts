// PrepFlow Adaptive Navigation Optimization - Optimization Engine

import { type NavigationItemConfig } from '@/app/webapp/components/navigation/nav-items';
import { type OptimizationResult } from './schema';
import { type NavigationPattern } from './schema';
import { getCachedOptimization, cacheOptimization } from './localStorage';
import { getUsagePatterns, detectPatternChange } from './patternAnalyzer';
import { getUsageLogs } from './localStorage';
import { getAdaptiveNavSettings } from './store';

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
    const optimizationResult = createOptimizationResult(items, patterns, selectedSections);

    // Cache the result
    cacheOptimization(optimizationResult);

    // Apply optimization
    return applyOptimization(items, optimizationResult, selectedSections);
  } catch (error) {
    // On any error, return original items
    return items;
  }
}

/**
 * Create optimization result from patterns.
 *
 * @param {NavigationItemConfig[]} items - Original items
 * @param {NavigationPattern[]} patterns - Usage patterns
 * @param {string[]} selectedSections - Sections to optimize
 * @returns {OptimizationResult} Optimization result
 */
function createOptimizationResult(
  items: NavigationItemConfig[],
  patterns: NavigationPattern[],
  selectedSections: string[],
): OptimizationResult {
  // Create a map of href to pattern score
  const patternMap = new Map<string, number>();
  patterns.forEach(pattern => {
    patternMap.set(pattern.href, pattern.score);
  });

  // Group items by category
  const itemsByCategory = new Map<string, NavigationItemConfig[]>();
  items.forEach((item, index) => {
    const category = item.category || 'other';
    if (!itemsByCategory.has(category)) {
      itemsByCategory.set(category, []);
    }
    itemsByCategory.get(category)!.push({ ...item, originalIndex: index } as any);
  });

  // Optimize items within selected sections
  const optimizedItems: Array<{
    href: string;
    originalIndex: number;
    optimizedIndex: number;
    score: number;
  }> = [];

  let currentIndex = 0;

  itemsByCategory.forEach((categoryItems, category) => {
    if (selectedSections.includes(category)) {
      // Sort items in this category by pattern score
      const sortedItems = [...categoryItems].sort((a, b) => {
        const scoreA = patternMap.get(a.href) || 0;
        const scoreB = patternMap.get(b.href) || 0;
        return scoreB - scoreA; // Higher score first
      });

      sortedItems.forEach((item, sortedIndex) => {
        const originalIndex = (item as any).originalIndex;
        const score = patternMap.get(item.href) || 0;
        optimizedItems.push({
          href: item.href,
          originalIndex,
          optimizedIndex: currentIndex + sortedIndex,
          score,
        });
      });

      currentIndex += sortedItems.length;
    } else {
      // Keep original order for non-selected sections
      categoryItems.forEach((item, categoryIndex) => {
        const originalIndex = (item as any).originalIndex;
        optimizedItems.push({
          href: item.href,
          originalIndex,
          optimizedIndex: currentIndex + categoryIndex,
          score: 0,
        });
      });

      currentIndex += categoryItems.length;
    }
  });

  return {
    items: optimizedItems,
    lastCalculated: Date.now(),
    patternVersion,
  };
}

/**
 * Apply optimization result to navigation items.
 *
 * @param {NavigationItemConfig[]} items - Original items
 * @param {OptimizationResult} result - Optimization result
 * @param {string[]} selectedSections - Sections to optimize
 * @returns {NavigationItemConfig[]} Optimized items
 */
function applyOptimization(
  items: NavigationItemConfig[],
  result: OptimizationResult,
  selectedSections: string[],
): NavigationItemConfig[] {
  // Create a map of href to item
  const itemMap = new Map<string, NavigationItemConfig>();
  items.forEach(item => {
    itemMap.set(item.href, item);
  });

  // Sort optimization items by optimized index
  const sortedOptimizations = [...result.items].sort((a, b) => a.optimizedIndex - b.optimizedIndex);

  // Build optimized array
  const optimized: NavigationItemConfig[] = [];
  sortedOptimizations.forEach(opt => {
    const item = itemMap.get(opt.href);
    if (item) {
      optimized.push(item);
    }
  });

  // Add any items not in optimization result (shouldn't happen, but safety check)
  items.forEach(item => {
    if (!optimized.find(opt => opt.href === item.href)) {
      optimized.push(item);
    }
  });

  return optimized;
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
