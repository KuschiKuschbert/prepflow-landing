import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

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
 * GET /api/employees/[id]/qualifications
 * Get all qualifications for an employee
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
      .from('employee_qualifications')
      .select(QUALIFICATION_SELECT)
      .eq('employee_id', id)
      .order('expiry_date', { ascending: true, nullsFirst: false });

    if (error) {
      logger.error('[Employee Qualifications API] Database error fetching qualifications:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/employees/[id]/qualifications',
          operation: 'GET',
          table: 'employee_qualifications',
          employee_id: id,
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
    logger.error('[Employee Qualifications API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/employees/[id]/qualifications', method: 'GET' },
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
 * POST /api/employees/[id]/qualifications
 * Add a qualification to an employee
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const {
      qualification_type_id,
      certificate_number,
      issue_date,
      expiry_date,
      issuing_authority,
      document_url,
      notes,
    } = body;

    if (!qualification_type_id || !issue_date) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'qualification_type_id and issue_date are required',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Verify employee exists
    const { data: employee, error: employeeError } = await supabaseAdmin
      .from('employees')
      .select('id')
      .eq('id', id)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        ApiErrorHandler.createError('Employee not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('employee_qualifications')
      .insert({
        employee_id: id,
        qualification_type_id,
        certificate_number: certificate_number || null,
        issue_date,
        expiry_date: expiry_date || null,
        issuing_authority: issuing_authority || null,
        document_url: document_url || null,
        notes: notes || null,
      })
      .select(QUALIFICATION_SELECT)
      .single();

    if (error) {
      logger.error('[Employee Qualifications API] Database error creating qualification:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/employees/[id]/qualifications',
          operation: 'POST',
          table: 'employee_qualifications',
          employee_id: id,
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Qualification added successfully',
      data,
    });
  } catch (err) {
    logger.error('[Employee Qualifications API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/employees/[id]/qualifications', method: 'POST' },
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

