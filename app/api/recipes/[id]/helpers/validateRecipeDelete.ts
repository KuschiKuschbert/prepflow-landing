import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRecipeUsage } from './checkRecipeUsage';
import { getDishNames } from './getDishNames';

/**
 * Validate recipe deletion and check usage.
 *
 * @param {string} recipeId - Recipe ID to validate
 * @returns {Promise<NextResponse | null>} Error response if validation fails, null if valid
 */
export async function validateRecipeDelete(recipeId: string): Promise<NextResponse | null> {
  if (!recipeId) {
    return NextResponse.json(
      ApiErrorHandler.createError('Recipe ID is required', 'VALIDATION_ERROR', 400),
      { status: 400 },
    );
  }

  // Check if recipe is used in menu dishes or dish_recipes before attempting deletion
  const { menuDishesResult, dishRecipesResult } = await checkRecipeUsage(recipeId);

  if (menuDishesResult.error) {
    logger.error('[Recipes API] Error checking menu dishes usage:', {
      error: menuDishesResult.error.message,
      code: (menuDishesResult.error as any).code,
      context: { endpoint: '/api/recipes/[id]', operation: 'DELETE', recipeId },
    });

    const apiError = ApiErrorHandler.fromSupabaseError(menuDishesResult.error, 500);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }

  if (dishRecipesResult.error) {
    // Don't fail if dish_recipes table doesn't exist
    if (!dishRecipesResult.error.message.includes('does not exist')) {
      logger.error('[Recipes API] Error checking dish_recipes usage:', {
        error: dishRecipesResult.error.message,
        code: (dishRecipesResult.error as any).code,
        context: { endpoint: '/api/recipes/[id]', operation: 'DELETE', recipeId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dishRecipesResult.error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }
  }

  const usedInMenuDishes = menuDishesResult.data && menuDishesResult.data.length > 0;
  const usedInDishRecipes = dishRecipesResult.data && dishRecipesResult.data.length > 0;

  logger.debug('[RecipeDelete] Recipe usage check:', {
    recipeId,
    usedInMenuDishes,
    usedInDishRecipes,
    menuDishesCount: menuDishesResult.data?.length || 0,
    dishRecipesCount: dishRecipesResult.data?.length || 0,
  });

  // Only block deletion if used in dish_recipes (the new dishes system)
  // menu_dishes references will be automatically cleaned up
  if (usedInDishRecipes) {
    const dishIds = dishRecipesResult.data.map((dr: { dish_id: string }) => dr.dish_id);
    const dishNames = await getDishNames(dishIds);
    const message =
      dishNames.length > 0
        ? `Cannot delete recipe. It is used in dishes: ${dishNames.join(', ')}. Please remove it from all dishes first.`
        : `Cannot delete recipe. It is used in dishes. Please remove it from all dishes first.`;
    return NextResponse.json(
      ApiErrorHandler.createError(message, 'VALIDATION_ERROR', 400, { dishNames }),
      { status: 400 },
    );
  }

  // If only used in menu_dishes (old system), we'll clean them up automatically
  if (usedInMenuDishes) {
    logger.debug(
      '[RecipeDelete] Recipe is only used in menu_dishes (old system), will clean up automatically',
    );
  }

  logger.debug('[RecipeDelete] Recipe not used in dishes, proceeding with deletion:', {
    recipeId,
  });

  return null; // Validation passed
}
