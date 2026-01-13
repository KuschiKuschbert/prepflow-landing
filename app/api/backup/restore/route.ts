/**
 * POST /api/backup/restore
 * Restore from backup (full, selective, or merge).
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { decryptBackup, getPrepFlowServerKey } from '@/lib/backup/encryption';
import { restoreFull, restoreMerge, restoreSelective } from '@/lib/backup/restore';
import type { MergeOptions } from '@/lib/backup/types';
import { logger } from '@/lib/logger';
import { getAppError } from '@/lib/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const restoreBackupSchema = z.object({
  backupId: z.string().optional(),
  backupFile: z.string().optional(),
  mode: z.enum(['full', 'selective', 'merge']),
  tables: z.array(z.string()).optional(),
  options: z
    .object({
      skipExisting: z.boolean().optional(),
      mergeStrategy: z.enum(['replace', 'skip', 'merge']).optional(),
    })
    .optional(),
  password: z.string().optional(),
});

/**
 * Restores from backup (full, selective, or merge).
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Restore operation response
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
      logger.warn('[Backup Restore] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = restoreBackupSchema.safeParse(body);
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

    const { backupId, backupFile, mode, tables, options, password } = validationResult.data;

    // Validate selective mode has tables
    if (mode === 'selective' && (!tables || tables.length === 0)) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'tables array is required for selective restore mode',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    let backupData;

    // If backupFile is provided, decrypt it
    if (backupFile) {
      // backupFile should be base64-encoded encrypted backup
      const encryptedData = Uint8Array.from(atob(backupFile), c => c.charCodeAt(0));

      // Determine encryption mode and get password/key
      let decryptionKey: string;

      // Try to detect encryption mode from file header
      const header = new TextDecoder().decode(encryptedData.slice(0, 16));
      if (header !== 'PREPFLOW_BACKUP') {
        return NextResponse.json(
          ApiErrorHandler.createError('Invalid backup file format', 'BAD_REQUEST', 400),
          { status: 400 },
        );
      }

      const encryptionMode = encryptedData[17]; // After header (16) + version (1)

      if (encryptionMode === 0x01) {
        // User password mode
        if (!password) {
          return NextResponse.json(
            { error: 'password is required for password-protected backups' },
            { status: 400 },
          );
        }
        decryptionKey = password;
      } else {
        // PrepFlow-only mode
        decryptionKey = await getPrepFlowServerKey();
      }

      backupData = await decryptBackup(encryptedData, decryptionKey);
    } else if (backupId) {
      // TODO: Load backup from database/storage by ID
      return NextResponse.json(
        { error: 'Loading backup by ID not yet implemented' },
        { status: 501 },
      );
    } else {
      return NextResponse.json(
        { error: 'Either backupId or backupFile is required' },
        { status: 400 },
      );
    }

    // Validate backup user ID
    if (backupData.userId !== userId) {
      return NextResponse.json(
        { error: 'Backup user ID does not match current user' },
        { status: 403 },
      );
    }

    // Perform restore based on mode
    logger.info(`[Backup Restore] Starting ${mode} restore for user ${userId}`);

    let restoreResult;

    if (mode === 'full') {
      restoreResult = await restoreFull(userId, backupData);
    } else if (mode === 'selective') {
      restoreResult = await restoreSelective(userId, backupData, tables || []);
    } else {
      // Merge mode
      restoreResult = await restoreMerge(userId, backupData, options as MergeOptions);
    }

    logger.info(
      `[Backup Restore] Restore completed: ${restoreResult.success ? 'success' : 'failed'}`,
    );

    return NextResponse.json({
      success: restoreResult.success,
      message: restoreResult.success
        ? 'Restore completed successfully'
        : 'Restore completed with errors',
      result: restoreResult,
    });
  } catch (error: unknown) {
    const appError = getAppError(error);
    logger.error('[Backup Restore] Error:', {
      error: appError.message,
      code: appError.code,
      status: appError.status,
      originalError: appError.originalError,
    });
    return NextResponse.json(
      { error: 'Failed to restore backup', message: appError.message },
      { status: 500 },
    );
  }
}
