/**
 * Cache invalidation utilities for allergen and dietary caches
 * Invalidates cached allergens when ingredients, recipes, or dishes change
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Invalidate cached allergens for a specific recipe
 * Called when recipe ingredients change
 */
export async function invalidateRecipeAllergenCache(recipeId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Cache Invalidation] Supabase admin client not available');
    return;
  }

  try {
    // Clear cached allergens for the recipe
    const { error } = await supabaseAdmin
      .from('recipes')
      .update({ allergens: null })
      .eq('id', recipeId);

    if (error) {
      logger.error('[Cache Invalidation] Failed to invalidate recipe allergen cache:', {
        recipeId,
        error: error.message,
      });
    } else {
      logger.dev(`[Cache Invalidation] Invalidated allergen cache for recipe ${recipeId}`);
    }
  } catch (err) {
    logger.error('[Cache Invalidation] Error invalidating recipe allergen cache:', err);
  }
}

/**
 * Invalidate cached allergens for all recipes containing a specific ingredient
 * Called when ingredient allergens change
 */
export async function invalidateRecipesWithIngredient(ingredientId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Cache Invalidation] Supabase admin client not available');
    return;
  }

  try {
    // Find all recipes that use this ingredient
    const { data: recipeIngredients, error: fetchError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id')
      .eq('ingredient_id', ingredientId);

    if (fetchError) {
      logger.error('[Cache Invalidation] Failed to fetch recipes with ingredient:', {
        ingredientId,
        error: fetchError.message,
      });
      return;
    }

    if (!recipeIngredients || recipeIngredients.length === 0) {
      return;
    }

    const recipeIds = [...new Set(recipeIngredients.map(ri => ri.recipe_id))];

    // Clear cached allergens for all affected recipes
    const { error } = await supabaseAdmin
      .from('recipes')
      .update({ allergens: null })
      .in('id', recipeIds);

    if (error) {
      logger.error('[Cache Invalidation] Failed to invalidate recipes allergen cache:', {
        ingredientId,
        recipeIds,
        error: error.message,
      });
    } else {
      logger.dev(
        `[Cache Invalidation] Invalidated allergen cache for ${recipeIds.length} recipes containing ingredient ${ingredientId}`,
      );
    }
  } catch (err) {
    logger.error('[Cache Invalidation] Error invalidating recipes with ingredient:', err);
  }
}

/**
 * Invalidate cached allergens for a specific dish
 * Called when dish recipes or ingredients change
 */
export async function invalidateDishAllergenCache(dishId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Cache Invalidation] Supabase admin client not available');
    return;
  }

  try {
    // Check if dishes table exists
    const { error: checkError } = await supabaseAdmin
      .from('dishes')
      .select('id')
      .eq('id', dishId)
      .limit(1);

    if (checkError) {
      // Dishes table might not exist, skip silently
      return;
    }

    // Clear cached allergens for the dish
    const { error } = await supabaseAdmin
      .from('dishes')
      .update({ allergens: null })
      .eq('id', dishId);

    if (error) {
      logger.error('[Cache Invalidation] Failed to invalidate dish allergen cache:', {
        dishId,
        error: error.message,
      });
    } else {
      logger.dev(`[Cache Invalidation] Invalidated allergen cache for dish ${dishId}`);
    }
  } catch (err) {
    logger.error('[Cache Invalidation] Error invalidating dish allergen cache:', err);
  }
}

/**
 * Invalidate cached allergens for all dishes containing a specific recipe
 * Called when recipe allergens change
 */
export async function invalidateDishesWithRecipe(recipeId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Cache Invalidation] Supabase admin client not available');
    return;
  }

  try {
    // Check if dish_recipes table exists
    const { data: dishRecipes, error: fetchError } = await supabaseAdmin
      .from('dish_recipes')
      .select('dish_id')
      .eq('recipe_id', recipeId);

    if (fetchError) {
      // dish_recipes table might not exist, skip silently
      return;
    }

    if (!dishRecipes || dishRecipes.length === 0) {
      return;
    }

    const dishIds = [...new Set(dishRecipes.map(dr => dr.dish_id))];

    // Clear cached allergens for all affected dishes
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
    }
  } catch (err) {
    logger.error('[Cache Invalidation] Error invalidating dishes with recipe:', err);
  }
}

/**
 * Invalidate cached allergens for all dishes containing a specific ingredient
 * Called when ingredient allergens change
 */
export async function invalidateDishesWithIngredient(ingredientId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Cache Invalidation] Supabase admin client not available');
    return;
  }

  try {
    // Check if dish_ingredients table exists
    const { data: dishIngredients, error: fetchError } = await supabaseAdmin
      .from('dish_ingredients')
      .select('dish_id')
      .eq('ingredient_id', ingredientId);

    if (fetchError) {
      // dish_ingredients table might not exist, skip silently
      return;
    }

    if (!dishIngredients || dishIngredients.length === 0) {
      return;
    }

    const dishIds = [...new Set(dishIngredients.map(di => di.dish_id))];

    // Clear cached allergens for all affected dishes
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
    }
  } catch (err) {
    logger.error('[Cache Invalidation] Error invalidating dishes with ingredient:', err);
  }
}
