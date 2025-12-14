/**
 * GET /api/backup/google-callback
 * Handle Google OAuth callback and store refresh token.
 */

import { getDetectedBaseUrl } from '@/lib/auth0';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { handleGoogleDriveCallback } from '@/lib/backup/google-drive';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles Google OAuth callback and stores refresh token.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Redirect response
 */
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await requireAuth(request);
    if (!user?.email) {
      logger.warn('[Google Callback] Unauthenticated access attempt');
      const baseUrl = getDetectedBaseUrl();
      return NextResponse.redirect(`${baseUrl}/webapp/settings/backup?error=unauthorized`);
    }

    const expectedUserId = user.email;
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const stateToken = searchParams.get('state'); // Secure state token
    const error = searchParams.get('error');

    const baseUrl = getDetectedBaseUrl();

    if (error) {
      logger.error('[Google Callback] OAuth error:', error);
      return NextResponse.redirect(
        `${baseUrl}/webapp/settings/backup?error=${encodeURIComponent(error)}`,
      );
    }

    if (!code || !stateToken) {
      return NextResponse.redirect(`${baseUrl}/webapp/settings/backup?error=missing_parameters`);
    }

    // Handle callback with state verification
    await handleGoogleDriveCallback(code, stateToken, expectedUserId);

    // Redirect to backup settings page with success message
    return NextResponse.redirect(`${baseUrl}/webapp/settings/backup?success=google_connected`);
  } catch (error: any) {
    logger.error('[Google Callback] Error:', error);
    const baseUrl = getDetectedBaseUrl();
    return NextResponse.redirect(
      `${baseUrl}/webapp/settings/backup?error=${encodeURIComponent(error.message)}`,
    );
  }
}
