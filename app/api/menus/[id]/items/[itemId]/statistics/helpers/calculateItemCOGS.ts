/**
 * Helper for calculating COGS for a menu item
 */

import { logger } from '@/lib/logger';
import { calculateDishCost } from '../../../../statistics/helpers/calculateDishCost';
import { calculateRecipeCost } from '../../../../statistics/helpers/calculateRecipeCost';
import { StatisticsMenuItem } from './calculateStatistics';

export interface COGSCalculationResult {
  cogs: number;
  error: string | null;
}

/**
 * Calculates COGS for a menu item
 *
 * @param {StatisticsMenuItem} menuItem - Menu item data
 * @returns {Promise<COGSCalculationResult>} COGS and error if any
 */
export async function calculateItemCOGS(
  menuItem: StatisticsMenuItem,
): Promise<COGSCalculationResult> {
  let cogs = 0;
  let cogsError: string | null = null;
  const dish = Array.isArray(menuItem.dishes) ? menuItem.dishes[0] : menuItem.dishes;
  const _recipe = Array.isArray(menuItem.recipes) ? menuItem.recipes[0] : menuItem.recipes;

  try {
    if (menuItem.dish_id && dish) {
      cogs = await calculateDishCost(dish.id);
      logger.dev('[Menu Item Statistics API] Dish COGS calculated', {
        dishId: dish.id,
        cogs,
      });
    } else if (menuItem.recipe_id) {
      // calculateRecipeCost(recipeId, 1) already returns per-serving cost
      // (since calculateRecipeCost divides by yield internally)
      cogs = await calculateRecipeCost(menuItem.recipe_id, 1);
      logger.dev('[Menu Item Statistics API] Recipe COGS calculated', {
        recipeId: menuItem.recipe_id,
        cogs,
      });
    } else {
      cogsError = 'No dish_id or recipe_id found on menu item';
      logger.warn('[Menu Item Statistics API] Cannot calculate COGS:', {
        menuItemId: menuItem.id,
        dish_id: menuItem.dish_id,
        recipe_id: menuItem.recipe_id,
      });
    }

    // Validate COGS calculation
    if (cogs === 0 && !cogsError) {
      cogsError = 'COGS calculation returned 0 - may indicate missing ingredients or cost data';
      logger.warn('[Menu Item Statistics API] COGS is 0:', {
        menuItemId: menuItem.id,
        dish_id: menuItem.dish_id,
        recipe_id: menuItem.recipe_id,
      });
    }
  } catch (err) {
    cogsError = err instanceof Error ? err.message : 'Unknown error calculating COGS';
    logger.error('[Menu Item Statistics API] Error calculating COGS:', {
      menuItemId: menuItem.id,
      dish_id: menuItem.dish_id,
      recipe_id: menuItem.recipe_id,
      error: err,
    });
  }

  return { cogs, error: cogsError };
}
