/**
 * Generate tips for pricing optimization based on Bargain Buckets.
 */
import type { PerformanceItem, PerformanceTip } from '../../../../types';

export function generatePricingTips(
  bargainBuckets: PerformanceItem[],
  bargainBucketsPercentage: number,
): PerformanceTip[] {
  const tips: PerformanceTip[] = [];
  if (bargainBuckets.length > 0 && bargainBucketsPercentage > 20) {
    const topBargain = bargainBuckets.reduce((prev, current) =>
      prev.number_sold > current.number_sold ? prev : current,
    );
    tips.push({
      priority: 'high',
      category: 'Pricing Optimization',
      message: `${bargainBuckets.length} popular items have low profit margins.`,
      action: `Consider raising prices on "${topBargain.name}" - it's popular but not profitable enough`,
    });
  } else if (bargainBuckets.length > 0) {
    tips.push({
      priority: 'medium',
      category: 'Pricing Optimization',
      message: `${bargainBuckets.length} item${bargainBuckets.length > 1 ? 's' : ''} are popular but have slim margins.`,
      action: 'Review pricing or portion sizes to improve profitability',
    });
  }
  return tips;
}
