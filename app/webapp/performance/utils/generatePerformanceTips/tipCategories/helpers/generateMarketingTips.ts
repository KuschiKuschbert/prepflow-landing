/**
 * Generate tips for marketing opportunities based on Hidden Gems.
 */
import type { PerformanceItem } from '../../../../types';
import type { PerformanceTip } from '../../tipCategories';

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
