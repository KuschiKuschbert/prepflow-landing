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
 * PUT /api/employees/[id]/qualifications/[qual_id]
 * Update an employee qualification
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; qual_id: string }> },
) {
  try {
    const { id, qual_id } = await context.params;
    const body = await request.json();
    const { certificate_number, issue_date, expiry_date, issuing_authority, document_url, notes } =
      body;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Verify qualification belongs to employee
    const { data: qualification, error: checkError } = await supabaseAdmin
      .from('employee_qualifications')
      .select('id, employee_id')
      .eq('id', qual_id)
      .eq('employee_id', id)
      .single();

    if (checkError || !qualification) {
      return NextResponse.json(
        ApiErrorHandler.createError('Qualification not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (certificate_number !== undefined)
      updateData.certificate_number = certificate_number || null;
    if (issue_date !== undefined) updateData.issue_date = issue_date;
    if (expiry_date !== undefined) updateData.expiry_date = expiry_date || null;
    if (issuing_authority !== undefined) updateData.issuing_authority = issuing_authority || null;
    if (document_url !== undefined) updateData.document_url = document_url || null;
    if (notes !== undefined) updateData.notes = notes || null;

    const { data, error } = await supabaseAdmin
      .from('employee_qualifications')
      .update(updateData)
      .eq('id', qual_id)
      .select(QUALIFICATION_SELECT)
      .single();

    if (error) {
      logger.error('[Employee Qualifications API] Database error updating qualification:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/employees/[id]/qualifications/[qual_id]',
          operation: 'PUT',
          table: 'employee_qualifications',
          qualification_id: qual_id,
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Qualification updated successfully',
      data,
    });
  } catch (err) {
    logger.error('[Employee Qualifications API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/employees/[id]/qualifications/[qual_id]', method: 'PUT' },
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
 * DELETE /api/employees/[id]/qualifications/[qual_id]
 * Remove an employee qualification
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; qual_id: string }> },
) {
  try {
    const { id, qual_id } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Verify qualification belongs to employee
    const { data: qualification, error: checkError } = await supabaseAdmin
      .from('employee_qualifications')
      .select('id, employee_id')
      .eq('id', qual_id)
      .eq('employee_id', id)
      .single();

    if (checkError || !qualification) {
      return NextResponse.json(
        ApiErrorHandler.createError('Qualification not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const { error } = await supabaseAdmin
      .from('employee_qualifications')
      .delete()
      .eq('id', qual_id);

    if (error) {
      logger.error('[Employee Qualifications API] Database error deleting qualification:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/employees/[id]/qualifications/[qual_id]',
          operation: 'DELETE',
          table: 'employee_qualifications',
          qualification_id: qual_id,
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Qualification removed successfully',
    });
  } catch (err) {
    logger.error('[Employee Qualifications API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/employees/[id]/qualifications/[qual_id]', method: 'DELETE' },
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
