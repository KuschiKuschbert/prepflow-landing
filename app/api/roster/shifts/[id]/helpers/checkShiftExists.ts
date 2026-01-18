import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { Shift } from '../../helpers/types';

/**
 * Check if shift exists and return it
 */
export async function checkShiftExists(supabase: SupabaseClient, shiftId: string): Promise<{ shift: Shift } | NextResponse> {
  const { data: existingShift, error: fetchError } = await supabase
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

  return { shift: existingShift as unknown as Shift };
}
