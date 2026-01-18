import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { fetchError } from './helpers/fetchError';
import { handleErrorApiError } from './helpers/handleError';
import { updateError, updateErrorSchema } from './helpers/updateError';

// Helper to safely parse request body
async function safeParseBody(request: NextRequest) {
  try {
    return await request.json();
  } catch (err) {
    logger.warn('[Admin Errors API] Failed to parse request body:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/**
 * GET /api/admin/errors/[id]
 * Get error log details
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await standardAdminChecks(request);
    if (error) return error;

    const { id } = await context.params;

    const result = await fetchError(id);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({
      success: true,
      error: result.errorLog,
    });
  } catch (error) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return handleErrorApiError(error, 'GET');
  }
}

/**
 * PUT /api/admin/errors/[id]
 * Update error log (status, notes)
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { adminUser, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!adminUser) throw new Error('Unexpected authentication state');

    const { id } = await context.params;
    const body = await safeParseBody(request);

    if (!body) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

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
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return handleErrorApiError(error, 'PUT');
  }
}
