import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getAppError } from '@/lib/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { handleCreateCleaningArea } from './helpers/createCleaningAreaHandler';
import { handleDeleteCleaningArea } from './helpers/deleteCleaningAreaHandler';
import { handleCleaningAreaError } from './helpers/handleCleaningAreaError';
import { updateCleaningAreaSchema } from './helpers/schemas';
import { updateCleaningArea } from './helpers/updateCleaningArea';

async function safeParseBody<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
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
 * GET /api/cleaning-areas
 * Get all cleaning areas
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const { data, error: dbError } = await supabase
      .from('cleaning_areas')
      .select('*')
      .order('area_name');

    if (dbError) {
      logger.error('[Cleaning Areas API] Database error fetching areas:', {
        error: dbError.message,
        code: dbError.code,
        context: { endpoint: '/api/cleaning-areas', operation: 'GET', table: 'cleaning_areas' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    logger.error('[route.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return handleCleaningAreaError(err, 'GET');
  }
}

/**
 * POST /api/cleaning-areas
 * Create a new cleaning area
 */
export async function POST(request: NextRequest) {
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleCreateCleaningArea(supabase, request);
}

/**
 * PUT /api/cleaning-areas
 * Update an existing cleaning area
 */
export async function PUT(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const body = await safeParseBody(request, updateCleaningAreaSchema);
    const { id, area_name, description, cleaning_frequency, is_active } = body;

    const updateData: Record<string, unknown> = {};
    if (area_name !== undefined) updateData.area_name = area_name;
    if (description !== undefined) updateData.description = description;
    if (cleaning_frequency !== undefined) updateData.cleaning_frequency = cleaning_frequency;
    if (is_active !== undefined) updateData.is_active = is_active;

    const data = await updateCleaningArea(supabase, id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Cleaning area updated successfully',
      data,
    });
  } catch (err: unknown) {
    if (err instanceof NextResponse) return err;

    const appError = getAppError(err);
    if (appError.status && appError.status !== 500) {
      logger.error('[Cleaning Areas API] Error with status:', {
        error: appError.message,
        status: appError.status,
        context: { endpoint: '/api/cleaning-areas', method: 'PUT' },
      });
      return NextResponse.json(
        { error: appError.message, code: appError.code },
        { status: appError.status },
      );
    }
    return handleCleaningAreaError(err, 'PUT');
  }
}

/**
 * DELETE /api/cleaning-areas
 * Delete a cleaning area
 */
export async function DELETE(request: NextRequest) {
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleDeleteCleaningArea(supabase, request);
}
