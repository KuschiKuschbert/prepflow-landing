import { PerformanceItem } from '../../types';

/**
 * Performance tip interface.
 */
export interface PerformanceTip {
  priority: 'high' | 'medium' | 'low';
  category: string;
  message: string;
  action?: string;
}

/**
 * Generate tips for overall strategy based on performance score.
 *
 * @param {number} performanceScore - Overall performance score
 * @returns {PerformanceTip[]} Array of strategy tips
 */
export function generateStrategyTips(performanceScore: number): PerformanceTip[] {
  const tips: PerformanceTip[] = [];

  if (performanceScore < 50) {
    tips.push({
      priority: 'high',
      category: 'Overall Strategy',
      message:
        'Your menu needs significant optimization. Focus on improving profit margins and increasing sales of high-profit items.',
      action: 'Review items with low profit margins and consider price adjustments',
    });
  } else if (performanceScore < 70) {
    tips.push({
      priority: 'medium',
      category: 'Overall Strategy',
      message:
        'Your menu has room for improvement. Focus on converting underperforming items into stars.',
      action: 'Identify Hidden Gems and market them better, or adjust Bargain Bucket pricing',
    });
  } else if (performanceScore < 90) {
    tips.push({
      priority: 'low',
      category: 'Optimization',
      message:
        'Your menu is performing well. Fine-tune remaining opportunities to reach excellence.',
      action: 'Focus on converting Hidden Gems and optimizing Bargain Buckets',
    });
  }

  return tips;
}

/**
 * Generate tips for menu cleanup based on Burnt Toast items.
 *
 * @param {PerformanceItem[]} burntToast - Burnt Toast items
 * @param {number} burntToastPercentage - Percentage of Burnt Toast items
 * @returns {PerformanceTip[]} Array of cleanup tips
 */
export function generateCleanupTips(
  burntToast: PerformanceItem[],
  burntToastPercentage: number,
): PerformanceTip[] {
  const tips: PerformanceTip[] = [];

  if (burntToastPercentage > 20) {
    tips.push({
      priority: 'high',
      category: 'Menu Cleanup',
      message: `${burntToast.length} items (${Math.round(burntToastPercentage)}%) are underperforming in both profit and popularity.`,
      action: `Consider removing or significantly revamping these items: ${burntToast
        .slice(0, 3)
        .map(i => i.name)
        .join(', ')}`,
    });
  } else if (burntToast.length > 0) {
    tips.push({
      priority: 'medium',
      category: 'Menu Cleanup',
      message: `${burntToast.length} item${burntToast.length > 1 ? 's' : ''} need attention.`,
      action: `Review and improve: ${burntToast
        .slice(0, 3)
        .map(i => i.name)
        .join(', ')}`,
    });
  }

  return tips;
}

/**
 * Generate tips for marketing opportunities based on Hidden Gems.
 *
 * @param {PerformanceItem[]} hiddenGems - Hidden Gem items
 * @param {number} hiddenGemsPercentage - Percentage of Hidden Gem items
 * @returns {PerformanceTip[]} Array of marketing tips
 */
export function generateMarketingTips(
  hiddenGems: PerformanceItem[],
  hiddenGemsPercentage: number,
): PerformanceTip[] {
  const tips: PerformanceTip[] = [];

  if (hiddenGems.length > 0 && hiddenGemsPercentage > 15) {
    const topHiddenGem = hiddenGems.reduce((prev, current) =>
      prev.gross_profit > current.gross_profit ? prev : current,
    );
    tips.push({
      priority: 'high',
      category: 'Marketing Opportunity',
      message: `${hiddenGems.length} profitable items aren't getting enough attention.`,
      action: `Feature "${topHiddenGem.name}" prominently - it's profitable but underperforming in sales`,
    });
  } else if (hiddenGems.length > 0) {
    tips.push({
      priority: 'medium',
      category: 'Marketing Opportunity',
      message: `You have ${hiddenGems.length} profitable item${hiddenGems.length > 1 ? 's' : ''} that could sell more.`,
      action: 'Increase visibility through menu placement, specials, or staff recommendations',
    });
  }

  return tips;
}

/**
 * Generate tips for pricing optimization based on Bargain Buckets.
 *
 * @param {PerformanceItem[]} bargainBuckets - Bargain Bucket items
 * @param {number} bargainBucketsPercentage - Percentage of Bargain Bucket items
 * @returns {PerformanceTip[]} Array of pricing tips
 */
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

/**
 * Generate tips for growth strategy based on Chef's Kiss items.
 *
 * @param {PerformanceItem[]} chefsKiss - Chef's Kiss items
 * @param {number} chefsKissPercentage - Percentage of Chef's Kiss items
 * @param {number} performanceScore - Overall performance score
 * @returns {PerformanceTip[]} Array of growth tips
 */
export function generateGrowthTips(
  chefsKiss: PerformanceItem[],
  chefsKissPercentage: number,
  performanceScore: number,
): PerformanceTip[] {
  const tips: PerformanceTip[] = [];

  if (chefsKissPercentage < 30 && performanceScore < 80) {
    tips.push({
      priority: 'medium',
      category: 'Growth Strategy',
      message: `Only ${Math.round(chefsKissPercentage)}% of your menu are star performers.`,
      action: 'Use successful items as templates - analyze what makes them work and replicate',
    });
  } else if (chefsKiss.length > 0) {
    tips.push({
      priority: 'low',
      category: 'Maintenance',
      message: `You have ${chefsKiss.length} star performer${chefsKiss.length > 1 ? 's' : ''}. Keep them featured and maintain quality.`,
    });
  }

  return tips;
}

/**
 * Generate tips for data quality based on sales data coverage.
 *
 * @param {PerformanceItem[]} performanceItems - All performance items
 * @returns {PerformanceTip[]} Array of data quality tips
 */
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
