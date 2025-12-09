import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextRequest, NextResponse } from 'next/server';
import { fetchError } from './helpers/fetchError';
import { handleErrorApiError } from './helpers/handleError';
import { updateError, updateErrorSchema } from './helpers/updateError';

/**
 * GET /api/admin/errors/[id]
 * Get error log details
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    const result = await fetchError(id);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({
      success: true,
      error: result.errorLog,
    });
  } catch (error) {
    return handleErrorApiError(error, 'GET');
  }
}

/**
 * PUT /api/admin/errors/[id]
 * Update error log (status, notes)
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const adminUser = await requireAdmin(request);
    const { id } = await context.params;
    const body = await request.json();

    // Validate request body
    const validationResult = updateErrorSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Invalid request data',
          'VALIDATION_ERROR',
          400,
          validationResult.error.issues,
        ),
        { status: 400 },
      );
    }

    const result = await updateError(id, validationResult.data, adminUser);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({
      success: true,
      error: result.errorLog,
      message: 'Error log updated successfully',
    });
  } catch (error) {
    return handleErrorApiError(error, 'PUT');
  }
}
