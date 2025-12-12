/**
 * POST /api/backup/restore
 * Restore from backup (full, selective, or merge).
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { decryptBackup, getPrepFlowServerKey } from '@/lib/backup/encryption';
import { restoreFull, restoreSelective, restoreMerge } from '@/lib/backup/restore';
import type { MergeOptions } from '@/lib/backup/types';

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.email;
    const body = await request.json();
    const { backupId, backupFile, mode, tables, options, password } = body;

    // Validate mode
    if (!['full', 'selective', 'merge'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid restore mode. Must be full, selective, or merge' },
        { status: 400 },
      );
    }

    // Validate selective mode has tables
    if (mode === 'selective' && (!tables || !Array.isArray(tables) || tables.length === 0)) {
      return NextResponse.json(
        { error: 'tables array is required for selective restore mode' },
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
        return NextResponse.json({ error: 'Invalid backup file format' }, { status: 400 });
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
      restoreResult = await restoreSelective(userId, backupData, tables);
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
  } catch (error: any) {
    logger.error('[Backup Restore] Error:', error);
    return NextResponse.json(
      { error: 'Failed to restore backup', message: error.message },
      { status: 500 },
    );
  }
}
