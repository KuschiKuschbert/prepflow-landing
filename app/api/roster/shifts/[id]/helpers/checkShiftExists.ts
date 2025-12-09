import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Check if shift exists and return it
 */
export async function checkShiftExists(shiftId: string): Promise<{ shift: any } | NextResponse> {
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
    return NextResponse.json(ApiErrorHandler.createError('Shift not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  return { shift: existingShift };
}
