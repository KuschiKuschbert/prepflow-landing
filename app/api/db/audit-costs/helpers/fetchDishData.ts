/**
 * Helper to fetch dish data for auditing.
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface DishData {
  id: string;
  dish_name: string;
  dish_recipes: Array<{
    recipe_id: string;
    quantity: number;
    recipes?: {
      id: string;
      recipe_name: string;
    };
  }>;
  dish_ingredients: Array<{
    id: string;
    quantity: number | string;
    unit: string;
    ingredients?: {
      id: string;
      ingredient_name: string;
      cost_per_unit: number;
      cost_per_unit_incl_trim: number;
      trim_peel_waste_percentage: number;
      yield_percentage: number;
      category: string;
    } | null;
  }>;
}

/**
 * Fetch dish data including recipes and ingredients.
 */
export async function fetchDishData(dishId: string): Promise<DishData | null> {
  if (!supabaseAdmin) {
    logger.error('[Audit Costs] Supabase admin client not available');
    return null;
  }

  try {
    // Fetch dish_recipes separately to avoid nested relation issues
    const { data: dishRecipesData, error: dishRecipesError } = await supabaseAdmin
      .from('dish_recipes')
      .select('recipe_id, quantity')
      .eq('dish_id', dishId);

    const { data: dishIngredientsData, error: dishIngredientsError } = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
        id,
        quantity,
        unit,
        ingredients (
          id,
          ingredient_name,
          cost_per_unit,
          cost_per_unit_incl_trim,
          trim_peel_waste_percentage,
          yield_percentage,
          category
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishRecipesError || dishIngredientsError) {
      logger.error('[Audit Costs] Error fetching dish data:', {
        dishId,
        dishRecipesError: dishRecipesError?.message,
        dishIngredientsError: dishIngredientsError?.message,
      });
      return null;
    }

    // Fetch recipe names separately
    const recipeIds = (dishRecipesData || []).map(dr => dr.recipe_id).filter(Boolean);
    const recipeNamesMap: Record<string, string> = {};
    if (recipeIds.length > 0) {
      const { data: recipesData, error: recipesError } = await supabaseAdmin
        .from('recipes')
        .select('id, recipe_name')
        .in('id', recipeIds);
      if (recipesError) {
        logger.warn('[Audit Costs] Error fetching recipe names:', {
          error: recipesError.message,
          recipeIds,
        });
      } else {
        (recipesData || []).forEach((r: any) => {
          recipeNamesMap[r.id] = r.recipe_name || 'Unknown';
        });
      }
    }

    // Map recipe names to dish_recipes
    const dishRecipesWithNames = (dishRecipesData || []).map(dr => ({
      ...dr,
      recipes: { id: dr.recipe_id, recipe_name: recipeNamesMap[dr.recipe_id] || 'Unknown' },
    }));

    // Fetch dish name
    const { data: dishData, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('dish_name')
      .eq('id', dishId)
      .single();
    if (dishError) {
      logger.error('[Audit Costs] Error fetching dish name:', {
        error: dishError.message,
        dishId,
      });
      return null;
    }

    return {
      id: dishId,
      dish_name: dishData?.dish_name || 'Unknown',
      dish_recipes: dishRecipesWithNames,
      dish_ingredients: (dishIngredientsData || []) as any,
    };
  } catch (err) {
    logger.error('[Audit Costs] Error fetching dish data:', err);
    return null;
  }
}
