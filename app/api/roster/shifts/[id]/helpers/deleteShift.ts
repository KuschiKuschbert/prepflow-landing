import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { checkShiftExists } from './checkShiftExists';

/**
 * Delete shift by ID
 */
export async function deleteShift(shiftId: string): Promise<NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // Check if shift exists
  const existsResult = await checkShiftExists(shiftId);
  if (existsResult instanceof NextResponse) {
    return existsResult;
  }

  // Delete shift
  const { error: deleteError } = await supabaseAdmin.from('shifts').delete().eq('id', shiftId);

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
