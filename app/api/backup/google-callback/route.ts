/**
 * GET /api/backup/google-callback
 * Handle Google OAuth callback and store refresh token.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { handleGoogleDriveCallback } from '@/lib/backup/google-drive';
import { logger } from '@/lib/logger';

/**
 * Handles Google OAuth callback and stores refresh token.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Redirect response
 */
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      logger.warn('[Google Callback] Unauthenticated access attempt');
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/webapp/settings/backup?error=unauthorized`,
      );
    }

    const expectedUserId = session.user.email;
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const stateToken = searchParams.get('state'); // Secure state token
    const error = searchParams.get('error');

    if (error) {
      logger.error('[Google Callback] OAuth error:', error);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/webapp/settings/backup?error=${encodeURIComponent(error)}`,
      );
    }

    if (!code || !stateToken) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/webapp/settings/backup?error=missing_parameters`,
      );
    }

    // Handle callback with state verification
    await handleGoogleDriveCallback(code, stateToken, expectedUserId);

    // Redirect to backup settings page with success message
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/webapp/settings/backup?success=google_connected`,
    );
  } catch (error: any) {
    logger.error('[Google Callback] Error:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/webapp/settings/backup?error=${encodeURIComponent(error.message)}`,
    );
  }
}
