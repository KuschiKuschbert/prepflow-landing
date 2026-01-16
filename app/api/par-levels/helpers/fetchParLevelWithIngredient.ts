import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';

/**
 * Fetch par level with ingredient join, with fallback to separate fetch.
 *
 * @param {string} parLevelId - Par level ID
 * @param {string} ingredientId - Ingredient ID for fallback
 * @returns {Promise<any>} Par level with ingredient data
 */
export async function fetchParLevelWithIngredient(parLevelId: string, ingredientId: string) {
  const supabaseAdmin = createSupabaseAdmin();

  // Try to fetch with ingredient join
  const { data, error } = await supabaseAdmin
    .from('par_levels')
    .select(
      `
      id,
      ingredient_id,
      par_level,
      reorder_point,
      unit,
      created_at,
      updated_at,
      ingredients (
        id,
        ingredient_name,
        unit,
        category
      )
    `,
    )
    .eq('id', parLevelId)
    .single();

  if (error) {
    const errorMessage = error.message || '';
    const errorCode = error.code;

    logger.warn('[Par Levels API] Join failed, fetching ingredient separately:', {
      error: errorMessage,
      code: errorCode,
      insertedId: parLevelId,
      ingredientId,
      context: { endpoint: '/api/par-levels', operation: 'POST', table: 'par_levels' },
    });

    // If join fails, fetch ingredient separately as fallback
    if (ingredientId) {
      try {
        const { data: ingredientData, error: ingredientError } = await supabaseAdmin
          .from('ingredients')
          .select('id, ingredient_name, unit, category')
          .eq('id', ingredientId)
          .single();

        if (!ingredientError && ingredientData) {
          logger.dev('[Par Levels API] Successfully fetched ingredient separately:', {
            ingredientId,
            ingredientName: ingredientData.ingredient_name,
          });
          // Return the inserted data with manually joined ingredient
          return {
            id: parLevelId,
            ingredient_id: ingredientId,
            ingredients: ingredientData,
          };
        } else {
          logger.warn('[Par Levels API] Failed to fetch ingredient separately:', {
            error: ingredientError?.message,
            ingredientId,
          });
        }
      } catch (fetchError) {
        logger.error('[Par Levels API] Exception fetching ingredient separately:', fetchError);
      }
    }

    // If all else fails, return data without ingredient join
    logger.warn('[Par Levels API] Returning data without ingredient join:', {
      parLevelId,
    });
    return {
      id: parLevelId,
      ingredient_id: ingredientId,
      ingredients: null,
    };
  }

  // If join succeeded but ingredients is null, try fetching separately
  if (data && !data.ingredients && ingredientId) {
    logger.warn('[Par Levels API] Join returned null ingredients, fetching separately:', {
      insertedId: parLevelId,
      ingredientId,
    });

    try {
      const { data: ingredientData, error: ingredientError } = await supabaseAdmin
        .from('ingredients')
        .select('id, ingredient_name, unit, category')
        .eq('id', ingredientId)
        .single();

      if (!ingredientError && ingredientData) {
        logger.dev(
          '[Par Levels API] Successfully fetched ingredient separately (null join case):',
          {
            ingredientId,
            ingredientName: ingredientData.ingredient_name,
          },
        );
        return {
          ...data,
          ingredients: ingredientData,
        };
      }
    } catch (fetchError) {
      logger.error(
        '[Par Levels API] Exception fetching ingredient separately (null join case):',
        fetchError,
      );
    }
  }

  return data;
}
