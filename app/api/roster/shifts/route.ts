/**
 * Shifts API Route
 * Handles GET (list shifts) and POST (create shift) operations.
 *
 * @module api/roster/shifts
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { buildShiftQuery } from './helpers/buildShiftQuery';
import { handleCreateShift } from './helpers/createShiftHandler';
import { parseShiftQueryParams } from './helpers/parseQueryParams';

async function getAuthenticatedUser(request: NextRequest) {
  const supabaseAdmin = createSupabaseAdmin();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(
    request.headers.get('Authorization')?.replace('Bearer ', '') || '',
  );

  // Fallback/Use Auth0 helper
  const { requireAuth } = await import('@/lib/auth0-api-helpers');
  const authUser = await requireAuth(request);

  // Get user_id from email
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single();

  if (userError || !userData) {
    throw ApiErrorHandler.createError('User not found', 'NOT_FOUND', 404);
  }
  return { userId: userData.id, supabase: supabaseAdmin };
}

/**
 * GET /api/roster/shifts
 * List shifts with optional filters and pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

    const params = parseShiftQueryParams(request);
    // Add userId to params
    const paramsWithUser = { ...params, userId };

    const { data: shifts, error: dbError, count } = await buildShiftQuery(supabase, paramsWithUser);

    if (dbError) {
      logger.error('[Shifts API] Database error fetching shifts:', {
        error: dbError.message,
        code: dbError.code,
        context: { endpoint: '/api/roster/shifts', operation: 'GET', table: 'shifts' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      shifts: shifts || [],
      count: count || 0,
      page: params.page,
      pageSize: params.pageSize,
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;

    logger.error('[Shifts API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/roster/shifts', method: 'GET' },
    });

    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }

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
 * POST /api/roster/shifts
 * Create a new shift.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

    return handleCreateShift(request, supabase, userId);
  } catch (err) {
    if (err instanceof NextResponse) return err;

    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }
    const apiError = ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500);
    return NextResponse.json(apiError, { status: 500 });
  }
}
