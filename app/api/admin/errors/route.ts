import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
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
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const search = searchParams.get('search') || '';
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    let query = supabase.from('admin_error_logs').select('*', { count: 'exact' });

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
    const { data: allErrors, error: fetchError, count } = await query;

    if (fetchError) {
      logger.error('[Admin Errors API] Database error:', {
        error: fetchError.message,
        context: { endpoint: '/api/admin/errors', method: 'GET' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(fetchError, 500), { status: 500 });
    }

    // Sort by severity priority (Safety first) then by date
    interface ErrorRecord {
      severity?: string;
      created_at: string;
      [key: string]: unknown;
    }
    const sortedErrors = (allErrors || []).sort((a: unknown, b: unknown) => {
      const errA = a as ErrorRecord;
      const errB = b as ErrorRecord;
      const aPriority = SEVERITY_PRIORITY[errA.severity || 'medium'] || 4;
      const bPriority = SEVERITY_PRIORITY[errB.severity || 'medium'] || 4;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      // If same severity, sort by date (newest first)
      return new Date(errB.created_at).getTime() - new Date(errA.created_at).getTime();
    });

    // Apply pagination after sorting
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const paginatedErrors = sortedErrors.slice(from, to);

    // Get counts by severity and status
    const severityCounts: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};
    (allErrors || []).forEach((err: any) => {
      // Justified: Supabase record typing
      const sev = err.severity || 'medium';
      severityCounts[sev] = (severityCounts[sev] || 0) + 1;
      const stat = err.status || 'new';
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
