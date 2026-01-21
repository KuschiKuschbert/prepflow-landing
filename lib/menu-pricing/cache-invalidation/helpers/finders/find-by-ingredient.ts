import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

// Local types for query results
interface MenuItemRecord {
  id: string;
  menu_id: string;
}

interface DishIngredientRecord {
  dish_id: string;
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
    let dishIngredients: DishIngredientRecord[] | null = null;
    let dishError: { message: string; code?: string } | null = null;
    try {
      const result = await Promise.resolve(dishIngredientsQuery);
      dishIngredients = result.data as DishIngredientRecord[] | null;
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
      ? [...new Set(dishIngredients.map((di: DishIngredientRecord) => di.dish_id))]
      : [];

    // Find menu items using these recipes or dishes
    const menuItemQueries: Promise<MenuItemRecord[]>[] = [];

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
