/**
 * Shift API Route (by ID)
 * Handles GET (get shift), PUT (update shift), and DELETE (delete shift) operations.
 *
 * @module api/roster/shifts/[id]
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { validateShiftRequest } from '../helpers/validateShiftRequest';

/**
 * GET /api/roster/shifts/[id]
 * Get a single shift by ID.
 */
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const shiftId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data: shift, error: fetchError } = await supabaseAdmin
      .from('shifts')
      .select('*')
      .eq('id', shiftId)
      .single();

    if (fetchError || !shift) {
      return NextResponse.json(ApiErrorHandler.createError('Shift not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    return NextResponse.json({
      success: true,
      shift,
    });
  } catch (err) {
    logger.error('[Shifts API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/shifts/[id]', method: 'GET' },
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
 * PUT /api/roster/shifts/[id]
 * Update an existing shift.
 *
 * Request body: Same as POST /api/roster/shifts (all fields optional except those being updated)
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const shiftId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if shift exists
    const { data: existingShift, error: fetchError } = await supabaseAdmin
      .from('shifts')
      .select('*')
      .eq('id', shiftId)
      .single();

    if (fetchError || !existingShift) {
      return NextResponse.json(ApiErrorHandler.createError('Shift not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    const body = await request.json();

    // Validate if required fields are present
    if (body.start_time || body.end_time || body.shift_date) {
      const validation = validateShiftRequest({ ...existingShift, ...body });
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
    }

    // Build update data (only include fields that are provided)
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.employee_id !== undefined) updateData.employee_id = body.employee_id;
    if (body.shift_date !== undefined) updateData.shift_date = body.shift_date;
    if (body.start_time !== undefined) updateData.start_time = body.start_time;
    if (body.end_time !== undefined) updateData.end_time = body.end_time;
    if (body.status !== undefined) {
      updateData.status = body.status;
      // Set published_at if status changes to published
      if (body.status === 'published' && existingShift.status !== 'published') {
        updateData.published_at = new Date().toISOString();
      }
      // Clear published_at if status changes from published
      if (body.status !== 'published' && existingShift.status === 'published') {
        updateData.published_at = null;
      }
    }
    if (body.role !== undefined) updateData.role = body.role;
    if (body.break_duration_minutes !== undefined)
      updateData.break_duration_minutes = body.break_duration_minutes;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.template_shift_id !== undefined) updateData.template_shift_id = body.template_shift_id;

    // Update shift
    const { data: shift, error: updateError } = await supabaseAdmin
      .from('shifts')
      .update(updateData)
      .eq('id', shiftId)
      .select()
      .single();

    if (updateError) {
      logger.error('[Shifts API] Database error updating shift:', {
        error: updateError.message,
        code: (updateError as any).code,
        context: { endpoint: '/api/roster/shifts/[id]', operation: 'PUT', shiftId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(updateError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      shift,
      message: 'Shift updated successfully',
    });
  } catch (err) {
    logger.error('[Shifts API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/shifts/[id]', method: 'PUT' },
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
 * DELETE /api/roster/shifts/[id]
 * Delete a shift.
 */
export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const shiftId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if shift exists
    const { data: existingShift, error: fetchError } = await supabaseAdmin
      .from('shifts')
      .select('id')
      .eq('id', shiftId)
      .single();

    if (fetchError || !existingShift) {
      return NextResponse.json(ApiErrorHandler.createError('Shift not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Delete shift
    const { error: deleteError } = await supabaseAdmin.from('shifts').delete().eq('id', shiftId);

    if (deleteError) {
      logger.error('[Shifts API] Database error deleting shift:', {
        error: deleteError.message,
        code: (deleteError as any).code,
        context: { endpoint: '/api/roster/shifts/[id]', operation: 'DELETE', shiftId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(deleteError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Shift deleted successfully',
    });
  } catch (err) {
    logger.error('[Shifts API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/shifts/[id]', method: 'DELETE' },
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
