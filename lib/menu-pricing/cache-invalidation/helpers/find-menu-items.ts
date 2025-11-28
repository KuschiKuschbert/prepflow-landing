/**
 * Helpers to find menu items by recipe, dish, or ingredient.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Find menu items using a specific recipe.
 */
export async function findMenuItemsWithRecipe(
  recipeId: string,
): Promise<{ id: string; menu_id: string }[]> {
  if (!supabaseAdmin) {
    logger.error('[Menu Pricing Cache] Supabase admin client not available');
    return [];
  }

  const { data: menuItems, error: fetchError } = await supabaseAdmin
    .from('menu_items')
    .select('id, menu_id')
    .eq('recipe_id', recipeId);

  if (fetchError) {
    logger.error('[Menu Pricing Cache] Failed to fetch menu items with recipe:', {
      recipeId,
      error: fetchError.message,
    });
    return [];
  }

  return menuItems || [];
}

/**
 * Find menu items using a specific dish.
 */
export async function findMenuItemsWithDish(
  dishId: string,
): Promise<{ id: string; menu_id: string }[]> {
  if (!supabaseAdmin) {
    logger.error('[Menu Pricing Cache] Supabase admin client not available');
    return [];
  }

  const { data: menuItems, error: fetchError } = await supabaseAdmin
    .from('menu_items')
    .select('id, menu_id')
    .eq('dish_id', dishId);

  if (fetchError) {
    logger.error('[Menu Pricing Cache] Failed to fetch menu items with dish:', {
      dishId,
      error: fetchError.message,
    });
    return [];
  }

  return menuItems || [];
}

/**
 * Find menu items using recipes/dishes that contain a specific ingredient.
 */
export async function findMenuItemsWithIngredient(
  ingredientId: string,
): Promise<{ id: string; menu_id: string }[]> {
  if (!supabaseAdmin) {
    logger.error('[Menu Pricing Cache] Supabase admin client not available');
    return [];
  }

  try {
    // Find all recipes using this ingredient
    const { data: recipeIngredients, error: recipeError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id')
      .eq('ingredient_id', ingredientId);

    if (recipeError) {
      logger.error('[Menu Pricing Cache] Failed to fetch recipes with ingredient:', {
        ingredientId,
        error: recipeError.message,
      });
    }

    // Find all dishes using this ingredient directly
    const dishIngredientsQuery = supabaseAdmin
      .from('dish_ingredients')
      .select('dish_id')
      .eq('ingredient_id', ingredientId);

    // Wrap in Promise.resolve to handle PromiseLike
    let dishIngredients: any = null;
    let dishError: any = null;
    try {
      const result = await Promise.resolve(dishIngredientsQuery);
      dishIngredients = result.data;
      dishError = result.error;
    } catch {
      dishIngredients = null;
      dishError = null;
    }

    if (dishError && dishError.code !== '42P01') {
      // Ignore table doesn't exist error
      logger.error('[Menu Pricing Cache] Failed to fetch dishes with ingredient:', {
        ingredientId,
        error: dishError.message,
      });
    }

    const recipeIds = recipeIngredients
      ? [...new Set(recipeIngredients.map(ri => ri.recipe_id))]
      : [];
    const dishIds = dishIngredients
      ? [...new Set(dishIngredients.map((di: any) => di.dish_id))]
      : [];

    // Find menu items using these recipes or dishes
    const menuItemQueries: Promise<any>[] = [];

    if (recipeIds.length > 0) {
      menuItemQueries.push(
        Promise.resolve(
          supabaseAdmin.from('menu_items').select('id, menu_id').in('recipe_id', recipeIds),
        ).then(({ data }) => data || []),
      );
    }

    if (dishIds.length > 0) {
      menuItemQueries.push(
        Promise.resolve(
          supabaseAdmin.from('menu_items').select('id, menu_id').in('dish_id', dishIds),
        ).then(({ data }) => data || []),
      );
    }

    const menuItemResults = await Promise.all(menuItemQueries);
    return menuItemResults.flat();
  } catch (err) {
    logger.error('[Menu Pricing Cache] Error finding menu items with ingredient:', err);
    return [];
  }
}
