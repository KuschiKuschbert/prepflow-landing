import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/support-tickets
 * List support tickets with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
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
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const type = searchParams.get('type');
    const search = searchParams.get('search') || '';

    let query = supabaseAdmin
      .from('support_tickets')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (severity) {
      query = query.eq('severity', severity);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (search) {
      query = query.or(
        `subject.ilike.%${search}%,message.ilike.%${search}%,user_email.ilike.%${search}%`,
      );
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: tickets, error, count } = await query;

    if (error) {
      logger.error('[Admin Support Tickets API] Database error:', {
        error: error.message,
        context: { endpoint: '/api/admin/support-tickets', method: 'GET' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return NextResponse.json({
      success: true,
      tickets: tickets || [],
      page,
      pageSize,
      total: count || 0,
      totalPages,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin Support Tickets API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/support-tickets', method: 'GET' },
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



