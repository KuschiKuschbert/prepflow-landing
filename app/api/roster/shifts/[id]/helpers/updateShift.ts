import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { updateShiftSchema } from '../../helpers/schemas';
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
  const mergedShift = { ...existingShift, ...body };

  const validation = updateShiftSchema.safeParse(mergedShift);
  if (!validation.success) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        validation.error.issues[0]?.message || 'Invalid request data',
        'VALIDATION_ERROR',
        400,
      ),
      { status: 400 },
    );
  }

  // Additional semantic check for time order (since schema refine might be loose on partials)
  const startTime = new Date(mergedShift.start_time);
  const endTime = new Date(mergedShift.end_time);
  if (endTime <= startTime) {
    return NextResponse.json(
      ApiErrorHandler.createError('End time must be after start time', 'VALIDATION_ERROR', 400),
      { status: 400 },
    );
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
