import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Fetches all hidden feature flags from the database.
 *
 * @returns {Promise<{ flags: any[] } | NextResponse>} Flags data or error response.
 */
export async function fetchHiddenFlags(): Promise<{ flags: any[] } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Data connection not available',
        flags: [],
      },
      { status: 500 },
    );
  }

  const { data: flags, error } = await supabaseAdmin
    .from('hidden_feature_flags')
    .select('*')
    .order('feature_key');

  if (error) {
    logger.error('[Admin Hidden Features API] Database error:', {
      error: error.message,
      errorCode: error.code,
      context: { endpoint: '/api/admin/features/hidden', method: 'GET' },
    });

    // Check if error is due to table not existing
    const errorMessage = error.message || '';
    const isTableNotFound =
      errorMessage.includes('relation "hidden_feature_flags" does not exist') ||
      errorMessage.includes('does not exist') ||
      error.code === '42P01';

    if (isTableNotFound) {
      return NextResponse.json(
        {
          success: false,
          error: 'TABLE_NOT_FOUND',
          message:
            "The hidden_feature_flags table doesn't exist. Please run the migration: migrations/create_hidden_feature_flags_table.sql",
          details: {
            migrationFile: 'migrations/create_hidden_feature_flags_table.sql',
            errorCode: error.code,
            errorMessage: error.message,
          },
          flags: [],
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'DATABASE_ERROR',
        message: error.message || 'Database error occurred',
        details: {
          errorCode: error.code,
          errorMessage: error.message,
        },
        flags: [],
      },
      { status: 500 },
    );
  }

  return { flags: flags || [] };
}
