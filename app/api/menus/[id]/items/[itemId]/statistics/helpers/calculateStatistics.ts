/**
 * Helper for calculating menu item statistics
 */
import { RawMenuItem } from '../../../../../helpers/schemas';

export type StatisticsMenuItem = RawMenuItem & {
  dishes?: RawMenuItem['dishes'] | RawMenuItem['dishes'][];
  recipes?: RawMenuItem['recipes'] | RawMenuItem['recipes'][];
};
export interface MenuItemStatistics {
  cogs: number;
  recommended_selling_price: number | null;
  actual_selling_price: number | null;
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  food_cost_percent: number;
}

/**
 * Calculates statistics for a menu item
 *
 * @param {any} menuItem - Menu item data
 * @param {number} cogs - Cost of goods sold
 * @param {number | null} recommendedPrice - Recommended selling price
 * @returns {MenuItemStatistics} Calculated statistics
 */
export function calculateStatistics(
  menuItem: StatisticsMenuItem,
  cogs: number,
  recommendedPrice: number | null,
): MenuItemStatistics {
  // Determine actual selling price to use for calculations
  // Priority: menu_items.actual_selling_price > dish.selling_price (for dishes) > recommended_price (for recipes) > 0
  // Note: Recipes table doesn't have selling_price column - recipes use calculated recommended price

  // Normalize dishes/recipes data (Supabase may return as arrays)
  const dish = Array.isArray(menuItem.dishes) ? menuItem.dishes[0] : menuItem.dishes;

  const actualPrice = menuItem.actual_selling_price;

  let sellingPrice: number;
  if (actualPrice != null) {
    sellingPrice = actualPrice;
  } else if (menuItem.dish_id && dish?.selling_price != null) {
    // For dishes, use dish.selling_price if available
    sellingPrice = typeof dish.selling_price === 'string'
      ? parseFloat(dish.selling_price)
      : dish.selling_price ?? 0;
  } else {
    // For recipes or when no dish price: fallback to recommended price or 0
    // Recipes don't have selling_price column, so they always use recommended price
    sellingPrice = recommendedPrice ?? 0;
  }

  // Calculate statistics
  const grossProfit = sellingPrice - cogs;
  const grossProfitMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
  const foodCostPercent = sellingPrice > 0 ? (cogs / sellingPrice) * 100 : 0;

  return {
    cogs,
    recommended_selling_price: recommendedPrice,
    actual_selling_price: menuItem.actual_selling_price ?? null,
    selling_price: sellingPrice,
    gross_profit: grossProfit,
    gross_profit_margin: grossProfitMargin,
    food_cost_percent: foodCostPercent,
  };
}
