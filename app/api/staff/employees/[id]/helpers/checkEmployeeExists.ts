import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Check if employee exists and return it
 */
export async function checkEmployeeExists(
  employeeId: string,
): Promise<{ employee: any } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: existingEmployee, error: fetchError } = await supabaseAdmin
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .single();

  if (fetchError || !existingEmployee) {
    return NextResponse.json(ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  return { employee: existingEmployee };
}
