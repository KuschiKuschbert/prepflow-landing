/**
 * Helper for processing dish items in menu statistics
 */

import { logger } from '@/lib/logger';
import { calculateDishCost } from './calculateDishCost';
import { calculateDishSellingPrice } from './calculateDishSellingPrice';

/**
 * Processes a dish item for statistics calculation
 *
 * @param {any} item - Menu item with dish
 * @param {any} dish - Dish data
 * @returns {Promise<{ cogs: number; revenue: number; margin: number | null }>} Statistics for dish
 */
export async function processDishItem(
  item: any,
  dish: any,
): Promise<{
  cogs: number;
  revenue: number;
  margin: number | null;
}> {
  // Price priority: menu_items.actual_selling_price > dish.selling_price > calculated recommended
  let sellingPrice =
    item.actual_selling_price ?? (dish.selling_price ? parseFloat(dish.selling_price) : null);

  // Calculate recommended price if needed
  if (sellingPrice == null) {
    try {
      sellingPrice = await calculateDishSellingPrice(dish.id);
    } catch (err) {
      logger.error('[calculateMenuStatistics] Error calculating dish selling price:', {
        dish_id: dish.id,
        error: err,
      });
    }
  }

  // Calculate COGS
  let dishCost = 0;
  try {
    dishCost = await calculateDishCost(dish.id);
  } catch (err) {
    logger.error('[calculateMenuStatistics] Error calculating dish cost:', {
      dish_id: dish.id,
      error: err,
    });
  }

  // Only add to revenue and calculate margin if we have a valid selling price
  if (sellingPrice != null && sellingPrice > 0 && !isNaN(sellingPrice)) {
    const grossProfit = sellingPrice - dishCost;
    const margin = (grossProfit / sellingPrice) * 100;
    return { cogs: dishCost, revenue: sellingPrice, margin };
  }

  return { cogs: dishCost, revenue: 0, margin: null };
}

