import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { isTableNotFound } from './checkTableExists';

interface Recipe {
  id: string;
  recipe_name?: string;
  name?: string;
}

/**
 * Fetch recipes with error handling for missing tables.
 *
 * @returns {Promise<Array>} Recipe list
 * @throws {Error} If fetch fails (non-table-not-found errors)
 */
export async function fetchRecipes(): Promise<Recipe[]> {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Test connection first
  try {
    const { error: testError } = await supabaseAdmin.from('recipes').select('id').limit(1);
    if (testError) {
      logger.error('Database connection test failed:', {
        error: testError.message,
        code: testError.code,
      });
    }
  } catch (testErr) {
    logger.error('Database connection test exception:', {
      error: testErr instanceof Error ? testErr.message : String(testErr),
    });
  }

  // Fetch all recipes
  const { data: recipes, error: recipesError } = await supabaseAdmin
    .from('recipes')
    .select('id, name:recipe_name');

  if (recipesError) {
    if (isTableNotFound(recipesError)) {
      logger.warn('Recipes table does not exist. Returning empty data.');
      return [];
    }

    const errorCode = recipesError.code;
    const errorMessage = recipesError.message || 'Unknown database error';
    const errorHint = (recipesError as { hint?: string }).hint;

    logger.error('Error fetching recipes:', {
      error: errorMessage,
      code: errorCode,
      hint: errorHint,
    });

    throw ApiErrorHandler.createError(
      process.env.NODE_ENV === 'development'
        ? `${errorMessage}${errorHint ? ` (${errorHint})` : ''}${errorCode ? ` [${errorCode}]` : ''}`
        : 'Could not retrieve recipes from database',
      'DATABASE_ERROR',
      500,
    );
  }

  return recipes || [];
}
