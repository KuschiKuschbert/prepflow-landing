import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { deleteEmployee } from '../helpers/deleteEmployee';
import { handleEmployeeError } from '../helpers/handleEmployeeError';
import { updateEmployee } from '../helpers/updateEmployee';

const updateEmployeeByIdSchema = z.object({
  full_name: z.string().optional(),
  role: z.string().optional(),
  employment_start_date: z.string().optional(),
  employment_end_date: z.string().optional(),
  status: z.enum(['active', 'inactive', 'terminated']).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  emergency_contact: z.string().optional(),
  photo_url: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

const EMPLOYEE_SELECT = `
  *,
  employee_qualifications (
    *,
    qualification_types (
      id,
      name,
      description,
      is_required,
      default_expiry_days
    )
  )
`;

/**
 * GET /api/employees/[id]
 * Get a single employee by ID
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('employees')
      .select(EMPLOYEE_SELECT)
      .eq('id', id)
      .single();

    if (error) {
      logger.error('[Employees API] Database error fetching employee:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/employees/[id]',
          operation: 'GET',
          table: 'employees',
          employee_id: id,
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    if (!data) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    logger.error('[Employees API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/employees/[id]', method: 'GET', employeeId: id },
    });
    return handleEmployeeError(err, 'GET');
  }
}

/**
 * PUT /api/employees/[id]
 * Update an employee
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Employees API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = updateEmployeeByIdSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const data = await updateEmployee(id, validationResult.data);

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      logger.error('[Employees API] Error with status:', {
        error: err instanceof Error ? err.message : String(err),
        status: err.status,
        context: { endpoint: '/api/employees/[id]', method: 'PUT' },
      });
      return NextResponse.json(err, { status: err.status });
    }
    return handleEmployeeError(err, 'PUT');
  }
}

/**
 * DELETE /api/employees/[id]
 * Delete (deactivate) an employee
 */
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await deleteEmployee(id);

    return NextResponse.json({
      success: true,
      message: 'Employee deactivated successfully',
    });
  } catch (err: any) {
    if (err.status) {
      logger.error('[Employees API] Error with status:', {
        error: err instanceof Error ? err.message : String(err),
        status: err.status,
        context: { endpoint: '/api/employees/[id]', method: 'DELETE' },
      });
      return NextResponse.json(err, { status: err.status });
    }
    return handleEmployeeError(err, 'DELETE');
  }
}
