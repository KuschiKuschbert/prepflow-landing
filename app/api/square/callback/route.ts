/**
 * Square OAuth Callback Route
 * Handles OAuth callback from Square and exchanges authorization code for tokens.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (OAuth Flow section) for
 * comprehensive OAuth setup and usage guide.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { handleSquareCallback } from '@/lib/square/oauth-flow';
import { isSquarePOSEnabled } from '@/lib/square/feature-flags';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getDetectedBaseUrl } from '@/lib/auth0';
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
 * GET /api/square/callback
 * Handle Square OAuth callback and exchange code for tokens
 */
export async function GET(request: NextRequest) {
  const baseUrl = getDetectedBaseUrl();

  try {
    const user = await getUserFromRequest(request);
    if (!user?.email) {
      logger.warn('[Square Callback] Unauthenticated access attempt');
      return NextResponse.redirect(`${baseUrl}/webapp/square?error=unauthorized`);
    }

    // Check feature flag
    const enabled = await isSquarePOSEnabled(user.email, user.email);
    if (!enabled) {
      return NextResponse.redirect(`${baseUrl}/webapp/square?error=feature_disabled`);
    }

    const userId = await getUserIdFromEmail(user.email);
    if (!userId) {
      return NextResponse.redirect(`${baseUrl}/webapp/square?error=user_not_found`);
    }

    // Get OAuth callback parameters
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      logger.error('[Square Callback] OAuth error:', {
        error,
        errorDescription,
        userId,
      });
      return NextResponse.redirect(
        `${baseUrl}/webapp/square?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`,
      );
    }

    // Validate required parameters
    if (!code || !state) {
      logger.error('[Square Callback] Missing required parameters:', {
        hasCode: !!code,
        hasState: !!state,
        userId,
      });
      return NextResponse.redirect(`${baseUrl}/webapp/square?error=missing_parameters`);
    }

    // Handle callback using PrepFlow's credentials from environment
    // Environment is included in the state token, so we don't need to pass it separately
    // handleSquareCallback will use PrepFlow's Application ID and Secret from env vars
    await handleSquareCallback(code, state, userId);

    // Redirect to Square configuration page with success message
    return NextResponse.redirect(`${baseUrl}/webapp/square#configuration?success=square_connected`);
  } catch (error: any) {
    logger.error('[Square Callback] Error:', {
      error: error.message,
      context: { endpoint: '/api/square/callback', method: 'GET' },
    });

    return NextResponse.redirect(
      `${baseUrl}/webapp/square?error=${encodeURIComponent(error.message || 'oauth_failed')}`,
    );
  }
}
