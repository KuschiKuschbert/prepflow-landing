import { logAdminApiAction } from '@/lib/admin-audit';
import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateFlagSchema = z.object({
  enabled: z.boolean(),
  user_id: z.string().uuid().optional().nullable(),
});

// Helper to safely parse request body
async function safeParseBody(request: NextRequest) {
  try {
    return await request.json();
  } catch (err) {
    logger.warn('[Admin Features API] Failed to parse request body:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return {};
  }
}

// Helper to apply user filter to query
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyUserFilter(query: any, userId: string | null | undefined) {
  if (userId !== undefined && userId !== null) {
    return query.eq('user_id', userId);
  }
  return query.is('user_id', null);
}

/**
 * PUT /api/admin/features/[flag]
 * Update a feature flag
 */
// ... imports

// ... schema and helper functions

// Helper for error handling
function handleRouteError(error: unknown, context: { endpoint: string; method: string }) {
  if (error instanceof NextResponse) {
    return error;
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      ApiErrorHandler.createError('Invalid request data', 'VALIDATION_ERROR', 400, error.issues),
      { status: 400 },
    );
  }

  logger.error('[Admin Features API] Unexpected error:', {
    error: error instanceof Error ? error.message : String(error),
    context,
  });

  return NextResponse.json(
    ApiErrorHandler.createError(
      process.env.NODE_ENV === 'development'
        ? error instanceof Error
          ? error.message
          : 'Unknown error'
        : 'Internal server error',
      'SERVER_ERROR',
      500,
    ),
    { status: 500 },
  );
}

export async function PUT(request: NextRequest, context: { params: Promise<{ flag: string }> }) {
  try {
    const adminUser = await requireAdmin(request);
    const { flag } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const validated = updateFlagSchema.parse(body);

    const result = await updateFeatureFlag(flag, validated, context);
    if (result instanceof NextResponse) return result;

    const { flagData } = result;

    await logAdminApiAction(adminUser, 'update_feature_flag', request, {
      target_type: 'feature_flag',
      target_id: flagData.id,
      details: { flag_key: flag, enabled: validated.enabled },
    });

    return NextResponse.json({
      success: true,
      flag: flagData,
    });
  } catch (error) {
    return handleRouteError(error, { endpoint: '/api/admin/features/[flag]', method: 'PUT' });
  }
}

async function updateFeatureFlag(
  flag: string,
  validated: z.infer<typeof updateFlagSchema>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: unknown,
): Promise<{ flagData: { id: string; [key: string]: unknown } } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  let query = supabaseAdmin
    .from('feature_flags')
    .update({
      enabled: validated.enabled,
      updated_at: new Date().toISOString(),
    })
    .eq('flag_key', flag);

  query = applyUserFilter(query, validated.user_id);

  const { data: flagData, error } = await query.select().single();

  if (error) {
    logger.error('[Admin Features API] Database error updating flag:', {
      error: error.message,
      context: { endpoint: `/api/admin/features/${flag}`, method: 'PUT' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to update feature flag', 'DATABASE_ERROR', 500, {
        supabaseError: error.message,
      }),
      { status: 500 },
    );
  }

  return { flagData };
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ flag: string }> }) {
  try {
    const adminUser = await requireAdmin(request);
    const { flag } = await context.params;

    const body = await safeParseBody(request);
    const userId = (body as { user_id?: string | null }).user_id || null;

    const error = await deleteFeatureFlag(flag, userId);
    if (error) return error;

    await logAdminApiAction(adminUser, 'delete_feature_flag', request, {
      target_type: 'feature_flag',
      target_id: flag,
      details: { flag_key: flag },
    });

    return NextResponse.json({
      success: true,
      message: 'Feature flag deleted successfully',
    });
  } catch (error) {
    return handleRouteError(error, { endpoint: '/api/admin/features/[flag]', method: 'DELETE' });
  }
}

async function deleteFeatureFlag(flag: string, userId: string | null): Promise<NextResponse | null> {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    let query = supabaseAdmin.from('feature_flags').delete().eq('flag_key', flag);
    query = applyUserFilter(query, userId);

    const { error } = await query;

    if (error) {
      logger.error('[Admin Features API] Database error deleting flag:', {
        error: error.message,
        context: { endpoint: `/api/admin/features/${flag}`, method: 'DELETE' },
      });

      return NextResponse.json(
        ApiErrorHandler.createError('Failed to update feature flag', 'DATABASE_ERROR', 500, {
          supabaseError: error.message,
        }),
        { status: 500 },
      );
    }
    return null;
}
