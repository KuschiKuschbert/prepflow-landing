/**
 * Chart data transformers for performance charts.
 * Single-pass aggregation over performanceItems for efficiency.
 */

import type { PerformanceItem } from '@/lib/types/performance';

const CATEGORY_COLORS: Record<string, string> = {
  "Chef's Kiss": 'var(--color-success)',
  'Hidden Gem': 'var(--color-info)',
  'Bargain Bucket': 'var(--color-warning)',
  'Burnt Toast': 'var(--color-error)',
};

const CATEGORY_NAMES = ["Chef's Kiss", 'Hidden Gem', 'Bargain Bucket', 'Burnt Toast'] as const;

export interface CategoryAggregates {
  chefKiss: { sum: number; count: number };
  hiddenGem: { sum: number; count: number };
  bargainBucket: { sum: number; count: number };
  burntToast: { sum: number; count: number };
}

export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export type { ChartDataWithWeather, WeatherCorrelation } from './weatherChartUtils';

/**
 * Single-pass aggregation of performance items by category.
 */
export function computeCategoryAggregates(performanceItems: PerformanceItem[]): CategoryAggregates {
  const init = { sum: 0, count: 0 };
  const agg: CategoryAggregates = {
    chefKiss: { ...init },
    hiddenGem: { ...init },
    bargainBucket: { ...init },
    burntToast: { ...init },
  };

  for (const item of performanceItems) {
    const key =
      item.menu_item_class === "Chef's Kiss"
        ? 'chefKiss'
        : item.menu_item_class === 'Hidden Gem'
          ? 'hiddenGem'
          : item.menu_item_class === 'Bargain Bucket'
            ? 'bargainBucket'
            : 'burntToast';
    agg[key].sum += item.gross_profit_percentage;
    agg[key].count += 1;
  }

  return agg;
}

/**
 * Derive bar chart data (avg profit margin by category) from aggregates.
 */
export function deriveChartData(aggregates: CategoryAggregates): ChartDataItem[] {
  return CATEGORY_NAMES.map(name => {
    const key =
      name === "Chef's Kiss"
        ? 'chefKiss'
        : name === 'Hidden Gem'
          ? 'hiddenGem'
          : name === 'Bargain Bucket'
            ? 'bargainBucket'
            : 'burntToast';
    const { sum, count } = aggregates[key];
    return {
      name,
      value: count > 0 ? sum / count : 0,
      color: CATEGORY_COLORS[name],
    };
  });
}

/**
 * Derive pie chart data (category distribution) from aggregates.
 */
export function derivePieData(aggregates: CategoryAggregates): ChartDataItem[] {
  return CATEGORY_NAMES.map(name => {
    const key =
      name === "Chef's Kiss"
        ? 'chefKiss'
        : name === 'Hidden Gem'
          ? 'hiddenGem'
          : name === 'Bargain Bucket'
            ? 'bargainBucket'
            : 'burntToast';
    return {
      name,
      value: aggregates[key].count,
      color: CATEGORY_COLORS[name],
    };
  });
}

/**
 * Top profit items sorted by gross_profit * number_sold.
 */
export function getTopProfitItems(
  performanceItems: PerformanceItem[],
  limit = 3,
): PerformanceItem[] {
  return [...performanceItems]
    .sort((a, b) => b.gross_profit * b.number_sold - a.gross_profit * a.number_sold)
    .slice(0, limit);
}

/**
 * Total profit across all items.
 */
export function getTotalProfit(performanceItems: PerformanceItem[]): number {
  return performanceItems.reduce((sum, item) => sum + item.gross_profit * item.number_sold, 0);
}

export { mergeHistoryWithWeather, computeWeatherCorrelation } from './weatherChartUtils';
