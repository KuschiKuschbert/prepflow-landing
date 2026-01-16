import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Check if shift exists and return it
 */
export async function checkShiftExists(shiftId: string): Promise<{ shift: unknown } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: existingShift, error: fetchError } = await supabaseAdmin
    .from('shifts')
    .select('*')
    .eq('id', shiftId)
    .single();

  if (fetchError || !existingShift) {
    if (fetchError) {
      logger.error('[Roster API] Error fetching shift:', {
        error: fetchError.message,
        shiftId,
        context: { endpoint: '/api/roster/shifts/[id]', method: 'GET' },
      });
    }
    return NextResponse.json(ApiErrorHandler.createError('Shift not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  return { shift: existingShift };
}
