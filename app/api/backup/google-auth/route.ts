/**
 * POST /api/backup/google-auth
 * Initiate Google OAuth flow for Google Drive connection.
 * DELETE /api/backup/google-auth
 * Disconnect Google Drive.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getGoogleDriveAuthUrl, disconnectGoogleDrive } from '@/lib/backup/google-drive';
import { logger } from '@/lib/logger';

/**
 * Handles Google Drive authentication and disconnection.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Authentication response
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        {
          error: 'Google Drive not configured',
          message:
            'Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.',
        },
        { status: 400 },
      );
    }

    const userId = session.user.email;

    const authUrl = getGoogleDriveAuthUrl(userId);

    return NextResponse.json({
      success: true,
      authUrl,
    });
  } catch (error: any) {
    logger.error('[Google Auth] Error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google auth', message: error.message },
      { status: 500 },
    );
  }
}

/**
 * Disconnects Google Drive for the current user.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Disconnection response
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;

    await disconnectGoogleDrive(userId);

    return NextResponse.json({
      success: true,
      message: 'Google Drive disconnected successfully',
    });
  } catch (error: any) {
    logger.error('[Google Auth] Error disconnecting:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Google Drive', message: error.message },
      { status: 500 },
    );
  }
}
