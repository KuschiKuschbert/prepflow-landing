/**
 * Square OAuth API Routes
 * Handles OAuth authorization URL generation and redirect.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (OAuth Flow section) for
 * comprehensive OAuth setup and usage guide.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { getSquareAuthUrl } from '@/lib/square/oauth-flow';
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
 * GET /api/square/oauth
 * Generate Square OAuth authorization URL and redirect user
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

    // Get environment from query (optional, default sandbox)
    const { searchParams } = new URL(request.url);
    const environment = (searchParams.get('environment') || 'sandbox') as 'sandbox' | 'production';

    // Generate OAuth authorization URL using PrepFlow's Application ID from environment
    const authUrl = getSquareAuthUrl(userId, environment);

    logger.dev('[Square OAuth] Generated authorization URL', {
      userId,
      environment,
    });

    // Redirect to Square authorization page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    logger.error('[Square OAuth API] Error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/square/oauth', method: 'GET' },
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
