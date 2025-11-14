'use client';

import { useMemo } from 'react';
import { PerformanceItem } from '../types';

export interface PerformanceInsight {
  id: string;
  type: 'hidden_gem' | 'bargain_bucket' | 'burnt_toast' | 'chefs_kiss';
  title: string;
  message: string;
  items: PerformanceItem[];
  priority: 'high' | 'medium' | 'low';
  potentialImpact?: {
    description: string;
    value: number;
  };
}

export function usePerformanceInsights(performanceItems: PerformanceItem[]) {
  const insights = useMemo(() => {
    const result: PerformanceInsight[] = [];

    // Hidden Gems: High profit, low popularity
    const hiddenGems = performanceItems.filter(
      item => item.profit_category === 'High' && item.popularity_category === 'Low',
    );
    if (hiddenGems.length > 0) {
      const totalPotentialProfit = hiddenGems.reduce(
        (sum, item) => sum + item.gross_profit * item.number_sold,
        0,
      );
      result.push({
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
      });
    }

    // Bargain Buckets: Low profit, high popularity
    const bargainBuckets = performanceItems.filter(
      item => item.profit_category === 'Low' && item.popularity_category === 'High',
    );
    if (bargainBuckets.length > 0) {
      const totalCurrentProfit = bargainBuckets.reduce(
        (sum, item) => sum + item.gross_profit * item.number_sold,
        0,
      );
      const totalRevenue = bargainBuckets.reduce(
        (sum, item) => sum + (item.selling_price * item.number_sold) / 1.1,
        0,
      );
      // Calculate potential profit if we raise prices by 10%
      const potentialProfitIncrease = totalRevenue * 0.1 * 0.9; // 10% price increase, assuming 90% margin retention
      result.push({
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
      });
    }

    // Burnt Toast: Low profit, low popularity
    const burntToast = performanceItems.filter(
      item => item.profit_category === 'Low' && item.popularity_category === 'Low',
    );
    if (burntToast.length > 0) {
      result.push({
        id: 'burnt-toast',
        type: 'burnt_toast',
        title: `${burntToast.length} Burnt Toast Item${burntToast.length > 1 ? 's' : ''} Should Be Reviewed`,
        message: `These items have low profit margins and low sales. Consider removing them from your menu, improving the recipe, or significantly adjusting pricing.`,
        items: burntToast,
        priority: burntToast.length > 2 ? 'high' : 'medium',
      });
    }

    // Chef's Kiss: High profit, high popularity (positive insight)
    const chefsKiss = performanceItems.filter(
      item => item.profit_category === 'High' && item.popularity_category === 'High',
    );
    if (chefsKiss.length > 0) {
      const totalProfit = chefsKiss.reduce((sum, item) => sum + item.gross_profit * item.number_sold, 0);
      result.push({
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
      });
    }

    // Sort by priority (high first, then by item count)
    return result.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.items.length - a.items.length;
    });
  }, [performanceItems]);

  return {
    insights,
    hasInsights: insights.length > 0,
  };
}
