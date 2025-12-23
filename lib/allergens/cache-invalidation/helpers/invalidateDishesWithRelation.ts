import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { invalidateDietaryCache } from '@/lib/dietary/dietary-aggregation';

/**
 * Invalidate cached allergens for all dishes containing a specific recipe
 */
export async function invalidateDishesWithRecipe(recipeId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Cache Invalidation] Supabase admin client not available');
    return;
  }

  try {
    const { data: dishRecipes, error: fetchError } = await supabaseAdmin
      .from('dish_recipes')
      .select('dish_id')
      .eq('recipe_id', recipeId);

    if (fetchError) {
      return;
    }

    if (!dishRecipes || dishRecipes.length === 0) {
      return;
    }

    const dishIds = [...new Set(dishRecipes.map(dr => dr.dish_id))];
    const { error } = await supabaseAdmin
      .from('dishes')
      .update({ allergens: null })
      .in('id', dishIds);

    if (error) {
      logger.error('[Cache Invalidation] Failed to invalidate dishes allergen cache:', {
        recipeId,
        dishIds,
        error: error.message,
      });
    } else {
      logger.dev(
        `[Cache Invalidation] Invalidated allergen cache for ${dishIds.length} dishes containing recipe ${recipeId}`,
      );
      await Promise.all(dishIds.map(id => invalidateDietaryCache(id, 'dish')));
    }
  } catch (err) {
    logger.error('[Cache Invalidation] Error invalidating dishes with recipe:', err);
  }
}

/**
 * Invalidate cached allergens for all dishes containing a specific ingredient
 */
export async function invalidateDishesWithIngredient(ingredientId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Cache Invalidation] Supabase admin client not available');
    return;
  }

  try {
    const { data: dishIngredients, error: fetchError } = await supabaseAdmin
      .from('dish_ingredients')
      .select('dish_id')
      .eq('ingredient_id', ingredientId);

    if (fetchError) {
      return;
    }

    if (!dishIngredients || dishIngredients.length === 0) {
      return;
    }

    const dishIds = [...new Set(dishIngredients.map(di => di.dish_id))];
    const { error } = await supabaseAdmin
      .from('dishes')
      .update({ allergens: null })
      .in('id', dishIds);

    if (error) {
      logger.error('[Cache Invalidation] Failed to invalidate dishes allergen cache:', {
        ingredientId,
        dishIds,
        error: error.message,
      });
    } else {
      logger.dev(
        `[Cache Invalidation] Invalidated allergen cache for ${dishIds.length} dishes containing ingredient ${ingredientId}`,
      );
      await Promise.all(dishIds.map(id => invalidateDietaryCache(id, 'dish')));
    }
  } catch (err) {
    logger.error('[Cache Invalidation] Error invalidating dishes with ingredient:', err);
  }
}
