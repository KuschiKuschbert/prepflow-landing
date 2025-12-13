/**
 * Helper for generating performance summary data
 */

import { logger } from '@/lib/logger';

export interface PerformanceItem {
  id: string;
  name: string;
  number_sold: number;
  menu_item_class: string;
  profit_category: string;
  popularity_category: string;
  gross_profit_percentage: number;
}

export interface PerformanceSummary {
  topSellers: Array<{ id: string; name: string; number_sold: number; menu_item_class: string }>;
  bottomSellers: Array<{ id: string; name: string; number_sold: number; menu_item_class: string }>;
  hiddenGems: Array<{
    id: string;
    name: string;
    gross_profit_percentage: number;
    number_sold: number;
  }>;
  categoryCounts: {
    chefsKiss: number;
    hiddenGem: number;
    bargainBucket: number;
    burntToast: number;
  };
}

/**
 * Generates performance summary from performance data
 *
 * @param {PerformanceItem[]} performanceData - Performance data for all dishes
 * @returns {PerformanceSummary} Performance summary
 */
export function generatePerformanceSummary(performanceData: PerformanceItem[]): PerformanceSummary {
  // Filter items with sales (number_sold > 0)
  const itemsWithSales = performanceData.filter(item => item.number_sold > 0);

  // Top 3 selling items (by number_sold)
  const topSellers = [...itemsWithSales]
    .sort((a, b) => b.number_sold - a.number_sold)
    .slice(0, 3)
    .map(item => ({
      id: item.id,
      name: item.name,
      number_sold: item.number_sold,
      menu_item_class: item.menu_item_class,
    }));

  // Bottom 3 items (lowest sales)
  const bottomSellers = [...itemsWithSales]
    .sort((a, b) => a.number_sold - b.number_sold)
    .slice(0, 3)
    .map(item => ({
      id: item.id,
      name: item.name,
      number_sold: item.number_sold,
      menu_item_class: item.menu_item_class,
    }));

  // Hidden gems (high profit, low sales - promotion opportunities)
  const hiddenGems = itemsWithSales
    .filter(
      item =>
        item.profit_category === 'High' &&
        item.popularity_category === 'Low' &&
        item.menu_item_class === 'Hidden Gem',
    )
    .sort((a, b) => b.gross_profit_percentage - a.gross_profit_percentage)
    .slice(0, 3)
    .map(item => ({
      id: item.id,
      name: item.name,
      gross_profit_percentage: item.gross_profit_percentage,
      number_sold: item.number_sold,
    }));

  // Category counts - ensure all dishes are included, even those without sales
  const categoryCounts = {
    chefsKiss: performanceData.filter(item => item.menu_item_class === "Chef's Kiss").length,
    hiddenGem: performanceData.filter(item => item.menu_item_class === 'Hidden Gem').length,
    bargainBucket: performanceData.filter(item => item.menu_item_class === 'Bargain Bucket').length,
    burntToast: performanceData.filter(item => item.menu_item_class === 'Burnt Toast').length,
  };

  // Debug: Log if any dishes don't have a category assigned
  const dishesWithoutCategory = performanceData.filter(item => !item.menu_item_class);
  if (dishesWithoutCategory.length > 0) {
    logger.warn(`Warning: ${dishesWithoutCategory.length} dishes without category assignment`);
  }

  return {
    topSellers,
    bottomSellers,
    hiddenGems,
    categoryCounts,
  };
}
