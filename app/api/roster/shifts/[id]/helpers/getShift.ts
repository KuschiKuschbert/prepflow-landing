import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Get shift by ID
 */
export async function getShift(supabase: SupabaseClient, shiftId: string): Promise<NextResponse> {
  const { data: shift, error: fetchError } = await supabase
    .from('shifts')
    .select('*')
    .eq('id', shiftId)
    .single();

  if (fetchError || !shift) {
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

  return NextResponse.json({
    success: true,
    shift,
  });
}
