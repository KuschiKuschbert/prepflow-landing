/**
 * Square Mappings API Routes
 * Handles fetching and managing Square entity mappings.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (API Endpoints, Mappings section) for
 * detailed documentation and usage examples.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { getUserMappings } from '@/lib/square/mappings';
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
 * GET /api/square/mappings
 * Get all Square mappings for the current user
 */
export async function GET(request: NextRequest) {
  try {
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
        ApiErrorHandler.createError('Square POS integration is not enabled', 'FEATURE_DISABLED', 403),
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

    // Get optional query parameters
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entity_type') || undefined;

    // Fetch mappings
    const mappings = await getUserMappings(userId, entityType);

    return NextResponse.json({
      success: true,
      mappings,
    });
  } catch (error) {
    logger.error('[Square Mappings API] Error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/square/mappings', method: 'GET' },
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



