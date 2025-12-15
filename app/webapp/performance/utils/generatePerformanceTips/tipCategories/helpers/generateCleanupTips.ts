/**
 * Generate tips for menu cleanup based on Burnt Toast items.
 */
import type { PerformanceItem, PerformanceTip } from '../../../types';

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
