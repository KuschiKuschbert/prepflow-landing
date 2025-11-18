import type { PerformanceTip } from './tipCategories';

/**
 * Sort performance tips by priority and category.
 *
 * @param {PerformanceTip[]} tips - Array of tips to sort
 * @returns {PerformanceTip[]} Sorted array of tips
 */
export function sortPerformanceTips(tips: PerformanceTip[]): PerformanceTip[] {
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const categoryOrder: Record<string, number> = {
    'Menu Cleanup': 0,
    'Pricing Optimization': 1,
    'Marketing Opportunity': 2,
    'Data Quality': 3,
    'Overall Strategy': 4,
    'Growth Strategy': 5,
    Optimization: 6,
    Maintenance: 7,
  };

  return tips.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
  });
}
