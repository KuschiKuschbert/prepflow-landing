import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Check if par_levels table exists.
 *
 * @param {any} supabaseAdmin - Supabase admin client
 * @returns {Promise<{exists: boolean, error: NextResponse | null}>} Table existence status and error if any
 */
export async function checkTableExists(supabaseAdmin: any) {
  const { error: tableCheckError } = await supabaseAdmin.from('par_levels').select('id').limit(1);

  if (tableCheckError) {
    const errorCode = (tableCheckError as any).code;
    const errorMessage = tableCheckError.message || '';

    logger.error('[Par Levels API] Table check failed:', {
      error: errorMessage,
      code: errorCode,
      fullError: tableCheckError,
      context: { endpoint: '/api/par-levels', operation: 'GET' },
    });

    // Table doesn't exist (42P01) or relation doesn't exist
    if (
      errorCode === '42P01' ||
      errorMessage.includes('relation') ||
      errorMessage.includes('does not exist')
    ) {
      return {
        exists: false,
        error: NextResponse.json(
          ApiErrorHandler.createError(
            "Par levels table doesn't exist. Please run the migration script.",
            'TABLE_NOT_FOUND',
            400,
            {
              error: errorMessage,
              code: errorCode,
              instructions: [
                'The par_levels table has not been created yet.',
                'Please run the migration SQL in your Supabase SQL Editor:',
                '1. Open migrations/add-par-levels-columns.sql',
                '2. Copy the SQL and run it in Supabase SQL Editor',
                '3. Ensure the par_levels table exists with proper foreign key to ingredients',
              ],
            },
          ),
          { status: 400 },
        ),
      };
    }
  }

  return { exists: true, error: null };
}
