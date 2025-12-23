import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { z } from 'zod';

const bulkDeleteRecipesSchema = z.object({
  recipeIds: z.array(z.string().uuid('Recipe ID must be a valid UUID')).min(1, 'recipeIds array is required and must contain at least one recipe ID'),
});
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Bulk Delete Recipes API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const zodValidation = bulkDeleteRecipesSchema.safeParse(body);
    if (!zodValidation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          zodValidation.error.issues[0]?.message || 'Invalid request data',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { recipeIds } = zodValidation.data;

    if (!supabaseAdmin) {
      return NextResponse.json(ApiErrorHandler.createError('Database connection not available', 'SERVER_ERROR', 500), { status: 500 });
    }

    // Check if any recipes are used in menu dishes or dish_recipes before attempting deletion
    const [menuDishesResult, dishRecipesResult] = await Promise.all([
      supabaseAdmin.from('menu_dishes').select('recipe_id').in('recipe_id', recipeIds).limit(1),
      supabaseAdmin.from('dish_recipes').select('recipe_id').in('recipe_id', recipeIds).limit(1),
    ]);

    if (menuDishesResult.error) {
      logger.error('Error checking menu dishes usage:', menuDishesResult.error);
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to check recipe usage', 'DATABASE_ERROR', 500, {
          details: menuDishesResult.error.message,
        }),
        { status: 500 },
      );
    }

    if (dishRecipesResult.error) {
      logger.error('Error checking dish_recipes usage:', dishRecipesResult.error);
      // Don't fail if dish_recipes table doesn't exist
      if (!dishRecipesResult.error.message.includes('does not exist')) {
        return NextResponse.json(
          ApiErrorHandler.createError('Failed to check recipe usage', 'DATABASE_ERROR', 500, {
            details: dishRecipesResult.error.message,
          }),
          { status: 500 },
        );
      }
    }

    const usedInMenuDishes = menuDishesResult.data && menuDishesResult.data.length > 0;
    const usedInDishRecipes = dishRecipesResult.data && dishRecipesResult.data.length > 0;

    if (usedInMenuDishes || usedInDishRecipes) {
      const usage = [];
      if (usedInMenuDishes) usage.push('menu dishes');
      if (usedInDishRecipes) usage.push('dishes');
      return NextResponse.json(
        ApiErrorHandler.createError(
          `One or more recipes are used in ${usage.join(' and ')}. Please remove them from all ${usage.join(' and ')} first.`,
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Delete recipe ingredients first (child records)
    const { error: ingredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .delete()
      .in('recipe_id', recipeIds);

    if (ingredientsError) {
      logger.error('Error deleting recipe ingredients:', ingredientsError);
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to delete recipe ingredients', 'DATABASE_ERROR', 500, {
          details: ingredientsError.message,
        }),
        { status: 500 },
      );
    }

    // Delete recipes
    const { error: recipesError } = await supabaseAdmin
      .from('recipes')
      .delete()
      .in('id', recipeIds);

    if (recipesError) {
      logger.error('Error deleting recipes:', recipesError);
      // Check if it's a foreign key constraint error
      if (
        recipesError.message.includes('foreign key constraint') ||
        recipesError.message.includes('menu_dishes') ||
        recipesError.message.includes('dish_recipes')
      ) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'One or more recipes are used in dishes. Please remove them from all dishes first.',
            'VALIDATION_ERROR',
            400,
          ),
          { status: 400 },
        );
      }
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to delete recipes', 'DATABASE_ERROR', 500, {
          details: recipesError.message,
        }),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `${recipeIds.length} recipe${recipeIds.length > 1 ? 's' : ''} deleted successfully`,
    });
  } catch (err) {
    logger.error('Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500, {
        details: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500 },
    );
  }
}
