import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { Employee } from '../../helpers/schemas';

/**
 * Check if employee exists and return it
 */
export async function checkEmployeeExists(
  supabase: SupabaseClient,
  employeeId: string,
): Promise<{ employee: Employee } | NextResponse> {
  const { data: existingEmployee, error: fetchError } = await supabase
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .single();

  if (fetchError || !existingEmployee) {
    if (fetchError) {
      logger.error('[Staff Employees API] Error fetching employee or employee not found:', {
        employeeId,
        error: fetchError.message,
        context: { endpoint: '/api/staff/employees/[id]', operation: 'checkEmployeeExists' },
      });
    }
    return NextResponse.json(ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  return { employee: existingEmployee as Employee };
}
