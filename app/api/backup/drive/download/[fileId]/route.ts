/**
 * GET /api/backup/drive/download/[fileId]
 * Download backup file from Google Drive.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { authenticateGoogleDrive, downloadBackupFromDrive } from '@/lib/backup/google-drive';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Downloads backup file from Google Drive.
 *
 * @param {NextRequest} request - Next.js request object
 * @param {Object} context - Route context
 * @param {Promise<{fileId: string}>} context.params - Route parameters
 * @returns {Promise<NextResponse>} Backup file response
 */
export async function GET(request: NextRequest, context: { params: Promise<{ fileId: string }> }) {
  try {
    const user = await requireAuth(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    const userId = user.email;
    const { fileId } = await context.params;

    // Authenticate Google Drive
    const client = await authenticateGoogleDrive(userId);

    // Download backup
    const backupData = await downloadBackupFromDrive(client, fileId);

    // Convert to base64 for JSON response, or return as binary
    const base64Data = Buffer.from(backupData).toString('base64');

    return NextResponse.json({
      success: true,
      backupFile: base64Data,
      size: backupData.length,
    });
  } catch (error: unknown) {
    logger.error('[Google Drive Download] Error:', error);
    return NextResponse.json(
      { error: 'Failed to download backup from Google Drive', message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
