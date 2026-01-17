import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { deleteRecipeAndCleanup } from './deleteRecipeAndCleanup';
import { validateRecipeDelete } from './validateRecipeDelete';

export async function handleDeleteRecipe(recipeId: string) {
  try {
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
    } catch (error: unknown) {
      const err = error as { message?: string; code?: string };
      logger.error('[RecipeDelete] Error deleting recipe:', {
        error: err.message,
        code: err.code,
        context: { endpoint: '/api/recipes/[id]', operation: 'DELETE', recipeId },
      });

      if (
        err.message?.includes('foreign key constraint') ||
        err.message?.includes('menu_dishes') ||
        err.message?.includes('dish_recipes') ||
        err.code === '23503'
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
