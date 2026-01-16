import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Validate recipe update request.
 *
 * @param {string} recipeId - Recipe ID
 * @param {string} name - Recipe name
 * @returns {Promise<NextResponse | null>} Error response if validation fails, null if valid
 */
export async function validateRecipeUpdate(
  recipeId: string,
  name: string,
): Promise<NextResponse | null> {
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
  const existingName = (existingRecipe as any).name || (existingRecipe as any).recipe_name;
  if (name.trim().toLowerCase() !== existingName.toLowerCase()) {
    const { data: conflictingRecipes, error: conflictError } = await supabaseAdmin
      .from('recipes')
      .select('id, name')
      .ilike('name', name.trim())
      .neq('id', recipeId);

    if (conflictError) {
      logger.error('[Recipes API] Error checking for name conflicts:', {
        error: conflictError.message,
        code: conflictError.code,
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

  return null; // Validation passed
}
