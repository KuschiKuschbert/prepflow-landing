import type { PerformanceItem } from '@/app/webapp/performance/types';
import { logger } from '@/lib/logger';

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

export function buildPerformanceInsightsPrompt(
  performanceItems: PerformanceItem[],
  performanceScore: number,
): string {
  const hiddenGems = performanceItems.filter(
    item => item.profit_category === 'High' && item.popularity_category === 'Low',
  );
  const bargainBuckets = performanceItems.filter(
    item => item.profit_category === 'Low' && item.popularity_category === 'High',
  );
  const burntToast = performanceItems.filter(
    item => item.profit_category === 'Low' && item.popularity_category === 'Low',
  );
  const chefsKiss = performanceItems.filter(
    item => item.profit_category === 'High' && item.popularity_category === 'High',
  );

  const totalRevenue = performanceItems.reduce(
    (sum, item) => sum + (item.selling_price || 0) * (item.number_sold || 0),
    0,
  );
  const totalProfit = performanceItems.reduce((sum, item) => sum + (item.gross_profit || 0), 0);
  const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const formatItem = (item: PerformanceItem) => {
    const revenue = (item.selling_price || 0) * (item.number_sold || 0);
    return `- ${item.name}: $${(item.gross_profit || 0).toFixed(2)} profit, ${item.number_sold} sold, ${revenue > 0 ? (((item.gross_profit || 0) / revenue) * 100).toFixed(1) : '0.0'}% margin`;
  };
  const prompt = `You are a restaurant profitability consultant analyzing menu performance data.

**Current Performance Score:** ${performanceScore}/100
**Average Profit Margin:** ${averageMargin.toFixed(1)}%
**Total Revenue:** $${totalRevenue.toFixed(2)}
**Total Profit:** $${totalProfit.toFixed(2)}

**Menu Item Categories:**

**Hidden Gems (High Profit, Low Popularity) - ${hiddenGems.length} items:**
${hiddenGems.slice(0, 10).map(formatItem).join('\n') || 'None'}

**Bargain Buckets (Low Profit, High Popularity) - ${bargainBuckets.length} items:**
${bargainBuckets.slice(0, 10).map(formatItem).join('\n') || 'None'}

**Burnt Toast (Low Profit, Low Popularity) - ${burntToast.length} items:**
${burntToast.slice(0, 10).map(formatItem).join('\n') || 'None'}

**Chef's Kiss (High Profit, High Popularity) - ${chefsKiss.length} items:**
${chefsKiss.slice(0, 10).map(formatItem).join('\n') || 'None'}

**Your Task:**
Generate 2-4 strategic insights with actionable recommendations. Each insight should:

1. **Identify the opportunity or issue** (be specific about item names and numbers)
2. **Explain the business impact** (use dollar amounts and percentages)
3. **Provide actionable recommendations** (specific steps the restaurant can take)
4. **Calculate potential impact** (estimated value improvement if recommendations are followed)

**Output Format:**
Return a JSON array of insights in this exact format:
[
  {
    "type": "hidden_gem" | "bargain_bucket" | "burnt_toast" | "chefs_kiss",
    "title": "Concise insight title (max 60 characters)",
    "message": "Detailed explanation with specific numbers and actionable recommendations (2-3 sentences)",
    "priority": "high" | "medium" | "low",
    "potentialImpact": {
      "description": "What this improvement would achieve",
      "value": 1234.56
    },
    "itemNames": ["Item 1", "Item 2", ...]
  }
]

Focus on:
- Specific item names and actual numbers
- Concrete dollar amounts for potential impact
- Actionable steps (not vague suggestions)
- Prioritize high-impact opportunities first
- Be professional and kitchen-focused`;

  return prompt;
}

export function parsePerformanceInsightsResponse(
  aiResponse: string,
  performanceItems: PerformanceItem[],
): PerformanceInsight[] {
  try {
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as Array<{
        type: string;
        title: string;
        message: string;
        priority: string;
        potentialImpact?: { description: string; value: number };
        itemNames?: string[];
      }>;

      return parsed
        .filter(
          insight =>
            insight.type &&
            insight.title &&
            insight.message &&
            ['hidden_gem', 'bargain_bucket', 'burnt_toast', 'chefs_kiss'].includes(insight.type) &&
            ['high', 'medium', 'low'].includes(insight.priority),
        )
        .map((insight, index) => {
          const items = insight.itemNames
            ? performanceItems.filter(item => insight.itemNames!.includes(item.name))
            : [];
          return {
            id: `ai_insight_${index}_${Date.now()}`,
            type: insight.type as PerformanceInsight['type'],
            title: insight.title,
            message: insight.message,
            items,
            priority: insight.priority as PerformanceInsight['priority'],
            potentialImpact: insight.potentialImpact,
          };
        });
    }
  } catch (error) {
    logger.warn('Failed to parse AI performance insights:', error);
  }

  return [];
}
