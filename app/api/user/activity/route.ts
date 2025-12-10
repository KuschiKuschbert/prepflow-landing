import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/user/activity
 * Get current user's recent account activity
 *
 * @param {NextRequest} req - Request object (for query params)
 * @returns {Promise<NextResponse>} Account activity list
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const userEmail = session.user.email;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!supabaseAdmin) {
      logger.warn('[Activity API] Supabase not available');
      return NextResponse.json({
        activity: [],
        total: 0,
        note: 'Database not available. Activity tracking requires database setup.',
      });
    }

    // Get user ID first
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError || !userData) {
      // User not found, return empty activity
      return NextResponse.json({
        activity: [],
        total: 0,
        note: 'User not found in database. Activity will be tracked after first action.',
      });
    }

    // Get account activity
    const { data: activity, error: activityError } = await supabaseAdmin
      .from('account_activity')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (activityError) {
      // Table might not exist yet
      logger.warn('[Activity API] Failed to fetch activity:', {
        error: activityError.message,
      });

      return NextResponse.json({
        activity: [],
        total: 0,
        note: 'Activity table not found. Run database migration to enable tracking.',
      });
    }

    // Get total count
    const { count, error: countError } = await supabaseAdmin
      .from('account_activity')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userData.id);

    return NextResponse.json({
      activity: activity || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('[Activity API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/activity', method: 'GET' },
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



