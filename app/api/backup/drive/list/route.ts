/**
 * GET /api/backup/drive/list
 * List backup files from Google Drive.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { authenticateGoogleDrive, listBackupsFromDrive } from '@/lib/backup/google-drive';
import { logger } from '@/lib/logger';

/**
 * Lists backup files from Google Drive.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} List of backup files response
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;

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
  } catch (error: any) {
    // Handle "not connected" errors gracefully
    if (
      error.message?.includes('not connected') ||
      error.message?.includes('Google Drive not connected')
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
      { error: 'Failed to list backups from Google Drive', message: error.message },
      { status: 500 },
    );
  }
}
