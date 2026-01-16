import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Fetches an error log by ID from the database.
 *
 * @param {string} errorId - The ID of the error log to fetch.
 * @returns {Promise<{ errorLog: any } | NextResponse>} Error log data or error response.
 */
export async function fetchError(errorId: string): Promise<{ errorLog: unknown } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: errorLog, error } = await supabaseAdmin
    .from('admin_error_logs')
    .select('*')
    .eq('id', errorId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json(
        ApiErrorHandler.createError('Error log not found', 'NOT_FOUND', 404),
        {
          status: 404,
        },
      );
    }

    logger.error('[Admin Errors API] Database error:', {
      error: error.message,
      context: { endpoint: `/api/admin/errors/${errorId}`, method: 'GET' },
    });

    return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
  }

  return { errorLog };
}
