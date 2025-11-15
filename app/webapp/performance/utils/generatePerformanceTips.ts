/**
 * Generate AI-enhanced tips to improve performance score
 *
 * Analyzes performance data and provides contextual, actionable recommendations
 */
import { PerformanceItem } from '../types';

interface PerformanceTip {
  priority: 'high' | 'medium' | 'low';
  category: string;
  message: string;
  action?: string;
}

export function generatePerformanceTips(
  performanceScore: number,
  performanceItems: PerformanceItem[],
): PerformanceTip[] {
  const tips: PerformanceTip[] = [];

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

  // Analyze menu item distribution
  const chefsKiss = performanceItems.filter(item => item.menu_item_class === "Chef's Kiss");
  const hiddenGems = performanceItems.filter(item => item.menu_item_class === 'Hidden Gem');
  const bargainBuckets = performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket');
  const burntToast = performanceItems.filter(item => item.menu_item_class === 'Burnt Toast');

  const totalItems = performanceItems.length;
  const chefsKissPercentage = (chefsKiss.length / totalItems) * 100;
  const hiddenGemsPercentage = (hiddenGems.length / totalItems) * 100;
  const bargainBucketsPercentage = (bargainBuckets.length / totalItems) * 100;
  const burntToastPercentage = (burntToast.length / totalItems) * 100;

  // Score-based general tips
  if (performanceScore < 50) {
    tips.push({
      priority: 'high',
      category: 'Overall Strategy',
      message: 'Your menu needs significant optimization. Focus on improving profit margins and increasing sales of high-profit items.',
      action: 'Review items with low profit margins and consider price adjustments',
    });
  } else if (performanceScore < 70) {
    tips.push({
      priority: 'medium',
      category: 'Overall Strategy',
      message: 'Your menu has room for improvement. Focus on converting underperforming items into stars.',
      action: 'Identify Hidden Gems and market them better, or adjust Bargain Bucket pricing',
    });
  } else if (performanceScore < 90) {
    tips.push({
      priority: 'low',
      category: 'Optimization',
      message: 'Your menu is performing well. Fine-tune remaining opportunities to reach excellence.',
      action: 'Focus on converting Hidden Gems and optimizing Bargain Buckets',
    });
  }

  // Burnt Toast items - high priority
  if (burntToastPercentage > 20) {
    tips.push({
      priority: 'high',
      category: 'Menu Cleanup',
      message: `${burntToast.length} items (${Math.round(burntToastPercentage)}%) are underperforming in both profit and popularity.`,
      action: `Consider removing or significantly revamping these items: ${burntToast.slice(0, 3).map(i => i.name).join(', ')}`,
    });
  } else if (burntToast.length > 0) {
    tips.push({
      priority: 'medium',
      category: 'Menu Cleanup',
      message: `${burntToast.length} item${burntToast.length > 1 ? 's' : ''} need attention.`,
      action: `Review and improve: ${burntToast.slice(0, 3).map(i => i.name).join(', ')}`,
    });
  }

  // Hidden Gems - marketing opportunity
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

  // Bargain Buckets - pricing opportunity
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

  // Chef's Kiss - maintain and grow
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

  // Sales data quality
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

  // Sort by priority (high first, then by category importance)
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const categoryOrder: Record<string, number> = {
    'Menu Cleanup': 0,
    'Pricing Optimization': 1,
    'Marketing Opportunity': 2,
    'Data Quality': 3,
    'Overall Strategy': 4,
    'Growth Strategy': 5,
    'Optimization': 6,
    'Maintenance': 7,
  };

  return tips.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
  });
}
