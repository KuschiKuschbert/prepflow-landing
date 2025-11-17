import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { buildParLevelData } from './buildParLevelData';

/**
 * Create a par level.
 *
 * @param {Object} parLevelData - Par level data
 * @returns {Promise<Object>} Created par level with ingredient data
 * @throws {Error} If creation fails
 */
export async function createParLevel(parLevelData: any) {
  const supabaseAdmin = createSupabaseAdmin();

  // Validate required fields - check for null/undefined explicitly to allow 0 values
  const ingredientId = parLevelData.ingredient_id || parLevelData.ingredientId;
  const parLevel = parLevelData.par_level ?? parLevelData.parLevel;
  const reorderPoint = parLevelData.reorder_point ?? parLevelData.reorderPoint;
  const unit = parLevelData.unit;

  if (!ingredientId || ingredientId === null || ingredientId === undefined) {
    throw ApiErrorHandler.createError('Ingredient ID is required', 'VALIDATION_ERROR', 400);
  }

  if (parLevel === null || parLevel === undefined || isNaN(Number(parLevel))) {
    throw ApiErrorHandler.createError(
      'Par level is required and must be a valid number',
      'VALIDATION_ERROR',
      400,
    );
  }

  if (reorderPoint === null || reorderPoint === undefined || isNaN(Number(reorderPoint))) {
    throw ApiErrorHandler.createError(
      'Reorder point is required and must be a valid number',
      'VALIDATION_ERROR',
      400,
    );
  }

  if (!unit || unit.trim() === '') {
    throw ApiErrorHandler.createError('Unit is required', 'VALIDATION_ERROR', 400);
  }

  // Check if ingredient exists
  const { data: ingredient, error: ingredientError } = await supabaseAdmin
    .from('ingredients')
    .select('id')
    .eq('id', ingredientId)
    .single();

  if (ingredientError || !ingredient) {
    throw ApiErrorHandler.createError('Ingredient not found', 'NOT_FOUND', 404);
  }

  // Check if par level already exists for this ingredient
  const { data: existing } = await supabaseAdmin
    .from('par_levels')
    .select('id')
    .eq('ingredient_id', ingredientId)
    .single();

  if (existing) {
    throw ApiErrorHandler.createError(
      'Par level already exists for this ingredient',
      'VALIDATION_ERROR',
      400,
    );
  }

  const dataToInsert = buildParLevelData(parLevelData);

  // Log the data being inserted for debugging
  logger.dev('[Par Levels API] Inserting par level data:', {
    dataToInsert,
    originalData: parLevelData,
    context: { endpoint: '/api/par-levels', operation: 'POST' },
  });

  // First insert the par level
  const { data: insertedData, error: insertError } = await supabaseAdmin
    .from('par_levels')
    .insert(dataToInsert)
    .select('id, ingredient_id, par_level, reorder_point, unit, created_at, updated_at')
    .single();

  if (insertError) {
    const errorMessage = insertError.message || '';
    const errorCode = (insertError as any).code;
    const errorDetails = (insertError as any).details || '';
    const errorHint = (insertError as any).hint || '';

    logger.error('[Par Levels API] Database error creating par level:', {
      error: errorMessage,
      code: errorCode,
      details: errorDetails,
      hint: errorHint,
      dataToInsert,
      context: { endpoint: '/api/par-levels', operation: 'POST', table: 'par_levels' },
    });

    // Check if it's a NOT NULL violation
    if (
      errorCode === '23502' ||
      errorMessage.includes('null value') ||
      errorMessage.includes('violates not-null')
    ) {
      // Try to extract column name from error message
      // PostgreSQL error format: "null value in column "column_name" violates not-null constraint"
      const columnMatch =
        errorMessage.match(/column "?([^"]+)"?/i) ||
        errorMessage.match(/null value in column "?([^"]+)"?/i) ||
        errorDetails.match(/column "?([^"]+)"?/i);
      const columnName = columnMatch ? columnMatch[1] : 'unknown';

      // Check which field is null in our data
      const nullFields = Object.entries(dataToInsert)
        .filter(([_, value]) => value === null || value === undefined)
        .map(([key]) => key);

      // Special handling for par_quantity column (legacy column that should be nullable)
      const isParQuantityIssue =
        columnName === 'par_quantity' || columnName?.includes('par_quantity');

      throw ApiErrorHandler.createError(
        `Required field is missing: ${columnName || nullFields.join(', ') || 'unknown field'}`,
        'NOT_NULL_VIOLATION',
        400,
        {
          error: errorMessage,
          code: errorCode,
          details: errorDetails,
          hint: errorHint,
          missingColumn: columnName,
          nullFields,
          dataToInsert,
          instructions: isParQuantityIssue
            ? [
                `The par_levels table has a legacy "par_quantity" column with a NOT NULL constraint.`,
                'This column has been replaced by "par_level" in the new schema.',
                'Please run the updated migration script to fix this:',
                '1. Open migrations/add-par-levels-columns.sql',
                '2. Copy the entire SQL script',
                '3. Run it in Supabase SQL Editor',
                '4. The script will remove the NOT NULL constraint from par_quantity',
                '5. Try creating the par level again',
              ]
            : [
                `The par_levels table requires the column "${columnName || 'unknown'}" to have a value, but it was null.`,
                'Please check:',
                `1. Ensure ${columnName || 'the required field'} is provided in the request`,
                '2. Verify the database schema matches the migration script',
                '3. Run migrations/add-par-levels-columns.sql in Supabase SQL Editor if needed',
              ],
        },
      );
    }

    // Check if it's a column-not-found error
    if (
      errorMessage.includes('column') &&
      (errorMessage.includes('does not exist') || errorMessage.includes('not found'))
    ) {
      // Extract column name from error message if possible
      const columnMatch = errorMessage.match(/column "?(\w+)"?/i);
      const columnName = columnMatch ? columnMatch[1] : 'unknown';

      throw ApiErrorHandler.createError(
        `Database column not found: ${columnName}. Please run the migration script.`,
        'COLUMN_NOT_FOUND',
        400,
        {
          error: errorMessage,
          code: errorCode,
          missingColumn: columnName,
          instructions: [
            `The par_levels table is missing the column: ${columnName}`,
            'Please run the migration script in Supabase SQL Editor:',
            '1. Open migrations/add-par-levels-columns.sql',
            '2. Copy the SQL and run it in Supabase SQL Editor',
            '3. Ensure the par_levels table has columns: par_level, reorder_point, unit',
          ],
        },
      );
    }

    throw ApiErrorHandler.fromSupabaseError(insertError, 500);
  }

  // Then fetch with ingredient join
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
    .eq('id', insertedData.id)
    .single();

  if (error) {
    const errorMessage = error.message || '';
    const errorCode = (error as any).code;

    logger.warn('[Par Levels API] Join failed, fetching ingredient separately:', {
      error: errorMessage,
      code: errorCode,
      insertedId: insertedData.id,
      ingredientId: insertedData.ingredient_id,
      context: { endpoint: '/api/par-levels', operation: 'POST', table: 'par_levels' },
    });

    // If join fails, fetch ingredient separately as fallback
    if (insertedData.ingredient_id) {
      try {
        const { data: ingredientData, error: ingredientError } = await supabaseAdmin
          .from('ingredients')
          .select('id, ingredient_name, unit, category')
          .eq('id', insertedData.ingredient_id)
          .single();

        if (!ingredientError && ingredientData) {
          logger.dev('[Par Levels API] Successfully fetched ingredient separately:', {
            ingredientId: insertedData.ingredient_id,
            ingredientName: ingredientData.ingredient_name,
          });
          // Return the inserted data with manually joined ingredient
          return {
            ...insertedData,
            ingredients: ingredientData,
          };
        } else {
          logger.warn('[Par Levels API] Failed to fetch ingredient separately:', {
            error: ingredientError?.message,
            ingredientId: insertedData.ingredient_id,
          });
        }
      } catch (fetchError) {
        logger.error('[Par Levels API] Exception fetching ingredient separately:', fetchError);
      }
    }

    // If all else fails, return the inserted data without ingredient join
    logger.warn('[Par Levels API] Returning data without ingredient join:', {
      insertedData,
    });
    return {
      ...insertedData,
      ingredients: null,
    };
  }

  // If join succeeded but ingredients is null, try fetching separately
  if (data && !data.ingredients && insertedData.ingredient_id) {
    logger.warn('[Par Levels API] Join returned null ingredients, fetching separately:', {
      insertedId: insertedData.id,
      ingredientId: insertedData.ingredient_id,
    });

    try {
      const { data: ingredientData, error: ingredientError } = await supabaseAdmin
        .from('ingredients')
        .select('id, ingredient_name, unit, category')
        .eq('id', insertedData.ingredient_id)
        .single();

      if (!ingredientError && ingredientData) {
        logger.dev(
          '[Par Levels API] Successfully fetched ingredient separately (null join case):',
          {
            ingredientId: insertedData.ingredient_id,
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
