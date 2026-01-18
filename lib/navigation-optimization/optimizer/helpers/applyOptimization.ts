import { type NavigationItemConfig } from '@/app/webapp/components/navigation/nav-items';
import { type OptimizationResult } from '../../schema';

/**
 * Apply optimization result to navigation items.
 *
 * @param {NavigationItemConfig[]} items - Original items
 * @param {OptimizationResult} result - Optimization result
 * @param {string[]} selectedSections - Sections to optimize
 * @returns {NavigationItemConfig[]} Optimized items
 */
export function applyOptimization(
  items: NavigationItemConfig[],
  result: OptimizationResult,
  _selectedSections: string[],
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
