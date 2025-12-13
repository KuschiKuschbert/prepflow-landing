/**
 * Shifts API Route
 * Handles GET (list shifts) and POST (create shift) operations.
 *
 * @module api/roster/shifts
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { validateShiftRequest } from './helpers/validateShiftRequest';
import { buildShiftQuery } from './helpers/buildShiftQuery';

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
      status: searchParams.get('status') || 'all',
      start_date: searchParams.get('start_date'),
      end_date: searchParams.get('end_date'),
      shift_date: searchParams.get('shift_date'),
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: parseInt(searchParams.get('pageSize') || '100', 10),
    };

    const { data: shifts, error, count } = await buildShiftQuery(supabaseAdmin, params);

    if (error) {
      logger.error('[Shifts API] Database error fetching shifts:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/roster/shifts', operation: 'GET', table: 'shifts' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
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
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const validation = validateShiftRequest(body);

    if (!validation.isValid) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validation.error || 'Invalid request data',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const shiftData = validation.data!;

    // Check if employee exists
    const { data: employee, error: employeeError } = await supabaseAdmin
      .from('employees')
      .select('id')
      .eq('id', shiftData.employee_id)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    // Insert shift
    const { data: shift, error: insertError } = await supabaseAdmin
      .from('shifts')
      .insert(shiftData)
      .select()
      .single();

    if (insertError) {
      logger.error('[Shifts API] Database error creating shift:', {
        error: insertError.message,
        code: (insertError as any).code,
        context: {
          endpoint: '/api/roster/shifts',
          operation: 'POST',
          employeeId: shiftData.employee_id,
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(insertError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      shift,
      message: 'Shift created successfully',
    });
  } catch (err) {
    logger.error('[Shifts API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/shifts', method: 'POST' },
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
