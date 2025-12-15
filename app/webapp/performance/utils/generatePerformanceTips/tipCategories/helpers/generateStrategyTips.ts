/**
 * Generate tips for overall strategy based on performance score.
 */
import type { PerformanceTip } from '../../tipCategories';

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
