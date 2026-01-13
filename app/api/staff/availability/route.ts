/**
 * Availability API Route
 * Handles GET (list availability) and POST (create/update availability) operations.
 *
 * @module api/staff/availability
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createAvailabilitySchema } from './helpers/schemas';

/**
 * GET /api/staff/availability
 * List availability records with optional filters.
 *
 * Query parameters:
 * - employee_id: Filter by employee ID
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
    const employeeId = searchParams.get('employee_id');

    let query = supabaseAdmin
      .from('availability')
      .select('*')
      .order('day_of_week', { ascending: true });

    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }

    const { data: availability, error } = await query;

    if (error) {
      logger.error('[Availability API] Database error fetching availability:', {
        error: error.message,
        code: error.code,
        context: { endpoint: '/api/staff/availability', operation: 'GET', table: 'availability' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      availability: availability || [],
    });
  } catch (err) {
    logger.error('[Availability API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/staff/availability', method: 'GET' },
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
 * POST /api/staff/availability
 * Create or update availability record (upsert).
 *
 * Request body:
 * - employee_id: Employee ID (required)
 * - day_of_week: Day of week (0=Sunday, 1=Monday, ..., 6=Saturday) (required)
 * - start_time: Start time (HH:MM:SS) (optional)
 * - end_time: End time (HH:MM:SS) (optional)
 * - is_available: Whether employee is available (optional, default: true)
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Availability API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createAvailabilitySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { employee_id, day_of_week, start_time, end_time, is_available } = validationResult.data;

    // Check if employee exists
    const { data: employee, error: employeeError } = await supabaseAdmin
      .from('employees')
      .select('id')
      .eq('id', employee_id)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
        {
          status: 404,
        },
      );
    }

    const availabilityData = {
      employee_id,
      day_of_week,
      start_time: start_time || null,
      end_time: end_time || null,
      is_available: is_available !== undefined ? is_available : true,
    };

    // Upsert (insert or update) availability record
    const { data: availability, error: upsertError } = await supabaseAdmin
      .from('availability')
      .upsert(availabilityData, { onConflict: 'employee_id,day_of_week' })
      .select()
      .single();

    if (upsertError) {
      logger.error('[Availability API] Database error upserting availability:', {
        error: upsertError.message,
        code: upsertError.code,
        context: {
          endpoint: '/api/staff/availability',
          operation: 'POST',
          employeeId: employee_id,
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(upsertError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      availability,
      message: 'Availability saved successfully',
    });
  } catch (err) {
    logger.error('[Availability API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/staff/availability', method: 'POST' },
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
