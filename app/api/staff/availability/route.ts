/**
 * Availability API Route
 * Handles GET (list availability) and POST (create/update availability) operations.
 *
 * @module api/staff/availability
 */

import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { createAvailabilitySchema } from './helpers/schemas';

async function safeParseBody<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch (_err) {
    throw ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400);
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    throw ApiErrorHandler.createError(
      result.error.issues[0]?.message || 'Invalid request body',
      'VALIDATION_ERROR',
      400,
    );
  }
  return result.data;
}

/**
 * GET /api/staff/availability
 * List availability records with optional filters.
 *
 * Query parameters:
 * - employee_id: Filter by employee ID
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');

    let query = supabase
      .from('availability')
      .select('*')
      .order('day_of_week', { ascending: true });

    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }

    const { data: availability, error: dbError } = await query;

    if (dbError) {
      logger.error('[Availability API] Database error fetching availability:', {
        error: dbError.message,
        code: dbError.code,
        context: { endpoint: '/api/staff/availability', operation: 'GET', table: 'availability' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
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
 */
export async function POST(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const body = await safeParseBody(request, createAvailabilitySchema);
    const { employee_id, day_of_week, start_time, end_time, is_available } = body;

    // Check if employee exists
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id')
      .eq('id', employee_id)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
        { status: 404 },
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
    const { data: availability, error: upsertError } = await supabase
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
    if (err instanceof NextResponse) return err;

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
