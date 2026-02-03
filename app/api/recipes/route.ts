/**
 * Recipes API Routes
 *
 * 📚 Square Integration: This route automatically triggers Square sync hooks after recipe
 * create/update operations. See `docs/SQUARE_API_REFERENCE.md` (Automatic Sync section) for details.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { triggerRecipeSync } from '@/lib/square/sync/hooks';
import { NextRequest, NextResponse } from 'next/server';
import { buildQuery } from './helpers/buildQuery';
import { checkExistingRecipe } from './helpers/checkExistingRecipe';
import { createRecipe } from './helpers/createRecipe';
import { filterRecipes } from './helpers/filterRecipes';
import { safeParseBody } from './helpers/parseBody';
import { createRecipeSchema, RecipeResponse } from './helpers/schemas';
import { updateRecipe } from './helpers/updateRecipe';
import { validateRequest } from './helpers/validateRequest';

import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';

export async function GET(request: NextRequest) {
  try {
    const { userId, supabase: supabaseAdmin } = await getAuthenticatedUser(request);

    const { searchParams } = new URL(request.url);
    const params = validateRequest(searchParams);

    // Override page size limit safely if needed, though validateRequest handles it now
    // But we need to ensure validateRequest allows 1000.

    const { data: recipes, error, count } = await buildQuery(supabaseAdmin, params, userId);

    if (error) {
      logger.error('[Recipes API] Database error fetching recipes:', {
        error: error.message,
        code: error.code,
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
    } satisfies RecipeResponse);
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
    const body = await safeParseBody(request);

    const validationResult = createRecipeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const recipeData = validationResult.data;

    const { userId, supabase: supabaseAdmin } = await getAuthenticatedUser(request);

    // Check if recipe already exists
    const { recipe: existingRecipe, error: checkError } = await checkExistingRecipe(
      recipeData.recipe_name,
    );

    if (existingRecipe && !checkError) {
      return await handleExistingRecipe(request, existingRecipe, recipeData);
    }

    // Create new recipe
    return await handleNewRecipe(request, recipeData, userId);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error('[Recipes API] Unexpected error:', {
      error: errorMessage,
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes', method: 'POST' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleExistingRecipe(request: NextRequest, existingRecipe: any, recipeData: any) {
  // Update existing recipe
  const { recipe: updatedRecipe, error: updateError } = await updateRecipe(
    existingRecipe.id,
    recipeData,
  );

  if (updateError) {
    const apiError = ApiErrorHandler.fromSupabaseError(updateError, 500);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }

  // Trigger Square sync hook (non-blocking)
  triggerSyncHook(request, existingRecipe.id, 'update');

  return NextResponse.json({
    success: true,
    recipe: updatedRecipe,
    isNew: false,
  } satisfies RecipeResponse);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleNewRecipe(request: NextRequest, recipeData: any, userId: string) {
  const { recipe: newRecipe, error: createError } = await createRecipe(
    recipeData.recipe_name,
    recipeData,
    userId,
  );

  if (createError) {
    const safeError = createError as { message: string; code?: string };
    logger.error('[Recipes API] Database error creating recipe:', {
      error: safeError.message || String(createError),
      code: safeError.code,
      context: { endpoint: '/api/recipes', operation: 'POST', recipeName: recipeData.name },
    });
    const apiError = ApiErrorHandler.fromSupabaseError(createError, 500);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }

  // Trigger Square sync hook (non-blocking)
  if (newRecipe) {
    triggerSyncHook(request, newRecipe.id, 'create');
  }

  return NextResponse.json({
    success: true,
    recipe: newRecipe,
    isNew: true,
  } satisfies RecipeResponse);
}

function triggerSyncHook(
  request: NextRequest,
  recipeId: string | number,
  action: 'create' | 'update',
) {
  (async () => {
    try {
      await triggerRecipeSync(request, recipeId.toString(), action);
    } catch (err) {
      logger.error('[Recipes API] Error triggering Square sync:', {
        error: err instanceof Error ? err.message : String(err),
        recipeId,
      });
    }
  })();
}
