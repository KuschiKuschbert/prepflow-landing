import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

/**
 * Handle insert error with detailed error messages.
 *
 * @param {any} insertError - Supabase insert error
 * @param {any} dataToInsert - Data that was being inserted
 * @throws {Error} Formatted error with instructions
 */
export function handleInsertError(insertError: unknown, dataToInsert: unknown) {
  const errorMessage = insertError.message || '';
  const errorCode = (insertError as unknown).code;
  const errorDetails = (insertError as unknown).details || '';
  const errorHint = (insertError as unknown).hint || '';

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
              '2. Verify the data structure matches the migration script',
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
