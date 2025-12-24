import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/users
 * List all users with pagination and search
 */
export async function GET(request: NextRequest) {
  try {
    // Require admin access
    await requireAdmin(request);

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const search = searchParams.get('search') || '';

    let query = supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, subscription_status, created_at, last_login', {
        count: 'exact',
      })
      .order('created_at', { ascending: false });

    // Apply search filter
    if (search) {
      query = query.or(
        `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`,
      );
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: users, error, count } = await query;

    if (error) {
      logger.error('[Admin Users API] Database error:', {
        error: error.message,
        context: { endpoint: '/api/admin/users', method: 'GET' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return NextResponse.json({
      success: true,
      users: users || [],
      page,
      pageSize,
      total: count || 0,
      totalPages,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin Users API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/users', method: 'GET' },
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
