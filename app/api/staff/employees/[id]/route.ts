/**
 * Staff Employee API Route (by ID)
 * Handles GET (get employee), PUT (update employee), and DELETE (delete employee) operations.
 *
 * @module api/staff/employees/[id]
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { validateEmployeeRequest } from '../helpers/validateEmployeeRequest';

/**
 * GET /api/staff/employees/[id]
 * Get a single employee by ID.
 */
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const employeeId = id;

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
      return NextResponse.json(
        ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      employee,
    });
  } catch (err) {
    logger.error('[Staff Employees API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/staff/employees/[id]', method: 'GET' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

/**
 * PUT /api/staff/employees/[id]
 * Update an existing employee.
 *
 * Request body: Same as POST /api/staff/employees (all fields optional except those being updated)
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const employeeId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if employee exists
    const { data: existingEmployee, error: fetchError } = await supabaseAdmin
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (fetchError || !existingEmployee) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

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
      const { data: emailCheck } = await supabaseAdmin
        .from('employees')
        .select('id')
        .eq('email', body.email)
        .single();

      if (emailCheck) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Employee with this email already exists',
            'DUPLICATE_ERROR',
            409,
          ),
          { status: 409 },
        );
      }
    }

    // Build update data (only include fields that are provided)
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.first_name !== undefined) updateData.first_name = body.first_name;
    if (body.last_name !== undefined) updateData.last_name = body.last_name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.employment_type !== undefined) updateData.employment_type = body.employment_type;
    if (body.hourly_rate !== undefined) updateData.hourly_rate = parseFloat(body.hourly_rate);
    if (body.saturday_rate !== undefined)
      updateData.saturday_rate = body.saturday_rate ? parseFloat(body.saturday_rate) : null;
    if (body.sunday_rate !== undefined)
      updateData.sunday_rate = body.sunday_rate ? parseFloat(body.sunday_rate) : null;
    if (body.skills !== undefined) updateData.skills = body.skills;
    if (body.bank_account_bsb !== undefined) updateData.bank_account_bsb = body.bank_account_bsb;
    if (body.bank_account_number !== undefined)
      updateData.bank_account_number = body.bank_account_number;
    if (body.tax_file_number !== undefined) updateData.tax_file_number = body.tax_file_number;
    if (body.emergency_contact_name !== undefined)
      updateData.emergency_contact_name = body.emergency_contact_name;
    if (body.emergency_contact_phone !== undefined)
      updateData.emergency_contact_phone = body.emergency_contact_phone;
    if (body.user_id !== undefined) updateData.user_id = body.user_id;

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
        code: (updateError as any).code,
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
  } catch (err) {
    logger.error('[Staff Employees API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/staff/employees/[id]', method: 'PUT' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/staff/employees/[id]
 * Delete an employee.
 */
export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const employeeId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if employee exists
    const { data: existingEmployee, error: fetchError } = await supabaseAdmin
      .from('employees')
      .select('id')
      .eq('id', employeeId)
      .single();

    if (fetchError || !existingEmployee) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
        {
          status: 404,
        },
      );
    }

    // Delete employee (shifts and related records will be deleted via CASCADE)
    const { error: deleteError } = await supabaseAdmin
      .from('employees')
      .delete()
      .eq('id', employeeId);

    if (deleteError) {
      logger.error('[Staff Employees API] Database error deleting employee:', {
        error: deleteError.message,
        code: (deleteError as any).code,
        context: { endpoint: '/api/staff/employees/[id]', operation: 'DELETE', employeeId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(deleteError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (err) {
    logger.error('[Staff Employees API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/staff/employees/[id]', method: 'DELETE' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
