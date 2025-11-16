import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

async function checkRecipeUsage(recipeId: string) {
  const [menuDishesResult, dishRecipesResult] = await Promise.all([
    supabaseAdmin
      .from('menu_dishes')
      .select('id, name, recipe_id, created_at, updated_at')
      .eq('recipe_id', recipeId),
    supabaseAdmin.from('dish_recipes').select('dish_id, recipe_id').eq('recipe_id', recipeId),
  ]);
  return { menuDishesResult, dishRecipesResult };
}

async function getDishNames(dishIds: string[]): Promise<string[]> {
  if (dishIds.length === 0) return [];
  const { data: dishes } = await supabaseAdmin.from('dishes').select('dish_name').in('id', dishIds);
  return dishes ? dishes.map((d: { dish_name: string }) => d.dish_name || 'Unknown') : [];
}

async function deleteRecipeAndCleanup(recipeId: string) {
  const { error: ingredientsError } = await supabaseAdmin
    .from('recipe_ingredients')
    .delete()
    .eq('recipe_id', recipeId);
  if (ingredientsError) throw ingredientsError;
  const { error: cleanupError } = await supabaseAdmin
    .from('menu_dishes')
    .update({ recipe_id: null })
    .eq('recipe_id', recipeId);
  if (cleanupError)
    logger.warn('[RecipeDelete] Warning: Could not clean up menu_dishes references:', {
      error: cleanupError.message,
      context: { endpoint: '/api/recipes/[id]', operation: 'DELETE', recipeId },
    });
  const { error: recipeError } = await supabaseAdmin.from('recipes').delete().eq('id', recipeId);
  if (recipeError) throw recipeError;
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;
    const body = await request.json();
    const { name, yield: dishPortions, yield_unit, category, description, instructions } = body;

    if (!recipeId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe name is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if recipe exists
    const { data: existingRecipe, error: checkError } = await supabaseAdmin
      .from('recipes')
      .select('id, name')
      .eq('id', recipeId)
      .single();

    if (checkError || !existingRecipe) {
      const apiError = checkError
        ? ApiErrorHandler.fromSupabaseError(checkError, 404)
        : ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404, { recipeId });
      return NextResponse.json(apiError, { status: apiError.status || 404 });
    }

    // Check if new name conflicts with another recipe (case-insensitive)
    if (name.trim().toLowerCase() !== existingRecipe.name.toLowerCase()) {
      const { data: conflictingRecipes, error: conflictError } = await supabaseAdmin
        .from('recipes')
        .select('id, name')
        .ilike('name', name.trim())
        .neq('id', recipeId);

      if (conflictError) {
        logger.error('[Recipes API] Error checking for name conflicts:', {
          error: conflictError.message,
          code: (conflictError as any).code,
          context: { endpoint: '/api/recipes/[id]', operation: 'PUT', recipeId },
        });

        const apiError = ApiErrorHandler.fromSupabaseError(conflictError, 500);
        return NextResponse.json(apiError, { status: apiError.status || 500 });
      }

      if (conflictingRecipes && conflictingRecipes.length > 0) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'A recipe with this name already exists. Please choose a different name.',
            'VALIDATION_ERROR',
            400,
          ),
          { status: 400 },
        );
      }
    }

    // Update recipe
    const updateData: {
      name?: string;
      yield?: number;
      yield_unit?: string;
      category?: string;
      description?: string | null;
      instructions?: string | null;
      updated_at?: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name.trim();
    if (dishPortions !== undefined) updateData.yield = dishPortions;
    if (yield_unit !== undefined) updateData.yield_unit = yield_unit;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (instructions !== undefined) updateData.instructions = instructions?.trim() || null;

    const { data: updatedRecipe, error: updateError } = await supabaseAdmin
      .from('recipes')
      .update(updateData)
      .eq('id', recipeId)
      .select()
      .single();

    if (updateError) {
      logger.error('[Recipes API] Database error updating recipe:', {
        error: updateError.message,
        code: (updateError as any).code,
        context: { endpoint: '/api/recipes/[id]', operation: 'PUT', recipeId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(updateError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      recipe: updatedRecipe,
    });
  } catch (err) {
    logger.error('[Recipes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes/[id]', method: 'PUT' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;

    if (!recipeId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
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
    try {
      await deleteRecipeAndCleanup(recipeId);
    } catch (error: any) {
      logger.error('[RecipeDelete] Error deleting recipe:', {
        error: error.message,
        code: error.code,
        context: { endpoint: '/api/recipes/[id]', operation: 'DELETE', recipeId },
      });
      if (
        error.message?.includes('foreign key constraint') ||
        error.message?.includes('menu_dishes') ||
        error.message?.includes('dish_recipes') ||
        error.code === '23503'
      ) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Recipe is used in dishes. Please remove it from all dishes first.',
            'FOREIGN_KEY_VIOLATION',
            400,
          ),
          { status: 400 },
        );
      }
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Recipe deleted successfully',
    });
  } catch (err) {
    logger.error('[Recipes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes/[id]', method: 'DELETE' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
