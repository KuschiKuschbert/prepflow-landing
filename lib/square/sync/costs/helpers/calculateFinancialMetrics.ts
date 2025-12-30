/**
 * Calculate financial metrics for a dish.
 */
import type { CostData } from '../../costs';

/**
 * Calculate financial metrics from total cost and selling price.
 */
export function calculateFinancialMetrics(
  totalCost: number,
  sellingPrice: number,
): Omit<CostData, 'last_updated'> {
  const GST_RATE = 0.1; // 10% GST
  const sellingPriceExclGST = sellingPrice / (1 + GST_RATE);

  const grossProfit = sellingPriceExclGST - totalCost;
  const foodCostPercent = sellingPriceExclGST > 0 ? (totalCost / sellingPriceExclGST) * 100 : 0;
  const grossProfitMargin = sellingPriceExclGST > 0 ? (grossProfit / sellingPriceExclGST) * 100 : 0;

  const contributingMargin = grossProfit;
  const contributingMarginPercent =
    sellingPriceExclGST > 0 ? (contributingMargin / sellingPriceExclGST) * 100 : 0;

  return {
    total_cost: totalCost,
    food_cost_percent: foodCostPercent,
    gross_profit: grossProfit,
    gross_profit_margin: grossProfitMargin,
    contributing_margin: contributingMargin,
    contributing_margin_percent: contributingMarginPercent,
  };
}




