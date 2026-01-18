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

type BackupFormat = 'json' | 'sql' | 'encrypted';

interface ProcessedBackup {
  content: string | Uint8Array;
  contentType: string;
  filename: string;
  fileSize: number;
}

async function prepareBackupContent(
  userId: string,
  format: BackupFormat,
  backupData: any, // justified: complex dynamic export data
  encryptionMode?: 'user-password' | 'prepflow-only',
  password?: string,
): Promise<ProcessedBackup> {
  if (format === 'encrypted') {
    const encrypted = await encryptBackup(backupData, {
      mode: encryptionMode!,
      password,
    });

    await storeBackupMetadata(userId, 'encrypted', encryptionMode, {
      recordCounts: backupData.metadata.recordCounts,
      fileSize: encrypted.size,
    });

    return {
      content: encrypted.data,
      contentType: 'application/octet-stream',
      filename: encrypted.filename,
      fileSize: encrypted.size,
    };
  }

  if (format === 'sql') {
    const sql = convertToSQL(backupData);
    const size = new TextEncoder().encode(sql).length;

    await storeBackupMetadata(userId, 'sql', undefined, {
      recordCounts: backupData.metadata.recordCounts,
      fileSize: size,
    });

    return {
      content: sql,
      contentType: 'text/sql',
      filename: `prepflow-backup-${new Date().toISOString().split('T')[0]}.sql`,
      fileSize: size,
    };
  }

  // Default: JSON
  const jsonContent = JSON.stringify(backupData, null, 2);
  const size = new TextEncoder().encode(jsonContent).length;

  await storeBackupMetadata(userId, 'json', undefined, {
    recordCounts: backupData.metadata.recordCounts,
    fileSize: size,
  });

  return {
    content: jsonContent,
    contentType: 'application/json',
    filename: `prepflow-backup-${new Date().toISOString().split('T')[0]}.json`,
    fileSize: size,
  };
}

/**
 * Creates a manual backup of user data.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const userId = user.email;

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
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
    if (format === 'encrypted' && (!encryptionMode || (encryptionMode === 'user-password' && !password))) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Missing encryption mode or password for encrypted backup',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    logger.info(`[Backup Create] Starting backup for user ${userId}, format: ${format}`);
    const backupData = await exportUserData(userId);

    const { content, contentType, filename, fileSize } = await prepareBackupContent(
      userId,
      format as BackupFormat,
      backupData,
      encryptionMode,
      password,
    );

    logger.info(`[Backup Create] Backup created successfully: ${filename}, size: ${fileSize} bytes`);

    const responseContent = format === 'encrypted' ? Buffer.from(content as Uint8Array) : (content as string);

    return new NextResponse(responseContent, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(fileSize),
      },
    });
  } catch (error: unknown) {
    const appError = getAppError(error);
    logger.error('[Backup Create] Error creating backup:', {
      error: appError.message,
      code: appError.code,
      originalError: appError.originalError,
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to create backup', 'SERVER_ERROR', 500, appError.message),
      { status: 500 },
    );
  }
}
