import { calculateDishCost } from './calculateDishCost';

/**
 * Calculate selling price for a dish using standard pricing logic (70% gross profit target).
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<number>} GST-exclusive selling price
 */
export async function calculateDishSellingPrice(dishId: string): Promise<number> {
  const dishCost = await calculateDishCost(dishId);
  if (dishCost <= 0) return 0;

  const targetGrossProfit = 70; // 70% gross profit = 30% food cost
  const gstRate = 0.1;

  // Calculate GST-exclusive price
  const sellPriceExclGST = dishCost / (1 - targetGrossProfit / 100);
  const gstAmount = sellPriceExclGST * gstRate;
  const sellPriceInclGST = sellPriceExclGST + gstAmount;

  // Apply charm pricing: Math.ceil() - 0.01 (matching COGS method)
  const finalPriceInclGST = Math.ceil(sellPriceInclGST) - 0.01;

  // Recalculate GST-exclusive from final price
  return finalPriceInclGST / (1 + gstRate);
}

