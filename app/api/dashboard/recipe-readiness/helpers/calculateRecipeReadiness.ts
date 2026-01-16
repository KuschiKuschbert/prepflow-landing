import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { isTableNotFound } from './checkTableExists';

/**
 * Calculate recipe readiness statistics.
 *
 * @param {Array} recipes - Recipe list
 * @returns {Promise<Object>} Recipe readiness statistics
 */
export async function calculateRecipeReadiness(recipes: unknown[]) {
  if (!recipes || recipes.length === 0) {
    return {
      completeRecipes: 0,
      incompleteRecipes: 0,
      recipesWithoutCost: 0,
      mostUsedRecipes: [],
      totalRecipes: 0,
    };
  }

  if (!supabaseAdmin) {
    logger.error('[Dashboard Recipe Readiness] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Fetch all recipe ingredients to check completeness
  const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select('recipe_id');

  if (recipeIngredientsError) {
    if (isTableNotFound(recipeIngredientsError)) {
      logger.warn('recipe_ingredients table not found, treating all recipes as incomplete');
      // Continue with empty recipeIngredients array
    } else {
      logger.error('[Dashboard Recipe Readiness] Error fetching recipe ingredients:', {
        error: recipeIngredientsError.message,
        code: (recipeIngredientsError as unknown).code,
      });
      throw ApiErrorHandler.fromSupabaseError(recipeIngredientsError, 500);
    }
  }

  // Create set of recipe IDs that have ingredients
  const recipesWithIngredients = new Set(
    (recipeIngredients || [])
      .map((ri: unknown) => ri.recipe_id)
      .filter((id: unknown) => id != null)
      .map((id: unknown) => String(id).trim()),
  );

  // Count complete/incomplete recipes
  const completeRecipes = (recipes || []).filter(
    (r: unknown) => r.id != null && recipesWithIngredients.has(String(r.id).trim()),
  ).length;

  const incompleteRecipes = (recipes || []).filter(
    (r: unknown) => r.id == null || !recipesWithIngredients.has(String(r.id).trim()),
  ).length;

  // Fetch menu dishes for cost calculation
  let menuDishes: unknown[] = [];
  const { data: menuDishesData, error: menuDishesError } = await supabaseAdmin
    .from('menu_dishes')
    .select('recipe_id, selling_price')
    .not('recipe_id', 'is', null);

  if (menuDishesError && !isTableNotFound(menuDishesError)) {
    logger.warn('Could not fetch menu dishes, treating as empty');
  } else if (!menuDishesError) {
    menuDishes = menuDishesData || [];
  }

  // Count recipes without costs
  const recipesWithCosts = new Set(
    (menuDishes || [])
      .filter((dish: unknown) => dish.recipe_id && dish.selling_price && dish.selling_price > 0)
      .map((dish: unknown) => String(dish.recipe_id).trim()),
  );

  const recipesWithoutCost = (recipes || []).filter(
    (r: unknown) => r.id == null || !recipesWithCosts.has(String(r.id).trim()),
  ).length;

  // Get most used recipes
  const recipeUsageCount = new Map<string, number>();
  menuDishes.forEach((dish: unknown) => {
    if (dish && dish.recipe_id) {
      const normalizedId = String(dish.recipe_id).trim();
      recipeUsageCount.set(normalizedId, (recipeUsageCount.get(normalizedId) || 0) + 1);
    }
  });

  const mostUsedRecipes = Array.from(recipeUsageCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([recipeId, count]) => {
      const recipe = (recipes || []).find(
        (r: unknown) => r.id != null && String(r.id).trim() === recipeId,
      );
      return {
        id: recipeId,
        name: recipe?.name || 'Unknown',
        usageCount: count,
      };
    });

  return {
    completeRecipes,
    incompleteRecipes,
    recipesWithoutCost,
    mostUsedRecipes,
    totalRecipes: recipes?.length || 0,
  };
}
