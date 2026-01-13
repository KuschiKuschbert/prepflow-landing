import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import type { Employee } from '../../helpers/schemas';

/**
 * Check if employee exists and return it
 */
export async function checkEmployeeExists(
  employeeId: string,
): Promise<{ employee: Employee } | NextResponse> {
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
    logger.error('[Staff Employees API] Error fetching employee or employee not found:', {
      employeeId,
      error: fetchError?.message,
      context: { endpoint: '/api/staff/employees/[id]', operation: 'checkEmployeeExists' },
    });
    return NextResponse.json(ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  return { employee: existingEmployee as Employee };
}
