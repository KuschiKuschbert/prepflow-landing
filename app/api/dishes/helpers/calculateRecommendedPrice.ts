/**
 * Calculate recommended selling price for a dish using standard pricing logic (70% gross profit target).
 * Matches the formula used for recipes.
 *
 * @param {number} totalCost - Total cost of the dish
 * @returns {number} Recommended selling price (GST-inclusive)
 */
export function calculateRecommendedPrice(totalCost: number): number {
  if (totalCost <= 0) return 0;

  const targetGrossProfit = 70; // 70% gross profit = 30% food cost
  const gstRate = 0.1; // 10% GST for Australia

  // Calculate GST-exclusive price first (matching COGS method)
  const sellPriceExclGST = totalCost / (1 - targetGrossProfit / 100);
  const gstAmount = sellPriceExclGST * gstRate;
  const sellPriceInclGST = sellPriceExclGST + gstAmount;

  // Apply charm pricing: Math.ceil() - 0.01 (matching COGS method)
  const finalPriceInclGST = Math.ceil(sellPriceInclGST) - 0.01;

  return finalPriceInclGST;
}

