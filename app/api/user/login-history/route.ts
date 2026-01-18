import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/user/login-history
 * Get current user's login history
 *
 * @param {NextRequest} req - Request object (for query params)
 * @returns {Promise<NextResponse>} Login history list
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userEmail = user.email;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!supabaseAdmin) {
      logger.warn('[Login History API] Supabase not available');
      return NextResponse.json({
        history: [],
        total: 0,
        note: 'Database not available. Login history tracking requires database setup.',
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
        note: 'User not found in database. Login history will be tracked after first login.',
      });
    }

    // Get login history
    const { data: history, error: historyError } = await supabaseAdmin
      .from('login_logs')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (historyError) {
      // Table might not exist yet
      logger.warn('[Login History API] Failed to fetch login history:', {
        error: historyError.message,
      });

      return NextResponse.json({
        history: [],
        total: 0,
        note: 'Login history table not found. Run database migration to enable tracking.',
      });
    }

    // Get total count
    const { count, error: _countError } = await supabaseAdmin
      .from('login_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userData.id);

    return NextResponse.json({
      history: history || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('[Login History API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/login-history', method: 'GET' },
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
