import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export async function fetchDishData(dishId: string) {
  if (!supabaseAdmin) {
    logger.error('[Square Cost Sync] Supabase admin client not available');
    return null;
  }

  const { data: dish, error: dishError } = await supabaseAdmin
    .from('dishes')
    .select('*')
    .eq('id', dishId)
    .single();

  if (dishError || !dish) {
    logger.error('[Square Cost Sync] Error fetching dish:', {
      error: dishError?.message,
      dishId,
    });
    return null;
  }
  return dish;
}

export async function fetchDishRecipes(dishId: string) {
  if (!supabaseAdmin) {
    logger.error('[Square Cost Sync] Supabase admin client not available');
    return null;
  }

  const { data: dishRecipes, error: dishRecipesError } = await supabaseAdmin
    .from('dish_recipes')
    .select(
      `
      quantity,
      recipes (
        id,
        recipe_name,
        recipe_ingredients (
          quantity,
          unit,
          ingredients (
            cost_per_unit,
            cost_per_unit_incl_trim,
            trim_peel_waste_percentage,
            yield_percentage,
            category
          )
        )
      )
    `,
    )
    .eq('dish_id', dishId);

  if (dishRecipesError) {
    logger.error('[Square Cost Sync] Error fetching dish recipes:', {
      error: dishRecipesError.message,
      dishId,
    });
    return null;
  }
  return dishRecipes;
}

export async function fetchDishIngredients(dishId: string) {
  if (!supabaseAdmin) {
    logger.error('[Square Cost Sync] Supabase admin client not available');
    return null;
  }

  const { data: dishIngredients, error: dishIngredientsError } = await supabaseAdmin
    .from('dish_ingredients')
    .select(
      `
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
    .eq('dish_id', dishId);

  if (dishIngredientsError) {
    logger.error('[Square Cost Sync] Error fetching dish ingredients:', {
      error: dishIngredientsError.message,
      dishId,
    });
    return null;
  }
  return dishIngredients;
}
