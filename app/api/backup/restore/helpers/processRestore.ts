import { ApiErrorHandler } from '@/lib/api-error-handler';
import { decryptBackup, getPrepFlowServerKey } from '@/lib/backup/encryption';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

const BACKUP_HEADER = 'PREPFLOW_BACKUP';
const HEADER_SIZE = 16;
const ENCRYPTION_MODE_OFFSET = 17;

export async function processRestoreRequest(
  request: NextRequest,
  backupFile: string | undefined,
  password?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ success: true; data: any } | { success: false; response: NextResponse }> {
  if (backupFile) {
    try {
      const encryptedData = Uint8Array.from(atob(backupFile), c => c.charCodeAt(0));
      const header = new TextDecoder().decode(encryptedData.slice(0, HEADER_SIZE));

      if (header !== BACKUP_HEADER) {
        return {
          success: false,
          response: NextResponse.json(
            ApiErrorHandler.createError('Invalid backup file format', 'BAD_REQUEST', 400),
            { status: 400 },
          ),
        };
      }

      const encryptionMode = encryptedData[ENCRYPTION_MODE_OFFSET];
      let decryptionKey: string;

      if (encryptionMode === 0x01) {
        if (!password) {
          return {
            success: false,
            response: NextResponse.json(
              ApiErrorHandler.createError('password is required for encryption', 'BAD_REQUEST', 400),
              { status: 400 },
            ),
          };
        }
        decryptionKey = password;
      } else {
        decryptionKey = await getPrepFlowServerKey();
      }

      const backupData = await decryptBackup(encryptedData, decryptionKey);
      return { success: true, data: backupData };
    } catch (error) {
      logger.error('[Backup Restore] Decryption error:', error);
      return {
        success: false,
        response: NextResponse.json(
          ApiErrorHandler.createError(
            'Failed to decrypt/parse backup file',
            'BAD_REQUEST',
            400,
          ),
          { status: 400 },
        ),
      };
    }
  }

  return {
    success: false,
    response: NextResponse.json(
      ApiErrorHandler.createError(
        'Either backupId or backupFile is required (backupId not implemented)',
        'BAD_REQUEST',
        400,
      ),
      { status: 400 },
    ),
  };
}
