import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { PostgrestError } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { createEmployee } from './helpers/createEmployee';
import { handleDeleteEmployee } from './helpers/deleteEmployeeHandler';
import { handleEmployeeError } from './helpers/handleEmployeeError';
import { createEmployeeSchema, EMPLOYEE_SELECT, updateEmployeeSchema } from './helpers/schemas';
import { updateEmployee } from './helpers/updateEmployee';

async function safeParseBody<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch (_err) {
    throw ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400);
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    throw ApiErrorHandler.createError(
      result.error.issues[0]?.message || 'Invalid request body',
      'VALIDATION_ERROR',
      400,
    );
  }
  return result.data;
}

/**
 * GET /api/employees
 * List all employees with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');

    let query = supabase.from('employees').select(EMPLOYEE_SELECT).order('full_name');

    if (status) {
      query = query.eq('status', status);
    }
    if (role) {
      query = query.eq('role', role);
    }

    const { data: employees, error: fetchError } = await query;

    if (fetchError) {
      const pgError = fetchError as PostgrestError;
      logger.error('[Employees API] Database error fetching employees:', {
        error: pgError.message,
        code: pgError.code,
        context: {
          endpoint: '/api/employees',
          operation: 'GET',
          table: 'employees',
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(fetchError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: employees || [],
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
// POST Handler
export async function POST(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const body = await safeParseBody(request, createEmployeeSchema);

    const data = await createEmployee(supabase, body);

    return NextResponse.json({
      success: true,
      message: 'Employee created successfully',
      data,
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;

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
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const body = await safeParseBody(request, updateEmployeeSchema);
    const { id, ...updates } = body;

    const data = await updateEmployee(supabase, id, updates);

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully',
      data,
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;

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
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

  return handleDeleteEmployee(request, supabase);
}
