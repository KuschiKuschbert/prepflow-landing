import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { logAdminApiAction } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchHiddenFlags } from './helpers/fetchHiddenFlags';
import { updateHiddenFlag } from './helpers/updateHiddenFlag';
import { deleteHiddenFlag } from './helpers/deleteHiddenFlag';

const updateHiddenFlagSchema = z.object({
  feature_key: z.string().min(1),
  is_unlocked: z.boolean().optional(),
  is_enabled: z.boolean().optional(),
  description: z.string().optional().nullable(),
});
const deleteHiddenFlagSchema = z.object({ feature_key: z.string().min(1) });

/**
 * GET /api/admin/features/hidden
 * List all hidden feature flags
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const result = await fetchHiddenFlags();
    if (result instanceof NextResponse) return result;

    return NextResponse.json({
      success: true,
      flags: result.flags,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin Hidden Features API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/features/hidden', method: 'GET' },
    });

    const apiError = ApiErrorHandler.fromException(
      error instanceof Error ? error : new Error(String(error)),
    );
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
}

/**
 * PUT /api/admin/features/hidden
 * Update a hidden feature flag
 */
export async function PUT(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);

    let body;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Admin Hidden Features API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'INVALID_REQUEST', 400),
        { status: 400 },
      );
    }
    const validated = updateHiddenFlagSchema.parse(body);

    const result = await updateHiddenFlag(validated);
    if (result instanceof NextResponse) return result;

    // Build update data for audit log
    const updateData: Record<string, unknown> = {};
    if (validated.is_unlocked !== undefined) updateData.is_unlocked = validated.is_unlocked;
    if (validated.is_enabled !== undefined) updateData.is_enabled = validated.is_enabled;
    if (validated.description !== undefined) updateData.description = validated.description;

    await logAdminApiAction(adminUser, 'update_hidden_feature_flag', request, {
      target_type: 'hidden_feature_flag',
      target_id: validated.feature_key,
      details: updateData,
    });

    return NextResponse.json({
      success: true,
      flag: result.flag,
    });
  } catch (error) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    const apiError = ApiErrorHandler.fromException(
      error instanceof Error ? error : new Error(String(error)),
    );
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
}

/**
 * DELETE /api/admin/features/hidden
 * Delete a hidden feature flag
 */
export async function DELETE(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);

    let body;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Admin Hidden Features API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'INVALID_REQUEST', 400),
        { status: 400 },
      );
    }
    const { feature_key } = deleteHiddenFlagSchema.parse(body);

    const result = await deleteHiddenFlag(feature_key);
    if (result instanceof NextResponse) return result;

    await logAdminApiAction(adminUser, 'delete_hidden_feature_flag', request, {
      target_type: 'hidden_feature_flag',
      target_id: feature_key,
    });

    return NextResponse.json({
      success: true,
      message: `Hidden feature flag ${feature_key} deleted`,
    });
  } catch (error) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    const apiError = ApiErrorHandler.fromException(
      error instanceof Error ? error : new Error(String(error)),
    );
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
}
