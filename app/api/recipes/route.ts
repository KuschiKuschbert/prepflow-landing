import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { buildQuery } from './helpers/buildQuery';
import { checkExistingRecipe } from './helpers/checkExistingRecipe';
import { createRecipe } from './helpers/createRecipe';
import { filterRecipes } from './helpers/filterRecipes';
import { updateRecipe } from './helpers/updateRecipe';
import { validateRequest } from './helpers/validateRequest';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const params = validateRequest(searchParams);
    const { data: recipes, error, count } = await buildQuery(supabaseAdmin, params);

    if (error) {
      logger.error('[Recipes API] Database error fetching recipes:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/recipes', operation: 'GET', table: 'recipes' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    const filteredRecipes = await filterRecipes(recipes || [], params.includeAllergens);

    return NextResponse.json({
      success: true,
      recipes: filteredRecipes,
      count: count || 0,
      page: params.page,
      pageSize: params.pageSize,
    });
  } catch (err) {
    logger.error('[Recipes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes', method: 'GET' },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, yield: dishPortions, yield_unit, category, description, instructions } = body;

    if (!name) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe name is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const recipeData = {
      yield: dishPortions || 1,
      yield_unit: yield_unit || 'servings',
      description: description || null,
      instructions: instructions || null,
    };

    // Check if recipe already exists
    const { recipe: existingRecipe, error: checkError } = await checkExistingRecipe(name);

    if (existingRecipe && !checkError) {
      // Update existing recipe
      const { recipe: updatedRecipe, error: updateError } = await updateRecipe(
        existingRecipe.id,
        recipeData,
      );

      if (updateError) {
        const apiError = ApiErrorHandler.fromSupabaseError(updateError, 500);
        return NextResponse.json(apiError, { status: apiError.status || 500 });
      }

      return NextResponse.json({ success: true, recipe: updatedRecipe, isNew: false });
    }

    // Create new recipe
    const { recipe: newRecipe, error: createError } = await createRecipe(name, recipeData);

    if (createError) {
      logger.error('[Recipes API] Database error creating recipe:', {
        error: createError.message,
        code: (createError as any).code,
        context: { endpoint: '/api/recipes', operation: 'POST', recipeName: name },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(createError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({ success: true, recipe: newRecipe, isNew: true });
  } catch (err) {
    logger.error('[Recipes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes', method: 'POST' },
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
