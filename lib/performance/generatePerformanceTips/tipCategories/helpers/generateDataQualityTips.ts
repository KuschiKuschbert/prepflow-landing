/**
 * Generate tips for data quality based on sales data coverage.
 */
import type { PerformanceItem } from '@/lib/types/performance';
import type { PerformanceTip } from '../../tipCategories';

export function generateDataQualityTips(performanceItems: PerformanceItem[]): PerformanceTip[] {
  const tips: PerformanceTip[] = [];
  const totalItems = performanceItems.length;
  const itemsWithSales = performanceItems.filter(item => item.number_sold > 0);
  const salesDataCoverage = (itemsWithSales.length / totalItems) * 100;
  if (salesDataCoverage < 50) {
    tips.push({
      priority: 'high',
      category: 'Data Quality',
      message: `Only ${Math.round(salesDataCoverage)}% of items have sales data.`,
      action: 'Import more sales data for accurate performance analysis',
    });
  }
  return tips;
}
