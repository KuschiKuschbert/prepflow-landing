import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createEmployee } from './helpers/createEmployee';
import { handleDeleteEmployee } from './helpers/deleteEmployeeHandler';
import { handleEmployeeError } from './helpers/handleEmployeeError';
import { createEmployeeSchema, EMPLOYEE_SELECT, updateEmployeeSchema } from './helpers/schemas';
import { updateEmployee } from './helpers/updateEmployee';

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
      const pgError = error as PostgrestError;
      logger.error('[Employees API] Database error fetching employees:', {
        error: pgError.message,
        code: pgError.code,
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
    logger.error('[Employees API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/employees', method: 'GET' },
    });
    return handleEmployeeError(err, 'GET');
  }
}

/**
 * POST /api/employees
 * Create a new employee
 */
export async function POST(request: NextRequest) {
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

    const validationResult = createEmployeeSchema.safeParse(body);
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
    } = validationResult.data;

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
  } catch (err) {
    logger.error('[Employees API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/employees', method: 'POST' },
    });
    return handleEmployeeError(err, 'POST');
  }
}

/**
 * PUT /api/employees
 * Update an employee
 */
export async function PUT(request: NextRequest) {
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

    const validationResult = updateEmployeeSchema.safeParse(body);
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

    const { id, ...updates } = validationResult.data;

    const data = await updateEmployee(id, updates);

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully',
      data,
    });
  } catch (err) {
    logger.error('[Employees API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/employees', method: 'PUT' },
    });
    return handleEmployeeError(err, 'PUT');
  }
}

/**
 * DELETE /api/employees
 * Delete (deactivate) an employee
 */
export async function DELETE(request: NextRequest) {
  return handleDeleteEmployee(request);
}
