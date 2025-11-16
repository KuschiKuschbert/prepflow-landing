import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { buildUpdateData } from './helpers/buildUpdateData';
import { deleteRecipeAndCleanup } from './helpers/deleteRecipeAndCleanup';
import { validateRecipeDelete } from './helpers/validateRecipeDelete';
import { validateRecipeUpdate } from './helpers/validateRecipeUpdate';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;
    const body = await request.json();
    const { name } = body;

    // Validate request
    const validationError = await validateRecipeUpdate(recipeId, name);
    if (validationError) return validationError;

    // Build update data
    const updateData = buildUpdateData(body);

    // Update recipe
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

    // Validate deletion
    const validationError = await validateRecipeDelete(recipeId);
    if (validationError) return validationError;

    // Delete recipe and cleanup
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
