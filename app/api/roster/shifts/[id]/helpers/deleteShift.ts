import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { checkShiftExists } from './checkShiftExists';

/**
 * Delete shift by ID
 */
export async function deleteShift(
  supabase: SupabaseClient,
  shiftId: string,
  userId: string,
): Promise<NextResponse> {
  // Check if shift exists
  const existsResult = await checkShiftExists(supabase, shiftId, userId);
  if (existsResult instanceof NextResponse) {
    return existsResult;
  }

  // Delete shift
  const { error: deleteError } = await supabase
    .from('shifts')
    .delete()
    .eq('id', shiftId)
    .eq('user_id', userId);

  if (deleteError) {
    logger.error('[Shifts API] Database error deleting shift:', {
      error: deleteError.message,
      code: deleteError.code,
      context: { endpoint: '/api/roster/shifts/[id]', operation: 'DELETE', shiftId },
    });

    const apiError = ApiErrorHandler.fromSupabaseError(deleteError, 500);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Shift deleted successfully',
  });
}
