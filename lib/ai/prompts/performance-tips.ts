import type { PerformanceItem } from '@/app/webapp/performance/types';
import { logger } from '@/lib/logger';

export interface PerformanceTip {
  priority: 'high' | 'medium' | 'low';
  category: string;
  message: string;
  action?: string;
}

export function buildPerformanceTipsPrompt(
  performanceScore: number,
  performanceItems: PerformanceItem[],
): string {
  // Analyze menu item distribution
  const chefsKiss = performanceItems.filter(item => item.menu_item_class === "Chef's Kiss");
  const hiddenGems = performanceItems.filter(item => item.menu_item_class === 'Hidden Gem');
  const bargainBuckets = performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket');
  const burntToast = performanceItems.filter(item => item.menu_item_class === 'Burnt Toast');

  const totalItems = performanceItems.length;
  const totalSales = performanceItems.reduce((sum, item) => sum + (item.number_sold || 0), 0);
  const totalRevenue = performanceItems.reduce(
    (sum, item) => sum + (item.selling_price || 0) * (item.number_sold || 0),
    0,
  );
  const totalCost = performanceItems.reduce(
    (sum, item) => sum + (item.cost_per_serving || 0) * (item.number_sold || 0),
    0,
  );
  const totalProfit = performanceItems.reduce((sum, item) => sum + (item.gross_profit || 0), 0);
  const averageProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const formatItem = (item: PerformanceItem) => {
    const revenue = (item.selling_price || 0) * (item.number_sold || 0);
    return `- ${item.name}: ${item.number_sold} sold, $${(item.gross_profit || 0).toFixed(2)} profit, ${revenue > 0 ? (((item.gross_profit || 0) / revenue) * 100).toFixed(1) : '0.0'}% margin`;
  };
  const prompt = `You are a restaurant profitability consultant analyzing a menu's performance.

**Current Performance Score:** ${performanceScore}/100

**Menu Analysis:**
- Total Menu Items: ${totalItems}
- Total Sales: ${totalSales.toLocaleString()} units
- Total Revenue: $${totalRevenue.toFixed(2)}
- Total Cost: $${totalCost.toFixed(2)}
- Total Profit: $${totalProfit.toFixed(2)}
- Average Profit Margin: ${averageProfitMargin.toFixed(1)}%

**Menu Item Distribution:**
- Chef's Kiss (High Profit + High Popularity): ${chefsKiss.length} items (${((chefsKiss.length / totalItems) * 100).toFixed(1)}%)
- Hidden Gems (High Profit + Low Popularity): ${hiddenGems.length} items (${((hiddenGems.length / totalItems) * 100).toFixed(1)}%)
- Bargain Buckets (Low Profit + High Popularity): ${bargainBuckets.length} items (${((bargainBuckets.length / totalItems) * 100).toFixed(1)}%)
- Burnt Toast (Low Profit + Low Popularity): ${burntToast.length} items (${((burntToast.length / totalItems) * 100).toFixed(1)}%)

**Top Performers (Chef's Kiss):**
${chefsKiss.slice(0, 5).map(formatItem).join('\n') || 'None'}

**Hidden Opportunities (Hidden Gems):**
${hiddenGems.slice(0, 5).map(formatItem).join('\n') || 'None'}

**Pricing Issues (Bargain Buckets):**
${bargainBuckets.slice(0, 5).map(formatItem).join('\n') || 'None'}

**Underperformers (Burnt Toast):**
${burntToast.slice(0, 5).map(formatItem).join('\n') || 'None'}

**Your Task:**
Generate 3-7 actionable tips to improve the performance score. Each tip should have:
1. Priority: "high", "medium", or "low"
2. Category: One of "Menu Cleanup", "Pricing Optimization", "Marketing Opportunity", "Data Quality", "Overall Strategy", "Growth Strategy", "Optimization", or "Maintenance"
3. Message: A clear, specific explanation of the issue or opportunity
4. Action: A concrete, actionable recommendation (optional for low-priority maintenance tips)

Focus on:
- Specific items that need attention (use actual item names)
- Concrete numbers and percentages
- Actionable steps the restaurant can take immediately
- Prioritize high-impact changes first

Return your response as a JSON array of tips in this exact format:
[
  {
    "priority": "high",
    "category": "Pricing Optimization",
    "message": "Specific issue or opportunity",
    "action": "Concrete recommendation"
  }
]

Be concise, professional, and kitchen-focused.`;

  return prompt;
}

export function parsePerformanceTipsResponse(aiResponse: string): PerformanceTip[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const tips = JSON.parse(jsonMatch[0]) as PerformanceTip[];
      // Validate tips structure
      return tips.filter(
        tip =>
          tip.priority &&
          tip.category &&
          tip.message &&
          ['high', 'medium', 'low'].includes(tip.priority),
      );
    }
  } catch (error) {
    logger.warn('Failed to parse AI performance tips:', error);
  }

  // Fallback: return empty array
  return [];
}
