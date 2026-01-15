import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { Employee } from '../../helpers/schemas';
import { validateEmployeeRequest } from '../../helpers/validateEmployeeRequest';
import { buildUpdateData } from './buildUpdateData';
import { checkEmailUniqueness } from './checkEmailUniqueness';

/**
 * Update employee by ID
 */
export async function updateEmployee(
  employeeId: string,
  body: Record<string, any>,
  existingEmployee: Employee,
): Promise<NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // Validate if required fields are present
  if (body.first_name || body.last_name || body.email) {
    const validation = validateEmployeeRequest({ ...existingEmployee, ...body });
    if (!validation.isValid) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validation.error || 'Invalid request data',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }
  }

  // Check email uniqueness if email is being changed
  if (body.email && body.email !== existingEmployee.email) {
    const emailCheckResult = await checkEmailUniqueness(body.email);
    if (emailCheckResult instanceof NextResponse) {
      return emailCheckResult;
    }
  }

  // Build update data
  const updateData = buildUpdateData(body);

  // Update employee
  const { data: employee, error: updateError } = await supabaseAdmin
    .from('employees')
    .update(updateData)
    .eq('id', employeeId)
    .select()
    .single();

  if (updateError) {
    logger.error('[Staff Employees API] Database error updating employee:', {
      error: updateError.message,
      code: updateError.code,
      context: { endpoint: '/api/staff/employees/[id]', operation: 'PUT', employeeId },
    });

    const apiError = ApiErrorHandler.fromSupabaseError(updateError, 500);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }

  return NextResponse.json({
    success: true,
    employee,
    message: 'Employee updated successfully',
  });
}
