import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createQualificationSchema } from '../../helpers/schemas';

const QUALIFICATION_SELECT = `
  *,
  qualification_types (
    id,
    name,
    description,
    is_required,
    default_expiry_days
  )
`;

/**
 * GET /api/staff/employees/[id]/qualifications
 * List all qualifications for a specific employee
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: employeeId } = await params;
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const { data, error: dbError } = await supabase
      .from('employee_qualifications')
      .select(QUALIFICATION_SELECT)
      .eq('employee_id', employeeId)
      .order('expiry_date', { ascending: true });

    if (dbError) {
      logger.error('[Staff Qualifications API] Database error fetching qualifications:', {
        error: dbError.message,
        code: dbError.code,
        employee_id: employeeId,
      });
      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    logger.error('[Staff Qualifications API] Unexpected error in GET:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/staff/employees/[id]/qualifications', method: 'GET' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}

/**
 * POST /api/staff/employees/[id]/qualifications
 * Add a new qualification to an employee
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: employeeId } = await params;
    const { supabase, error: authError } = await standardAdminChecks(request);
    if (authError) return authError;
    if (!supabase) throw new Error('Unexpected database state');

    const body = await request.json();
    const result = createQualificationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          result.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Verify employee exists
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id')
      .eq('id', employeeId)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const { data, error: dbError } = await supabase
      .from('employee_qualifications')
      .insert({
        employee_id: employeeId,
        ...result.data,
      })
      .select(QUALIFICATION_SELECT)
      .single();

    if (dbError) {
      logger.error('[Staff Qualifications API] Database error creating qualification:', {
        error: dbError.message,
        code: dbError.code,
        employee_id: employeeId,
      });
      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Qualification added successfully',
      data,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          err.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }
    logger.error('[Staff Qualifications API] Unexpected error in POST:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/staff/employees/[id]/qualifications', method: 'POST' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}
