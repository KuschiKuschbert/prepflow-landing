/**
 * Helper to fetch and group dish_ingredients for batch cost calculation.
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { DishIngredientRecord } from '../../../types';

/**
 * Fetch dish_ingredients and group by dish_id.
 */
export async function fetchDishIngredients(
  dishIds: string[],
): Promise<Map<string, DishIngredientRecord[]>> {
  if (!supabaseAdmin) {
    return new Map();
  }

  const { data: allDishIngredients, error: dishIngredientsError } = await supabaseAdmin
    .from('dish_ingredients')
    .select(
      `
      dish_id,
      quantity,
      unit,
      ingredients (
        cost_per_unit,
        cost_per_unit_incl_trim,
        trim_peel_waste_percentage,
        yield_percentage,
        category
      )
    `,
    )
    .in('dish_id', dishIds);

  if (dishIngredientsError) {
    logger.error('[Dishes API] Error fetching dish ingredients for batch:', {
      error: dishIngredientsError,
    });
    return new Map();
  }

  // Group dish_ingredients by dish_id
  const dishIngredientsMap = new Map<string, DishIngredientRecord[]>();
  ((allDishIngredients as any[]) || []).forEach(di => {
    if (!dishIngredientsMap.has(di.dish_id)) {
      dishIngredientsMap.set(di.dish_id, []);
    }
    dishIngredientsMap.get(di.dish_id)!.push(di as DishIngredientRecord);
  });

  return dishIngredientsMap;
}
