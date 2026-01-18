import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/user/import-export-history
 * Get current user's import/export history
 *
 * @param {NextRequest} req - Request object (for query params)
 * @returns {Promise<NextResponse>} Import/export history list
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userEmail = user.email;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const operationType = searchParams.get('type'); // 'export', 'import', 'backup', 'restore'

    if (!supabaseAdmin) {
      logger.warn('[Import/Export History API] Supabase not available');
      return NextResponse.json({
        history: [],
        total: 0,
        note: 'Database not available. History tracking requires database setup.',
      });
    }

    // Get user ID first
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError || !userData) {
      // User not found, return empty history
      return NextResponse.json({
        history: [],
        total: 0,
        note: 'User not found in database. History will be tracked after first operation.',
      });
    }

    // Build query
    let query = supabaseAdmin
      .from('import_export_logs')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false });

    // Filter by operation type if provided
    if (operationType) {
      query = query.eq('operation_type', operationType);
    }

    // Apply pagination
    const { data: history, error: historyError } = await query.range(offset, offset + limit - 1);

    if (historyError) {
      // Table might not exist yet
      logger.warn('[Import/Export History API] Failed to fetch history:', {
        error: historyError.message,
      });

      return NextResponse.json({
        history: [],
        total: 0,
        note: 'Import/export history table not found. Run database migration to enable tracking.',
      });
    }

    // Get total count
    let countQuery = supabaseAdmin
      .from('import_export_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userData.id);

    if (operationType) {
      countQuery = countQuery.eq('operation_type', operationType);
    }

    const { count, error: _countError } = await countQuery;

    return NextResponse.json({
      history: history || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('[Import/Export History API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/import-export-history', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
