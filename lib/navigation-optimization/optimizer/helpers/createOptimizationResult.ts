import type { NavigationItemConfig } from '../../types';
import { type NavigationPattern, type OptimizationResult } from '../../schema';

/**
 * Create optimization result from patterns.
 *
 * @param {NavigationItemConfig[]} items - Original items
 * @param {NavigationPattern[]} patterns - Usage patterns
 * @param {string[]} selectedSections - Sections to optimize
 * @param {number} patternVersion - Current pattern version
 * @returns {OptimizationResult} Optimization result
 */
export function createOptimizationResult(
  items: NavigationItemConfig[],
  patterns: NavigationPattern[],
  selectedSections: string[],
  patternVersion: number,
): OptimizationResult {
  // Create a map of href to pattern score
  const patternMap = new Map<string, number>();
  patterns.forEach(pattern => {
    patternMap.set(pattern.href, pattern.score);
  });

  // Group items by category
  const itemsByCategory = new Map<
    string,
    Array<NavigationItemConfig & { originalIndex: number }>
  >();
  items.forEach((item, index) => {
    const category = item.category || 'other';
    if (!itemsByCategory.has(category)) {
      itemsByCategory.set(category, []);
    }
    itemsByCategory.get(category)!.push({ ...item, originalIndex: index });
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
        const originalIndex = item.originalIndex;
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
        const originalIndex = item.originalIndex;
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
