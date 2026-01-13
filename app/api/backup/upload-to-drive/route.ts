/**
 * POST /api/backup/upload-to-drive
 * Upload backup file to Google Drive.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { encryptBackup } from '@/lib/backup/encryption';
import { exportUserData } from '@/lib/backup/export';
import { authenticateGoogleDrive, uploadBackupToDrive } from '@/lib/backup/google-drive';
import type { EncryptionMode } from '@/lib/backup/types';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { getAppError } from '@/lib/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const uploadToDriveSchema = z
  .object({
    encryptionMode: z.enum(['prepflow-only', 'user-password']).optional(),
    password: z.string().min(8).optional(),
  })
  .refine(
    data => {
      if (data.encryptionMode === 'user-password') {
        return data.password !== undefined;
      }
      return true;
    },
    {
      message: 'password is required for user-password encryption mode',
      path: ['password'],
    },
  );

/**
 * Uploads backup file to Google Drive.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Upload response
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    const userId = user.email;
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Google Drive Upload] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = uploadToDriveSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const encryptionMode: EncryptionMode = validationResult.data.encryptionMode || 'prepflow-only';
    const password: string | undefined = validationResult.data.password;

    // Authenticate Google Drive
    const client = await authenticateGoogleDrive(userId);

    // Export user data
    const backupData = await exportUserData(userId);

    // Encrypt backup
    const encrypted = await encryptBackup(backupData, {
      mode: encryptionMode,
      password,
    });

    // Upload to Google Drive
    const fileId = await uploadBackupToDrive(client, encrypted, userId);

    // Store metadata in database
    const supabase = createSupabaseAdmin();
    const { error: metadataError } = await supabase.from('backup_metadata').insert({
      user_id: userId,
      backup_type: 'manual',
      format: 'encrypted',
      encryption_mode: encryptionMode,
      file_size_bytes: encrypted.size,
      record_count: Object.values(backupData.metadata.recordCounts).reduce((a, b) => a + b, 0),
      google_drive_file_id: fileId,
      created_at: new Date().toISOString(),
    });
    if (metadataError) {
      logger.warn('[Google Drive Upload] Error storing backup metadata:', {
        error: metadataError.message,
        code: metadataError.code,
        userId,
      });
      // Don't fail the upload if metadata storage fails
    }

    logger.info(`[Google Drive Upload] Successfully uploaded backup to Drive, file ID: ${fileId}`);

    return NextResponse.json({
      success: true,
      message: 'Backup uploaded to Google Drive successfully',
      fileId,
      filename: encrypted.filename,
    });
  } catch (error: unknown) {
    const appError = getAppError(error);
    logger.error('[Google Drive Upload] Error:', {
      error: appError.message,
      code: appError.code,
      status: appError.status,
      originalError: appError.originalError,
      context: { endpoint: '/api/backup/upload-to-drive', method: 'POST' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to upload backup to Google Drive',
        'SERVER_ERROR',
        500,
        appError.message,
      ),
      { status: 500 },
    );
  }
}
