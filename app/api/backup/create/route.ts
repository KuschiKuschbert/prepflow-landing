/**
 * POST /api/backup/create
 * Create a manual backup of user data.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { encryptBackup } from '@/lib/backup/encryption';
import { convertToSQL, exportUserData } from '@/lib/backup/export';
import { logger } from '@/lib/logger';
import { getAppError } from '@/lib/utils/error';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { storeBackupMetadata } from './helpers/storeMetadata';

const createBackupSchema = z.object({
  format: z.enum(['json', 'sql', 'encrypted']).optional().default('json'),
  encryptionMode: z.enum(['user-password', 'prepflow-only']).optional(),
  password: z.string().optional(),
});

/**
 * Creates a manual backup of user data.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Backup file response
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const userId = user.email;
    let body: unknown;
    try {
      body = await request.json();
    } catch (jsonError) {
      logger.warn('[Backup Create] Failed to parse request JSON:', {
        error: jsonError instanceof Error ? jsonError.message : String(jsonError),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid JSON body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createBackupSchema.safeParse(body);
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

    const { format, encryptionMode, password } = validationResult.data;

    // Validate encryption options
    if (format === 'encrypted') {
      if (!encryptionMode) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'encryptionMode is required for encrypted backups',
            'VALIDATION_ERROR',
            400,
          ),
          { status: 400 },
        );
      }

      if (encryptionMode === 'user-password' && !password) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'password is required for user-password encryption mode',
            'VALIDATION_ERROR',
            400,
          ),
          { status: 400 },
        );
      }
    }

    // Export user data
    logger.info(`[Backup Create] Starting backup for user ${userId}, format: ${format}`);
    const backupData = await exportUserData(userId);

    let backupContent: string | Uint8Array;
    let contentType: string;
    let filename: string;
    let fileSize: number;

    if (format === 'encrypted') {
      // Encrypt backup
      const encrypted = await encryptBackup(backupData, {
        mode: encryptionMode!,
        password,
      });

      backupContent = encrypted.data;
      contentType = 'application/octet-stream';
      filename = encrypted.filename;
      fileSize = encrypted.size;

      // Store metadata in database
      await storeBackupMetadata(userId, 'encrypted', encryptionMode, {
        recordCounts: backupData.metadata.recordCounts,
        fileSize,
      });
    } else if (format === 'sql') {
      // Convert to SQL
      const sql = convertToSQL(backupData);
      backupContent = sql;
      contentType = 'text/sql';
      filename = `prepflow-backup-${new Date().toISOString().split('T')[0]}.sql`;
      fileSize = new TextEncoder().encode(sql).length;

      // Store metadata
      await storeBackupMetadata(userId, 'sql', undefined, {
        recordCounts: backupData.metadata.recordCounts,
        fileSize,
      });
    } else {
      // JSON format
      backupContent = JSON.stringify(backupData, null, 2);
      contentType = 'application/json';
      filename = `prepflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      fileSize = new TextEncoder().encode(backupContent as string).length;

      // Store metadata
      await storeBackupMetadata(userId, 'json', undefined, {
        recordCounts: backupData.metadata.recordCounts,
        fileSize,
      });
    }

    logger.info(
      `[Backup Create] Backup created successfully: ${filename}, size: ${fileSize} bytes`,
    );

    // Return backup as download
    if (format === 'encrypted') {
      // Convert Uint8Array to Buffer for NextResponse
      const buffer = Buffer.from(backupContent as Uint8Array);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': String(fileSize),
        },
      });
    } else {
      return new NextResponse(backupContent as string, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': String(fileSize),
        },
      });
    }
  } catch (error: unknown) {
    const appError = getAppError(error);

    logger.error('[Backup Create] Error creating backup:', {
      error: appError.message,
      code: appError.code,
      context: { endpoint: '/api/backup/create', method: 'POST' },
      originalError: appError.originalError,
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to create backup', 'SERVER_ERROR', 500, appError.message),
      { status: 500 },
    );
  }
}
