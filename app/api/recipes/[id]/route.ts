import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { buildUpdateData } from './helpers/buildUpdateData';
import { deleteRecipeAndCleanup } from './helpers/deleteRecipeAndCleanup';
import { validateRecipeDelete } from './helpers/validateRecipeDelete';
import { validateRecipeUpdate } from './helpers/validateRecipeUpdate';
import { aggregateRecipeAllergens } from '@/lib/allergens/allergen-aggregation';
import { aggregateRecipeDietaryStatus } from '@/lib/dietary/dietary-aggregation';
import {
  invalidateRecipeAllergenCache,
  invalidateDishesWithRecipe,
} from '@/lib/allergens/cache-invalidation';
import { invalidateMenuItemsWithRecipe } from '@/lib/menu-pricing/cache-invalidation';
import { consolidateAllergens } from '@/lib/allergens/australian-allergens';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data: recipe, error: fetchError } = await supabaseAdmin
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();
    if (fetchError || !recipe) {
      return NextResponse.json(ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Always aggregate allergens and dietary status (even if cached)
    // This ensures we have the latest data from ingredients
    const [allergens, dietaryStatus] = await Promise.all([
      aggregateRecipeAllergens(recipeId),
      aggregateRecipeDietaryStatus(recipeId),
    ]);

    // Consolidate allergens for validation
    const consolidatedAllergens = consolidateAllergens(allergens || []);

    // Runtime validation: check for conflict between vegan status and allergens
    let validatedIsVegan = dietaryStatus?.isVegan ?? null;
    if (validatedIsVegan === true) {
      const hasMilk = consolidatedAllergens.includes('milk');
      const hasEggs = consolidatedAllergens.includes('eggs');
      if (hasMilk || hasEggs) {
        logger.warn(
          '[Recipes API] Runtime validation: vegan=true but allergens include milk/eggs',
          {
            recipeId,
            recipeName: recipe.recipe_name,
            allergens: consolidatedAllergens,
            hasMilk,
            hasEggs,
          },
        );
        validatedIsVegan = false;
      }
    }

    // Update recipe cache with aggregated allergens if they differ
    if (
      allergens &&
      allergens.length > 0 &&
      (!recipe.allergens || JSON.stringify(recipe.allergens) !== JSON.stringify(allergens))
    ) {
      // Update cache in background (don't await)
      supabaseAdmin
        .from('recipes')
        .update({ allergens })
        .eq('id', recipeId)
        .then(({ error }) => {
          if (error) {
            logger.warn('[Recipes API] Failed to cache aggregated allergens:', {
              recipeId,
              error: error.message,
            });
          }
        });
    }

    return NextResponse.json({
      success: true,
      recipe: {
        ...recipe,
        allergens: consolidatedAllergens,
        is_vegetarian: dietaryStatus?.isVegetarian ?? null,
        is_vegan: validatedIsVegan,
        dietary_confidence: dietaryStatus?.confidence ?? null,
        dietary_method: dietaryStatus?.method ?? null,
      },
    });
  } catch (err) {
    logger.error('[Recipes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes/[id]', method: 'GET' },
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

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;
    const body = await request.json();
    const { name } = body;

    const validationError = await validateRecipeUpdate(recipeId, name);
    if (validationError) return validationError;

    // Get user email for change tracking
    let userEmail: string | null = null;
    try {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      userEmail = (token?.email as string) || null;
    } catch (tokenError) {
      // Continue without user email if auth fails (for development)
      logger.warn('[Recipes API] Could not get user email for change tracking:', tokenError);
    }

    // Fetch current recipe to detect changes
    let currentRecipe: any = null;
    try {
      const { data } = await supabaseAdmin!
        .from('recipes')
        .select('recipe_name, yield, instructions')
        .eq('id', recipeId)
        .single();
      currentRecipe = data;
    } catch (err) {
      logger.warn('[Recipes API] Could not fetch current recipe for change detection:', err);
    }

    const updateData = buildUpdateData(body);
    const ingredientsChanged = body.ingredients !== undefined;
    const yieldChanged = body.yield !== undefined;

    // Detect changes
    const changeDetails: any = {};
    let changeType = 'updated';

    if (currentRecipe) {
      if (
        yieldChanged &&
        updateData.yield !== undefined &&
        updateData.yield !== currentRecipe.yield
      ) {
        changeType = 'yield_changed';
        changeDetails.yield = {
          field: 'yield',
          before: currentRecipe.yield,
          after: updateData.yield,
          change: updateData.yield > currentRecipe.yield ? 'increased' : 'decreased',
        };
      }

      if (
        updateData.instructions !== undefined &&
        updateData.instructions !== currentRecipe.instructions
      ) {
        changeDetails.instructions = {
          field: 'instructions',
          change: 'instructions updated',
        };
      }
    }

    if (ingredientsChanged) {
      changeType = 'ingredients_changed';
      changeDetails.ingredients = {
        field: 'ingredients',
        change: 'ingredients updated',
      };
    }

    const { data: updatedRecipe, error: updateError } = await supabaseAdmin!
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

    const recipeName = updatedRecipe.recipe_name || currentRecipe?.recipe_name || 'Unknown Recipe';

    if (ingredientsChanged) {
      Promise.all([
        invalidateRecipeAllergenCache(recipeId),
        invalidateDishesWithRecipe(recipeId),
      ]).catch(err => {
        logger.error('[Recipes API] Error invalidating allergen caches:', err);
      });
    }
    // Invalidate cached recommended prices if ingredients or yield changed (affects per-serving price)
    // Also track changes for locked menus
    if (ingredientsChanged || yieldChanged) {
      invalidateMenuItemsWithRecipe(
        recipeId,
        recipeName,
        changeType,
        changeDetails,
        userEmail,
      ).catch(err => {
        logger.error('[Recipes API] Error invalidating menu pricing cache:', err);
      });
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

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }
    const validationError = await validateRecipeDelete(recipeId);
    if (validationError) return validationError;
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
