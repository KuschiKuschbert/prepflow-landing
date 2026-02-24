import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createQualificationSchema } from '../../../helpers/schemas';

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
 * PUT /api/staff/employees/[id]/qualifications/[qual_id]
 * Update a specific qualification
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; qual_id: string }> },
) {
  try {
    const { id: employeeId, qual_id: qualId } = await params;
    const { supabase, error: authError } = await standardAdminChecks(request);
    if (authError) return authError;
    if (!supabase) throw new Error('Unexpected database state');

    const body = await request.json();
    const result = createQualificationSchema.partial().safeParse(body);

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

    const { data, error: dbError } = await supabase
      .from('employee_qualifications')
      .update(result.data)
      .eq('id', qualId)
      .eq('employee_id', employeeId)
      .select(QUALIFICATION_SELECT)
      .single();

    if (dbError) {
      logger.error('[Staff Qualifications API] Database error updating qualification:', {
        error: dbError.message,
        code: dbError.code,
        qual_id: qualId,
      });
      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Qualification updated successfully',
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
    logger.error('[Staff Qualifications API] Unexpected error in PUT:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/staff/employees/[id]/qualifications/[qual_id]', method: 'PUT' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/staff/employees/[id]/qualifications/[qual_id]
 * Delete a specific qualification
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; qual_id: string }> },
) {
  try {
    const { id: employeeId, qual_id: qualId } = await params;
    const { supabase, error: authError } = await standardAdminChecks(request);
    if (authError) return authError;
    if (!supabase) throw new Error('Unexpected database state');

    const { error: dbError } = await supabase
      .from('employee_qualifications')
      .delete()
      .eq('id', qualId)
      .eq('employee_id', employeeId);

    if (dbError) {
      logger.error('[Staff Qualifications API] Database error deleting qualification:', {
        error: dbError.message,
        code: dbError.code,
        qual_id: qualId,
      });
      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Qualification deleted successfully',
    });
  } catch (err) {
    logger.error('[Staff Qualifications API] Unexpected error in DELETE:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/staff/employees/[id]/qualifications/[qual_id]', method: 'DELETE' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}
