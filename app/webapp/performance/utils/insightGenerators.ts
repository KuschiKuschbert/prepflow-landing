import type { PerformanceInsight } from '../hooks/performance-insight-types';
import { PerformanceItem } from '@/lib/types/performance';

export function generateHiddenGemInsight(hiddenGems: PerformanceItem[]): PerformanceInsight | null {
  if (hiddenGems.length === 0) return null;

  const totalPotentialProfit = hiddenGems.reduce(
    (sum, item) => sum + item.gross_profit * item.number_sold,
    0,
  );

  return {
    id: 'hidden-gems',
    type: 'hidden_gem',
    title: `${hiddenGems.length} Hidden Gem${hiddenGems.length > 1 ? 's' : ''} Need Marketing`,
    message: `These items are profitable but not selling well. Consider marketing them better, featuring them on your menu, or improving presentation.`,
    items: hiddenGems,
    priority: hiddenGems.length > 3 ? 'high' : hiddenGems.length > 1 ? 'medium' : 'low',
    potentialImpact: {
      description: `If popularity increases by 50%, potential additional profit`,
      value: totalPotentialProfit * 0.5,
    },
  };
}

export function generateBargainBucketInsight(
  bargainBuckets: PerformanceItem[],
): PerformanceInsight | null {
  if (bargainBuckets.length === 0) return null;

  const _totalCurrentProfit = bargainBuckets.reduce(
    (sum, item) => sum + item.gross_profit * item.number_sold,
    0,
  );
  const totalRevenue = bargainBuckets.reduce(
    (sum, item) => sum + (item.selling_price * item.number_sold) / 1.1,
    0,
  );
  // Calculate potential profit if we raise prices by 10%
  const potentialProfitIncrease = totalRevenue * 0.1 * 0.9; // 10% price increase, assuming 90% margin retention

  return {
    id: 'bargain-buckets',
    type: 'bargain_bucket',
    title: `${bargainBuckets.length} Bargain Bucket${bargainBuckets.length > 1 ? 's' : ''} Need Price Adjustment`,
    message: `These items are popular but have low profit margins. Consider raising prices by 5-10% or adjusting portions to improve profitability.`,
    items: bargainBuckets,
    priority: bargainBuckets.length > 3 ? 'high' : bargainBuckets.length > 1 ? 'medium' : 'low',
    potentialImpact: {
      description: `Raising prices by 10% could add approximately`,
      value: potentialProfitIncrease,
    },
  };
}

export function generateBurntToastInsight(
  burntToast: PerformanceItem[],
): PerformanceInsight | null {
  if (burntToast.length === 0) return null;

  return {
    id: 'burnt-toast',
    type: 'burnt_toast',
    title: `${burntToast.length} Burnt Toast Item${burntToast.length > 1 ? 's' : ''} Should Be Reviewed`,
    message: `These items have low profit margins and low sales. Consider removing them from your menu, improving the recipe, or significantly adjusting pricing.`,
    items: burntToast,
    priority: burntToast.length > 2 ? 'high' : 'medium',
  };
}

export function generateChefsKissInsight(chefsKiss: PerformanceItem[]): PerformanceInsight | null {
  if (chefsKiss.length === 0) return null;

  const totalProfit = chefsKiss.reduce(
    (sum, item) => sum + item.gross_profit * item.number_sold,
    0,
  );

  return {
    id: 'chefs-kiss',
    type: 'chefs_kiss',
    title: `${chefsKiss.length} Chef's Kiss Item${chefsKiss.length > 1 ? 's' : ''} - Your Stars`,
    message: `These items are profitable and popular. Keep them, feature them prominently, and consider them as models for new menu items.`,
    items: chefsKiss,
    priority: 'low', // Low priority because it's positive, not actionable
    potentialImpact: {
      description: `Total profit from star performers`,
      value: totalProfit,
    },
  };
}

export function sortInsightsByPriority(insights: PerformanceInsight[]): PerformanceInsight[] {
  return insights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.items.length - a.items.length;
  });
}
