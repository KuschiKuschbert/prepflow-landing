/**
 * GET /api/backup/drive/list
 * List backup files from Google Drive.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { authenticateGoogleDrive, listBackupsFromDrive } from '@/lib/backup/google-drive';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Lists backup files from Google Drive.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} List of backup files response
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    const userId = user.email;

    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json({
        success: true,
        backups: [],
        count: 0,
        message: 'Google Drive not configured. Please configure Google OAuth credentials.',
      });
    }

    // Authenticate Google Drive
    const client = await authenticateGoogleDrive(userId);

    // List backups
    const backups = await listBackupsFromDrive(client, userId);

    return NextResponse.json({
      success: true,
      backups,
      count: backups.length,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Handle "not connected" errors gracefully
    if (
      errorMessage.includes('not connected') ||
      errorMessage.includes('Google Drive not connected')
    ) {
      return NextResponse.json({
        success: true,
        backups: [],
        count: 0,
        message: 'Google Drive not connected. Please connect your Google account first.',
      });
    }

    logger.error('[Google Drive List] Error:', error);
    return NextResponse.json(
      { error: 'Failed to list backups from Google Drive', message: errorMessage },
      { status: 500 },
    );
  }
}
