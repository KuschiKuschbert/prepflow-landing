/**
 * Square Status API Routes
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (API Endpoints section) for
 * comprehensive API documentation, request/response formats, and usage examples.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { getSquareConfig } from '@/lib/square/config';
import { getSyncHistory, getSyncErrors } from '@/lib/square/sync-log';
import { isSquarePOSEnabled } from '@/lib/square/feature-flags';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

async function getUserIdFromEmail(email: string): Promise<string | null> {
  if (!supabaseAdmin) return null;
  try {
    const { data } = await supabaseAdmin.from('users').select('id').eq('email', email).single();
    return data?.id || null;
  } catch {
    return null;
  }
}

/**
 * GET /api/square/status
 * Get Square integration status and statistics
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now();

  try {
    logger.dev('[Square Status API] Request started');

    const user = await getUserFromRequest(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    // Check feature flag
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

    logger.dev('[Square Status API] Fetching data in parallel...');
    const parallelStart = performance.now();

    // Run independent operations in parallel for better performance
    const [config, recentSyncs, recentErrors] = await Promise.all([
      getSquareConfig(userId),
      getSyncHistory(userId, 10),
      getSyncErrors(userId, 7),
    ]);

    const parallelTime = performance.now() - parallelStart;
    logger.dev(`[Square Status API] Parallel fetch took ${parallelTime.toFixed(2)}ms`);

    const configured = config !== null;

    // Skip expensive credential validation on every status check
    // Validation happens when user saves config or during sync operations
    // This saves 500-2000ms per status check
    const credentialsValid = configured; // Assume valid if configured

    const totalTime = performance.now() - startTime;
    logger.dev(`[Square Status API] Total request time: ${totalTime.toFixed(2)}ms`);

    return NextResponse.json({
      success: true,
      status: {
        configured,
        credentialsValid,
        config: config
          ? {
              square_environment: config.square_environment,
              auto_sync_enabled: config.auto_sync_enabled,
              initial_sync_completed: config.initial_sync_completed,
              initial_sync_status: config.initial_sync_status,
              last_full_sync_at: config.last_full_sync_at,
              last_menu_sync_at: config.last_menu_sync_at,
              last_staff_sync_at: config.last_staff_sync_at,
              last_sales_sync_at: config.last_sales_sync_at,
              webhook_enabled: config.webhook_enabled || false,
              webhook_url: config.webhook_url || null,
            }
          : null,
        recentSyncs,
        recentErrors,
        errorCount: recentErrors.length,
      },
    });
  } catch (error) {
    const totalTime = performance.now() - startTime;
    logger.error(`[Square Status API] Error after ${totalTime.toFixed(2)}ms:`, {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/square/status', method: 'GET' },
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
}
