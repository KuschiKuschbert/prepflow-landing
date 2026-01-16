import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Fetch par levels with ingredient join, with fallback to separate queries.
 *
 * @param {any} supabaseAdmin - Supabase admin client
 * @returns {Promise<{data: any[] | null, error: NextResponse | null}>} Par levels data and error if any
 */
export async function fetchParLevels(supabaseAdmin: unknown) {
  // Try to fetch par levels with ingredient join
  // If join fails, fall back to fetching ingredients separately
  let { data, error } = await supabaseAdmin.from('par_levels').select(
    `
      *,
      ingredients (
        id,
        ingredient_name,
        unit,
        category
      )
    `,
  );

  // If join fails, try without join first to see if table exists
  if (error) {
    const errorCode = (error as unknown).code;
    const errorMessage = error.message || '';

    // If it's a relationship/join error, try fetching without join
    if (
      errorMessage.includes('relation') ||
      errorMessage.includes('foreign key') ||
      errorMessage.includes('does not exist')
    ) {
      logger.warn('[Par Levels API] Join failed, trying without join:', {
        error: error.message,
        code: errorCode,
      });

      // Try simple select first
      const { data: simpleData, error: simpleError } = await supabaseAdmin
        .from('par_levels')
        .select('*')
        .order('created_at', { ascending: false });

      if (simpleError) {
        // Table or columns don't exist
        return {
          data: null,
          error: NextResponse.json(
            ApiErrorHandler.createError(
              `Database error: ${simpleError.message}. Please ensure the par_levels table exists and has the required columns.`,
              'DATABASE_ERROR',
              500,
              {
                error: simpleError.message,
                code: errorCode,
                instructions: [
                  'Please run the migration script: migrations/add-par-levels-columns.sql',
                  'Ensure the par_levels table exists with columns: id, ingredient_id, par_level, reorder_point, unit, created_at, updated_at',
                ],
              },
            ),
            { status: 500 },
          ),
        };
      }

      // If we got data without join, fetch ingredients separately
      if (simpleData && simpleData.length > 0) {
        const ingredientIds = simpleData.map((pl: unknown) => pl.ingredient_id).filter((id: unknown) => id);

        if (ingredientIds.length > 0) {
          const { data: ingredientsData, error: ingredientsError } = await supabaseAdmin
            .from('ingredients')
            .select('id, ingredient_name, unit, category')
            .in('id', ingredientIds);

          if (ingredientsError) {
            logger.warn('[Par Levels API] Error fetching ingredients for par levels:', {
              error: ingredientsError.message,
              code: (ingredientsError as unknown).code,
              ingredientIds,
            });
            // Continue without ingredients - par levels will have null ingredients
            data = simpleData.map((pl: unknown) => ({ ...pl, ingredients: null }));
            error = null;
          } else {
            // Merge ingredients into par levels
            const ingredientsMap = new Map(
              (ingredientsData || []).map((ing: unknown) => [ing.id, ing]),
            );
            data = simpleData.map((pl: unknown) => ({
              ...pl,
              ingredients: ingredientsMap.get(pl.ingredient_id) || null,
            }));
            error = null;
          }
        } else {
          data = simpleData.map((pl: unknown) => ({ ...pl, ingredients: null }));
          error = null;
        }
      } else {
        data = simpleData;
        error = null;
      }
    }
  } else {
    // Success with join, order the results
    if (data) {
      data = data.sort((a: unknown, b: unknown) => {
        const aTime = new Date(a.created_at || 0).getTime();
        const bTime = new Date(b.created_at || 0).getTime();
        return bTime - aTime;
      });
    }
  }

  if (error) {
    logger.error('[Par Levels API] Database error fetching par levels:', {
      error: error.message,
      code: (error as unknown).code,
      details: error,
      context: { endpoint: '/api/par-levels', operation: 'GET', table: 'par_levels' },
    });

    // If it's a foreign key relationship error, provide helpful message
    if (error.message.includes('foreign key') || error.message.includes('relation')) {
      return {
        data: null,
        error: NextResponse.json(
          ApiErrorHandler.createError(
            'Database relationship error. Please ensure par_levels table has proper foreign key to ingredients.',
            'DATABASE_ERROR',
            500,
            {
              error: error.message,
              instructions: [
                'The par_levels table may be missing the foreign key relationship to ingredients.',
                'Please verify the table structure in Supabase.',
              ],
            },
          ),
          { status: 500 },
        ),
      };
    }

    const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
    return {
      data: null,
      error: NextResponse.json(apiError, { status: apiError.status || 500 }),
    };
  }

  return { data: data || [], error: null };
}
