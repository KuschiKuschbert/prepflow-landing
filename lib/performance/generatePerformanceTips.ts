/**
 * Generate AI-enhanced tips to improve performance score
 *
 * Analyzes performance data and provides contextual, actionable recommendations
 */
import { PerformanceItem } from '@/lib/types/performance';
import type { PerformanceTip } from './generatePerformanceTips/tipCategories';
import {
  generateStrategyTips,
  generateCleanupTips,
  generateMarketingTips,
  generatePricingTips,
  generateGrowthTips,
  generateDataQualityTips,
} from './generatePerformanceTips/tipCategories';
import { sortPerformanceTips } from './generatePerformanceTips/sorting';

/**
 * Generate performance tips based on score and items.
 *
 * @param {number} performanceScore - Overall performance score
 * @param {PerformanceItem[]} performanceItems - Array of performance items
 * @returns {PerformanceTip[]} Array of sorted performance tips
 */
export function generatePerformanceTips(
  performanceScore: number,
  performanceItems: PerformanceItem[],
): PerformanceTip[] {
  if (!performanceItems || performanceItems.length === 0) {
    return [
      {
        priority: 'high',
        category: 'Data',
        message: 'No performance data available. Import sales data to calculate your score.',
        action: 'Import sales data to get started',
      },
    ];
  }

  const chefsKiss = performanceItems.filter(item => item.menu_item_class === "Chef's Kiss");
  const hiddenGems = performanceItems.filter(item => item.menu_item_class === 'Hidden Gem');
  const bargainBuckets = performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket');
  const burntToast = performanceItems.filter(item => item.menu_item_class === 'Burnt Toast');
  const totalItems = performanceItems.length;
  const chefsKissPercentage = (chefsKiss.length / totalItems) * 100;
  const hiddenGemsPercentage = (hiddenGems.length / totalItems) * 100;
  const bargainBucketsPercentage = (bargainBuckets.length / totalItems) * 100;
  const burntToastPercentage = (burntToast.length / totalItems) * 100;

  const tips: PerformanceTip[] = [
    ...generateStrategyTips(performanceScore),
    ...generateCleanupTips(burntToast, burntToastPercentage),
    ...generateMarketingTips(hiddenGems, hiddenGemsPercentage),
    ...generatePricingTips(bargainBuckets, bargainBucketsPercentage),
    ...generateGrowthTips(chefsKiss, chefsKissPercentage, performanceScore),
    ...generateDataQualityTips(performanceItems),
  ];

  return sortPerformanceTips(tips);
}

// Re-export types
export type { PerformanceTip } from './generatePerformanceTips/tipCategories';
