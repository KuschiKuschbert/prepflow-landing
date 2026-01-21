import { logger } from '@/lib/logger';
import { MenuItemWithRelations } from '../../../helpers/internal-types';
import { MenuDetailStatistics } from '../../../types';
import { processDishItem } from './processDishItem';
import { processRecipeItem } from './processRecipeItem';

/**
 * Calculate menu statistics from menu items.
 *
 * @param {MenuItemWithRelations[]} menuItems - Menu items with dishes and recipes
 * @returns {Promise<MenuStatistics>} Menu statistics
 */
export async function calculateMenuStatistics(
  menuItems: MenuItemWithRelations[],
): Promise<MenuDetailStatistics> {
  logger.dev('[calculateMenuStatistics] Starting calculation', { itemCount: menuItems.length });
  let totalCOGS = 0;
  let totalRevenue = 0;
  const profitMargins: number[] = [];
  let dishCount = 0;
  let recipeCount = 0;

  for (const item of menuItems) {
    // Supabase may return dishes/recipes as arrays or single objects
    const dish = Array.isArray(item.dishes) ? item.dishes[0] : item.dishes;
    const recipe = Array.isArray(item.recipes) ? item.recipes[0] : item.recipes;

    logger.dev('[calculateMenuStatistics] Processing item:', {
      dish_id: item.dish_id,
      recipe_id: item.recipe_id,
      has_dish: !!dish,
      has_recipe: !!recipe,
    });

    // Handle dishes
    if (dish) {
      dishCount++;
      try {
        const { cogs, revenue, margin } = await processDishItem(item, dish);
        totalCOGS += cogs || 0;
        if (revenue > 0 && margin !== null) {
          totalRevenue += revenue;
          profitMargins.push(margin);
        }
      } catch (err: unknown) {
        logger.error('[calculateMenuStatistics] Unexpected error processing dish:', {
          dish_id: dish.id,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    // Handle recipes
    if (recipe) {
      recipeCount++;
      try {
        const { cogs, revenue, margin } = await processRecipeItem(item, recipe);
        totalCOGS += cogs || 0;
        if (revenue > 0 && margin !== null) {
          totalRevenue += revenue;
          profitMargins.push(margin);
        }
      } catch (err: unknown) {
        logger.error('[calculateMenuStatistics] Unexpected error processing recipe:', {
          recipe_id: recipe.id,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  logger.dev('[calculateMenuStatistics] Calculation complete:', {
    totalCOGS,
    totalRevenue,
    profitMarginsCount: profitMargins.length,
    dishCount,
    recipeCount,
  });

  // Calculate statistics with safety checks
  const averageProfitMargin =
    profitMargins.length > 0
      ? profitMargins.reduce(
          (sum, margin) => sum + (isNaN(margin) || !isFinite(margin) ? 0 : margin),
          0,
        ) / profitMargins.length
      : 0;

  const foodCostPercent =
    totalRevenue > 0 && isFinite(totalRevenue) && isFinite(totalCOGS)
      ? (totalCOGS / totalRevenue) * 100
      : 0;

  const grossProfit = isFinite(totalRevenue) && isFinite(totalCOGS) ? totalRevenue - totalCOGS : 0;

  // Ensure all values are finite numbers
  const safeAverageProfitMargin =
    isNaN(averageProfitMargin) || !isFinite(averageProfitMargin) ? 0 : averageProfitMargin;
  const safeFoodCostPercent =
    isNaN(foodCostPercent) || !isFinite(foodCostPercent) ? 0 : foodCostPercent;
  const safeGrossProfit = isNaN(grossProfit) || !isFinite(grossProfit) ? 0 : grossProfit;
  const safeTotalCOGS = isNaN(totalCOGS) || !isFinite(totalCOGS) ? 0 : totalCOGS;
  const safeTotalRevenue = isNaN(totalRevenue) || !isFinite(totalRevenue) ? 0 : totalRevenue;

  return {
    total_items: menuItems.length,
    total_dishes: dishCount,
    total_recipes: recipeCount,
    total_cogs: safeTotalCOGS,
    total_revenue: safeTotalRevenue,
    gross_profit: safeGrossProfit,
    average_profit_margin: safeAverageProfitMargin,
    food_cost_percent: safeFoodCostPercent,
  };
}
