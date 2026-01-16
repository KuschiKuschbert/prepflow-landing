/**
 * Time Attendance Records API Route
 * Handles GET (list attendance records) operations.
 *
 * @module api/time-attendance/records
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/time-attendance/records
 * List attendance records with optional filters.
 *
 * Query parameters:
 * - employee_id: Filter by employee ID
 * - shift_id: Filter by shift ID
 * - start_date: Filter records from this date (YYYY-MM-DD)
 * - end_date: Filter records until this date (YYYY-MM-DD)
 * - page: Page number (default: 1)
 * - pageSize: Page size (default: 100)
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const params = {
      employee_id: searchParams.get('employee_id'),
      shift_id: searchParams.get('shift_id'),
      start_date: searchParams.get('start_date'),
      end_date: searchParams.get('end_date'),
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: parseInt(searchParams.get('pageSize') || '100', 10),
    };

    let query = supabaseAdmin.from('time_attendance').select('*', { count: 'exact' });

    // Filter by employee
    if (params.employee_id) {
      query = query.eq('employee_id', params.employee_id);
    }

    // Filter by shift
    if (params.shift_id) {
      query = query.eq('shift_id', params.shift_id);
    }

    // Filter by date range
    if (params.start_date) {
      query = query.gte('clock_in_time', params.start_date);
    }

    if (params.end_date) {
      query = query.lte('clock_in_time', params.end_date);
    }

    // Order by clock-in time (most recent first)
    query = query.order('clock_in_time', { ascending: false });

    // Pagination
    const from = (params.page - 1) * params.pageSize;
    const to = from + params.pageSize - 1;
    query = query.range(from, to);

    const { data: records, error, count } = await query;

    if (error) {
      logger.error('[Time Attendance API] Database error fetching records:', {
        error: error.message,
        code: (error as unknown).code,
        context: {
          endpoint: '/api/time-attendance/records',
          operation: 'GET',
          table: 'time_attendance',
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      records: records || [],
      count: count || 0,
      page: params.page,
      pageSize: params.pageSize,
    });
  } catch (err) {
    logger.error('[Time Attendance API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/time-attendance/records', method: 'GET' },
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
