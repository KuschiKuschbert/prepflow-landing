/**
 * Square Sync API Routes
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (API Endpoints, Sync Operations sections) for
 * comprehensive sync operation documentation, request/response formats, and usage examples.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { isSquarePOSEnabled } from '@/lib/square/feature-flags';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import {
  syncCatalogFromSquare,
  syncCatalogToSquare,
  syncCatalogBidirectional,
} from '@/lib/square/sync/catalog';
import { syncOrdersFromSquare, syncRecentOrdersFromSquare } from '@/lib/square/sync/orders';
import {
  syncStaffFromSquare,
  syncStaffToSquare,
  syncStaffBidirectional,
} from '@/lib/square/sync/staff';
import { syncCostsToSquare } from '@/lib/square/sync/costs';
import { performInitialSync } from '@/lib/square/sync/initial-sync';
import { z } from 'zod';
import { handleSyncOperation } from './helpers/sync-operation-handler';

async function getUserIdFromEmail(email: string): Promise<string | null> {
  if (!supabaseAdmin) return null;
  try {
    const { data } = await supabaseAdmin.from('users').select('id').eq('email', email).single();
    return data?.id || null;
  } catch {
    return null;
  }
}

const syncRequestSchema = z.object({
  operation: z.enum(['catalog', 'orders', 'staff', 'costs', 'initial_sync']),
  direction: z.enum(['from_square', 'to_square', 'bidirectional']).optional(),
  options: z
    .object({
      locationId: z.string().optional(),
      dishIds: z.array(z.string().uuid()).optional(),
      employeeIds: z.array(z.string().uuid()).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      days: z.number().int().positive().optional(),
    })
    .optional(),
});

/**
 * POST /api/square/sync
 * Trigger manual sync operation
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    const enabled = await isSquarePOSEnabled(user.email, user.email);
    if (!enabled) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Square POS integration is not enabled',
          'FEATURE_DISABLED',
          403,
        ),
        { status: 403 },
      );
    }

    const userId = await getUserIdFromEmail(user.email);
    if (!userId) {
      return NextResponse.json(
        ApiErrorHandler.createError('User not found in database', 'USER_NOT_FOUND', 404),
        { status: 404 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Square Sync API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = syncRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { operation, direction, options } = validationResult.data;
    const result = await handleSyncOperation(operation, direction, options, userId);

    return NextResponse.json({
      success: result.success,
      details: result,
    });
  } catch (error) {
    logger.error('[Square Sync API] Error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/square/sync', method: 'POST' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : String(error)
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
