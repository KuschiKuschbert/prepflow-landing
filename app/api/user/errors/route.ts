import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/user/errors
 * Get user's recent errors (last 7 days, max 10)
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Get user_id from email
    let userId: string | null = null;
    try {
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();
      if (userData) {
        userId = userData.id;
      }
    } catch (err) {
      // User not found - return empty array
      return NextResponse.json({
        success: true,
        errors: [],
        total: 0,
      });
    }

    if (!userId) {
      return NextResponse.json({
        success: true,
        errors: [],
        total: 0,
      });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const limit = Math.min(pageSize, 10); // Max 10 errors

    // Get errors from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const {
      data: errors,
      error,
      count,
    } = await supabaseAdmin
      .from('admin_error_logs')
      .select('id, error_message, severity, category, created_at, status', { count: 'exact' })
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      logger.error('[User Errors API] Database error:', {
        error: error.message,
        context: { endpoint: '/api/user/errors', method: 'GET' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
    }

    return NextResponse.json({
      success: true,
      errors: errors || [],
      total: count || 0,
      page,
      pageSize: limit,
    });
  } catch (error) {
    logger.error('[User Errors API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/errors', method: 'GET' },
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



