import { logger } from '@/lib/logger';
import { MenuDishRelation, MenuItemWithRelations } from '../../../helpers/schemas';
import { calculateDishCost } from './calculateDishCost';
import { calculateDishSellingPrice } from './calculateDishSellingPrice';

/**
 * Processes a dish item for statistics calculation
 *
 * @param {MenuItemWithRelations} item - Menu item with dish
 * @param {MenuDishRelation} dish - Dish data
 * @returns {Promise<{ cogs: number; revenue: number; margin: number | null }>} Statistics for dish
 */
export async function processDishItem(
  item: MenuItemWithRelations,
  dish: MenuDishRelation,
): Promise<{
  cogs: number;
  revenue: number;
  margin: number | null;
}> {
  // Price priority: menu_items.actual_selling_price > dish.selling_price > calculated recommended
  let sellingPrice =
    item.actual_selling_price ??
    (dish.selling_price ? parseFloat(String(dish.selling_price)) : null);

  // Calculate recommended price if needed
  if (sellingPrice == null) {
    try {
      sellingPrice = await calculateDishSellingPrice(dish.id);
    } catch (err: unknown) {
      logger.error('[calculateMenuStatistics] Error calculating dish selling price:', {
        dish_id: dish.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Calculate COGS
  let dishCost = 0;
  try {
    dishCost = await calculateDishCost(dish.id);
  } catch (err: unknown) {
    logger.error('[calculateMenuStatistics] Error calculating dish cost:', {
      dish_id: dish.id,
      error: err instanceof Error ? err.message : String(err),
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
