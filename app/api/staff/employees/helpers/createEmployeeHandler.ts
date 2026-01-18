import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { triggerEmployeeSync } from '@/lib/square/sync/hooks';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { handleStaffEmployeeError } from './handleError';
import { createEmployeeSchema } from './schemas';
import { validateEmployeeRequest } from './validateEmployeeRequest';

export async function handleCreateEmployee(request: NextRequest, supabase: SupabaseClient) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Staff Employees API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const zodValidation = createEmployeeSchema.safeParse(body);
    if (!zodValidation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          zodValidation.error.issues[0]?.message || 'Invalid request data',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const validation = validateEmployeeRequest(zodValidation.data);

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

    const employeeData = validation.data!;

    // Check if email already exists
    const { data: existingEmployee, error: checkError } = await supabase
      .from('employees')
      .select('id')
      .eq('email', employeeData.email)
      .single();

    if (existingEmployee) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Employee with this email already exists',
          'DUPLICATE_ERROR',
          409,
        ),
        { status: 409 },
      );
    }

    // Insert employee
    const { data: employee, error: insertError } = await supabase
      .from('employees')
      .insert(employeeData)
      .select()
      .single();

    if (insertError) {
      logger.error('[Staff Employees API] Database error creating employee:', {
        error: insertError.message,
        code: insertError.code,
        context: { endpoint: '/api/staff/employees', operation: 'POST', email: employeeData.email },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(insertError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Trigger Square sync hook (non-blocking)
    (async () => {
      try {
        await triggerEmployeeSync(request, employee.id, 'create');
      } catch (err) {
        logger.error('[Staff Employees API] Error triggering Square sync:', {
          error: err instanceof Error ? err.message : String(err),
          employeeId: employee.id,
        });
      }
    })();

    return NextResponse.json({
      success: true,
      employee,
      message: 'Employee created successfully',
    });
  } catch (err) {
    logger.error('[Staff Employees API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/staff/employees', method: 'POST' },
    });
    return handleStaffEmployeeError(err);
  }
}
