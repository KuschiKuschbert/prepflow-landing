import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { validateShiftData } from '../../helpers/requestHelpers';
import { buildUpdateData } from './buildUpdateData';

import type { CreateShiftInput, Shift } from '../../helpers/types';

/**
 * Update shift by ID
 */
export async function updateShift(
  supabase: SupabaseClient,
  shiftId: string,
  body: Partial<CreateShiftInput>,
  existingShift: Shift,
): Promise<NextResponse> {
  // Validate if required fields are present
  if (body.start_time || body.end_time || body.shift_date) {
    // Construct a temporary full object for format validation if partial data is provided
    // Note: This is tricky with partial updates.
    // Ideally we should validate only the fields provided.
    // The previous code merged with existingShift to do a full validation.
    // Let's do the same.
    const mergedShift: any = { ...existingShift, ...body };

    // Convert to request format expected by validator
    // CreateShiftRequest expects strings for dates/times, but existingShift might have them as whatever Shift type has.
    // Assuming Shift type has string dates or compatible

    const validation = validateShiftData(mergedShift);
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
  const { data: shift, error: updateError } = await supabase
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
