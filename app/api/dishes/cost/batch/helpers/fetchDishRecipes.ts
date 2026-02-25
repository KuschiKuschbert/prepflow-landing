/**
 * Helper to fetch and group dish_recipes for batch cost calculation.
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { DishRecipeRecord } from '../../../types';

/**
 * Fetch dish_recipes and group by dish_id.
 */
export async function fetchDishRecipes(
  dishIds: string[],
): Promise<Map<string, DishRecipeRecord[]>> {
  if (!supabaseAdmin) {
    return new Map();
  }

  const { data: allDishRecipes, error: dishRecipesError } = await supabaseAdmin
    .from('dish_recipes')
    .select(
      `
      dish_id,
      recipe_id,
      quantity,
      recipes (
        id,
        recipe_name
      )
    `,
    )
    .in('dish_id', dishIds);

  if (dishRecipesError) {
    logger.error('[Dishes API] Error fetching dish recipes for batch:', {
      error: dishRecipesError,
    });
    return new Map();
  }

  // Group dish_recipes by dish_id
  const dishRecipesMap = new Map<string, DishRecipeRecord[]>();
  (allDishRecipes || []).forEach(dr => {
    if (!dishRecipesMap.has(dr.dish_id)) {
      dishRecipesMap.set(dr.dish_id, []);
    }
    // Supabase query should return correct shape, or we cast to unknown first
    dishRecipesMap.get(dr.dish_id)!.push(dr as unknown as DishRecipeRecord);
  });

  return dishRecipesMap;
}
