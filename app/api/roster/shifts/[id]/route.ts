/**
 * Shift API Route (by ID)
 * Handles GET (get shift), PUT (update shift), and DELETE (delete shift) operations.
 *
 * @module api/roster/shifts/[id]
 */

import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { CreateShiftInput } from '../helpers/types';
import { checkShiftExists } from './helpers/checkShiftExists';
import { deleteShift } from './helpers/deleteShift';
import { getShift } from './helpers/getShift';
import { updateShift } from './helpers/updateShift';

const updateShiftSchema = z
  .object({
    employee_id: z.string().uuid('Employee ID must be a valid UUID').optional(),
    shift_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD')
      .optional(),
    start_time: z.string().datetime('Invalid start time format').optional(),
    end_time: z.string().datetime('Invalid end time format').optional(),
    status: z.enum(['draft', 'published', 'completed', 'cancelled']).optional(),
    role: z.string().optional().nullable(),
    break_duration_minutes: z.number().int().nonnegative().optional(),
    notes: z.string().optional().nullable(),
    template_shift_id: z.string().uuid().optional().nullable(),
  })
  .refine(
    data => {
      if (data.start_time && data.end_time) {
        const startTime = new Date(data.start_time);
        const endTime = new Date(data.end_time);
        return endTime > startTime;
      }
      return true;
    },
    {
      message: 'End time must be after start time',
      path: ['end_time'],
    },
  );

/**
 * GET /api/roster/shifts/[id]
 * Get a single shift by ID.
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const { id } = await context.params;
    return await getShift(supabase, id);
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
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const { id } = await context.params;
    const shiftId = id;

    // Check if shift exists
    const existsResult = await checkShiftExists(supabase, shiftId);
    if (existsResult instanceof NextResponse) {
      return existsResult;
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Shifts API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const zodValidation = updateShiftSchema.safeParse(body);
    if (!zodValidation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          zodValidation.error.issues[0]?.message || 'Invalid request data',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const updatePayload = zodValidation.data as CreateShiftInput;
    return await updateShift(supabase, shiftId, updatePayload, existsResult.shift);
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
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const { id } = await context.params;
    return await deleteShift(supabase, id);
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
