import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Get employee by ID
 */
export async function getEmployee(employeeId: string): Promise<NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: employee, error: fetchError } = await supabaseAdmin
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .single();

  if (fetchError || !employee) {
    logger.error('[Staff Employees API] Error fetching employee or employee not found:', {
      employeeId,
      error: fetchError?.message,
      context: { endpoint: '/api/staff/employees/[id]', operation: 'getEmployee' },
    });
    return NextResponse.json(ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404), {
      status: 404,
    });
  }

  return NextResponse.json({
    success: true,
    employee,
  });
}
