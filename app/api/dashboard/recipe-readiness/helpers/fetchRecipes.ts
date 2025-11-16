import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { isTableNotFound } from './checkTableExists';

/**
 * Fetch recipes with error handling for missing tables.
 *
 * @returns {Promise<Array>} Recipe list
 * @throws {Error} If fetch fails (non-table-not-found errors)
 */
export async function fetchRecipes(): Promise<any[]> {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  // Test connection first
  try {
    const { error: testError } = await supabaseAdmin.from('recipes').select('id').limit(1);
    if (testError) {
      logger.error('Database connection test failed:', {
        error: testError.message,
        code: (testError as any).code,
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
    .select('id, name');

  if (recipesError) {
    if (isTableNotFound(recipesError)) {
      logger.warn('Recipes table does not exist. Returning empty data.');
      return [];
    }

    const errorCode = (recipesError as any).code;
    const errorMessage = recipesError.message || 'Unknown database error';
    const errorHint = (recipesError as any).hint;

    logger.error('Error fetching recipes:', {
      error: errorMessage,
      code: errorCode,
      hint: errorHint,
    });

    throw new Error(
      process.env.NODE_ENV === 'development'
        ? `${errorMessage}${errorHint ? ` (${errorHint})` : ''}${errorCode ? ` [${errorCode}]` : ''}`
        : 'Could not retrieve recipes from database',
    );
  }

  return recipes || [];
}
