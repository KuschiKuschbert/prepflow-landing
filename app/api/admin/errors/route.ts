import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Severity priority order for sorting (Safety first)
 */
const SEVERITY_PRIORITY: Record<string, number> = {
  safety: 1,
  critical: 2,
  high: 3,
  medium: 4,
  low: 5,
};

/**
 * GET /api/admin/errors
 * List error logs with pagination and filters
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
    const search = searchParams.get('search') || '';
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    let query = supabaseAdmin.from('admin_error_logs').select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`error_message.ilike.%${search}%,endpoint.ilike.%${search}%`);
    }
    if (severity) {
      query = query.eq('severity', severity);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }

    // Get all errors first (for sorting by severity priority)
    const { data: allErrors, error, count } = await query;

    if (error) {
      logger.error('[Admin Errors API] Database error:', {
        error: error.message,
        context: { endpoint: '/api/admin/errors', method: 'GET' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
    }

    // Sort by severity priority (Safety first) then by date
    const sortedErrors = (allErrors || []).sort((a, b) => {
      const aPriority = SEVERITY_PRIORITY[a.severity || 'medium'] || 4;
      const bPriority = SEVERITY_PRIORITY[b.severity || 'medium'] || 4;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      // If same severity, sort by date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Apply pagination after sorting
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const paginatedErrors = sortedErrors.slice(from, to);

    // Get counts by severity and status
    const severityCounts: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};
    (allErrors || []).forEach(error => {
      const sev = error.severity || 'medium';
      severityCounts[sev] = (severityCounts[sev] || 0) + 1;
      const stat = error.status || 'new';
      statusCounts[stat] = (statusCounts[stat] || 0) + 1;
    });

    const totalPages = Math.ceil((count || 0) / pageSize);

    return NextResponse.json({
      success: true,
      errors: paginatedErrors,
      page,
      pageSize,
      total: count || 0,
      totalPages,
      severityCounts,
      statusCounts,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin Errors API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/errors', method: 'GET' },
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
