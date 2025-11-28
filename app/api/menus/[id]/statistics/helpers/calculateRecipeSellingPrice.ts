import { calculateRecipeCost } from './calculateRecipeCost';

/**
 * Calculate selling price for a recipe using standard pricing logic (70% gross profit target).
 * Returns per-serving price (since calculateRecipeCost(recipeId, 1) returns per-serving cost).
 *
 * @param {string} recipeId - Recipe ID
 * @returns {Promise<number>} GST-inclusive selling price per serving
 */
export async function calculateRecipeSellingPrice(recipeId: string): Promise<number> {
  const recipeCost = await calculateRecipeCost(recipeId, 1);
  if (recipeCost <= 0) return 0;

  const targetGrossProfit = 70; // 70% gross profit = 30% food cost
  const gstRate = 0.1;

  // Calculate GST-exclusive price
  const sellPriceExclGST = recipeCost / (1 - targetGrossProfit / 100);
  const gstAmount = sellPriceExclGST * gstRate;
  const sellPriceInclGST = sellPriceExclGST + gstAmount;

  // Apply charm pricing: Math.ceil() - 0.01 (matching COGS method)
  const finalPriceInclGST = Math.ceil(sellPriceInclGST) - 0.01;

  // Return GST-inclusive price (matching recipe/dish builder)
  return finalPriceInclGST;
}
