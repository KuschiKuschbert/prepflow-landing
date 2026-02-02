/**
 * Calculate performance score based on menu item classes and sales volume
 *
 * Strategy: Weighted average where:
 * - Each menu item class has a base score (Chef's Kiss = 100, Hidden Gem = 75, etc.)
 * - Items with more sales contribute proportionally more to the overall score
 *
 * @param performanceItems - Array of performance items to calculate score from
 * @returns Performance score from 0-100
 */
import { PerformanceItem } from '@/lib/types/performance';

const MENU_ITEM_CLASS_SCORES: Record<string, number> = {
  "Chef's Kiss": 100, // High Profit + High Popularity
  'Hidden Gem': 75, // High Profit + Low Popularity
  'Bargain Bucket': 50, // Low Profit + High Popularity
  'Burnt Toast': 25, // Low Profit + Low Popularity
};

export function calculatePerformanceScore(performanceItems: PerformanceItem[]): number {
  // Handle empty array
  if (!performanceItems || performanceItems.length === 0) {
    return 0;
  }

  // Calculate total sales across all items
  const totalSales = performanceItems.reduce((sum, item) => {
    return sum + (item.number_sold || 0);
  }, 0);

  // If no sales data, return 0
  if (totalSales === 0) {
    return 0;
  }

  // Calculate weighted score
  let weightedScoreSum = 0;

  for (const item of performanceItems) {
    const menuItemClass = item.menu_item_class || '';
    const baseScore = MENU_ITEM_CLASS_SCORES[menuItemClass] || 0;
    const itemSales = item.number_sold || 0;

    // Calculate weight based on sales volume
    const weight = itemSales / totalSales;

    // Add weighted contribution
    weightedScoreSum += baseScore * weight;
  }

  // Round to nearest integer and ensure it's within 0-100 range
  const finalScore = Math.round(weightedScoreSum);
  return Math.max(0, Math.min(100, finalScore));
}
