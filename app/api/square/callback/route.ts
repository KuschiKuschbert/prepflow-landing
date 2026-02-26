/**
 * Square OAuth Callback Route
 * Handles OAuth callback from Square and exchanges authorization code for tokens.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (OAuth Flow section) for
 * comprehensive OAuth setup and usage guide.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { standardAdminChecks } from '@/lib/admin-auth';
import { getDetectedBaseUrl } from '@/lib/auth0';
import { logger } from '@/lib/logger';
import { isSquarePOSEnabled } from '@/lib/square/feature-flags';
import { handleSquareCallback } from '@/lib/square/oauth-flow';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

async function getUserIdFromEmail(email: string, supabase: SupabaseClient): Promise<string | null> {
  try {
    const { data } = await supabase.from('users').select('id').eq('email', email).single();
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
    const { supabase, adminUser, error: authError } = await standardAdminChecks(request);
    if (authError) return authError;
    if (!supabase || !adminUser?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database unavailable', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check feature flag
    const enabled = await isSquarePOSEnabled(adminUser.email, adminUser.email);
    if (!enabled) {
      return NextResponse.redirect(`${baseUrl}/webapp/square?error=feature_disabled`);
    }

    const userId = await getUserIdFromEmail(adminUser.email, supabase);
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
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('[Square Callback] Error:', {
      error: err.message,
      context: { endpoint: '/api/square/callback', method: 'GET' },
    });

    return NextResponse.redirect(
      `${baseUrl}/webapp/square?error=${encodeURIComponent(err.message || 'oauth_failed')}`,
    );
  }
}
