/**
 * Shifts API Route
 * Handles GET (list shifts) and POST (create shift) operations.
 *
 * @module api/roster/shifts
 */

import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { buildShiftQuery } from './helpers/buildShiftQuery';
import { handleCreateShift } from './helpers/createShiftHandler';

/**
 * GET /api/roster/shifts
 * List shifts with optional filters and pagination.
 *
 * Query parameters:
 * - employee_id: Filter by employee ID
 * - status: Filter by status (draft, published, completed, cancelled, all)
 * - start_date: Filter shifts from this date (YYYY-MM-DD)
 * - end_date: Filter shifts until this date (YYYY-MM-DD)
 * - shift_date: Filter by specific date (YYYY-MM-DD)
 * - page: Page number (default: 1)
 * - pageSize: Page size (default: 100)
 */
/**
 * GET /api/roster/shifts
 * List shifts with optional filters and pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const { searchParams } = new URL(request.url);
    const params = {
      employee_id: searchParams.get('employee_id') || undefined,
      status: searchParams.get('status') || 'all',
      start_date: searchParams.get('start_date') || undefined,
      end_date: searchParams.get('end_date') || undefined,
      shift_date: searchParams.get('shift_date') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: parseInt(searchParams.get('pageSize') || '100', 10),
    };

    const { data: shifts, error: dbError, count } = await buildShiftQuery(supabase, params);

    if (dbError) {
      logger.error('[Shifts API] Database error fetching shifts:', {
        error: dbError.message,
        code: dbError.code,
        context: { endpoint: '/api/roster/shifts', operation: 'GET', table: 'shifts' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      shifts: shifts || [],
      count: count || 0,
      page: params.page,
      pageSize: params.pageSize,
    });
  } catch (err) {
    logger.error('[Shifts API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/shifts', method: 'GET' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

/**
 * POST /api/roster/shifts
 * Create a new shift.
 *
 * Request body:
 * - employee_id: Employee ID (required)
 * - shift_date: Shift date (YYYY-MM-DD) (required)
 * - start_time: Start time (ISO timestamp) (required)
 * - end_time: End time (ISO timestamp) (required)
 * - status: Shift status (draft, published, completed, cancelled) (optional, default: draft)
 * - role: Role required for shift (optional)
 * - break_duration_minutes: Break duration in minutes (optional, default: 0)
 * - notes: Shift notes (optional)
 * - template_shift_id: Template shift ID if created from template (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    return handleCreateShift(request, supabase);
  } catch (err) {
    if (err instanceof NextResponse) return err;
    const apiError = ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500);
    return NextResponse.json(apiError, { status: 500 });
  }
}
