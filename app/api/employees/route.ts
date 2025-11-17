import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createEmployee } from './helpers/createEmployee';
import { deleteEmployee } from './helpers/deleteEmployee';
import { handleEmployeeError } from './helpers/handleEmployeeError';
import { updateEmployee } from './helpers/updateEmployee';

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
 * GET /api/employees
 * List all employees with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');

    let query = supabaseAdmin.from('employees').select(EMPLOYEE_SELECT).order('full_name');

    if (status) {
      query = query.eq('status', status);
    }
    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Employees API] Database error fetching employees:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/employees',
          operation: 'GET',
          table: 'employees',
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    return handleEmployeeError(err, 'GET');
  }
}

/**
 * POST /api/employees
 * Create a new employee
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      employee_id,
      full_name,
      role,
      employment_start_date,
      employment_end_date,
      status,
      phone,
      email,
      emergency_contact,
      photo_url,
      notes,
    } = body;

    if (!full_name || !employment_start_date) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'full_name and employment_start_date are required',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const data = await createEmployee({
      employee_id,
      full_name,
      role,
      employment_start_date,
      employment_end_date,
      status,
      phone,
      email,
      emergency_contact,
      photo_url,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: 'Employee created successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleEmployeeError(err, 'POST');
  }
}

/**
 * PUT /api/employees
 * Update an employee
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const data = await updateEmployee(id, updates);

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
 * DELETE /api/employees
 * Delete (deactivate) an employee
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

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
