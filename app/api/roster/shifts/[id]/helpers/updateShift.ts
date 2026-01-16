import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { validateShiftRequest } from '../../helpers/validateShiftRequest';
import { buildUpdateData } from './buildUpdateData';

/**
 * Update shift by ID
 */
export async function updateShift(
  shiftId: string,
  body: any,
  existingShift: any,
): Promise<NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

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

  // Build update data
  const updateData = buildUpdateData(body, existingShift);

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
      code: updateError.code,
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
}
