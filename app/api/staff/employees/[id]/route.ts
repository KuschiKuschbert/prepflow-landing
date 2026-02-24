/**
 * Staff Employee API Route (by ID)
 * Handles GET (get employee), PUT (update employee), and DELETE (delete employee) operations.
 *
 * 📚 Square Integration: This route automatically triggers Square sync hooks after employee
 * update operations. See `docs/SQUARE_API_REFERENCE.md` (Automatic Sync section) for details.
 *
 * @module api/staff/employees/[id]
 */

import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkEmployeeExists } from './helpers/checkEmployeeExists';
import { deleteEmployee } from './helpers/deleteEmployee';
import { getEmployee } from './helpers/getEmployee';
import { triggerEmployeeSyncHook } from './helpers/sync';
import { updateEmployee } from './helpers/updateEmployee';
import { updateEmployeeSchema } from './helpers/validation';

/**
 * GET /api/staff/employees/[id]
 * Get a single employee by ID.
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const { id } = await context.params;
    return await getEmployee(supabase, id);
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
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const { id } = await context.params;
    const employeeId = id;

    // Check if employee exists
    const existsResult = await checkEmployeeExists(supabase, employeeId);
    if (existsResult instanceof NextResponse) {
      return existsResult;
    }

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

    const zodValidation = updateEmployeeSchema.safeParse(body);
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

    const result = await updateEmployee(
      supabase,
      employeeId,
      zodValidation.data,
      existsResult.employee,
    );

    // Trigger Square sync hook after successful update (non-blocking)
    if (result.status === 200) {
      triggerEmployeeSyncHook(request, employeeId);
    }

    return result;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          err.issues[0]?.message || 'Invalid request data',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }
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
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const { id } = await context.params;
    return await deleteEmployee(supabase, id);
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
