/**
 * Generate tips for growth strategy based on Chef's Kiss items.
 */
import type { PerformanceItem } from '../../../../types';
import type { PerformanceTip } from '../../tipCategories';

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
