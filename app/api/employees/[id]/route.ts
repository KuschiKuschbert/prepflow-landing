import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { updateEmployee } from '../helpers/updateEmployee';
import { deleteEmployee } from '../helpers/deleteEmployee';
import { handleEmployeeError } from '../helpers/handleEmployeeError';

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
  try {
    const { id } = await context.params;

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
    return handleEmployeeError(err, 'GET');
  }
}

/**
 * PUT /api/employees/[id]
 * Update an employee
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const data = await updateEmployee(id, body);

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
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
  try {
    const { id } = await context.params;

    await deleteEmployee(id);

    return NextResponse.json({
      success: true,
      message: 'Employee deactivated successfully',
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleEmployeeError(err, 'DELETE');
  }
}

