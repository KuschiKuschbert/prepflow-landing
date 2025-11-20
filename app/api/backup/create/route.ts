/**
 * POST /api/backup/create
 * Create a manual backup of user data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { exportUserData, convertToSQL } from '@/lib/backup/export';
import { encryptBackup } from '@/lib/backup/encryption';
import type { BackupFormat, EncryptionMode } from '@/lib/backup/types';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const body = await request.json();
    const format: BackupFormat = body.format || 'json';
    const encryptionMode: EncryptionMode | undefined = body.encryptionMode;
    const password: string | undefined = body.password;

    // Validate format
    if (!['json', 'sql', 'encrypted'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be json, sql, or encrypted' },
        { status: 400 },
      );
    }

    // Validate encryption options
    if (format === 'encrypted') {
      if (!encryptionMode) {
        return NextResponse.json(
          { error: 'encryptionMode is required for encrypted backups' },
          { status: 400 },
        );
      }

      if (encryptionMode === 'user-password' && !password) {
        return NextResponse.json(
          { error: 'password is required for user-password encryption mode' },
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
      const supabase = createSupabaseAdmin();
      await supabase.from('backup_metadata').insert({
        user_id: userId,
        backup_type: 'manual',
        format: 'encrypted',
        encryption_mode: encryptionMode,
        file_size_bytes: fileSize,
        record_count: Object.values(backupData.metadata.recordCounts).reduce((a, b) => a + b, 0),
        created_at: new Date().toISOString(),
      });
    } else if (format === 'sql') {
      // Convert to SQL
      const sql = convertToSQL(backupData);
      backupContent = sql;
      contentType = 'text/sql';
      filename = `prepflow-backup-${new Date().toISOString().split('T')[0]}.sql`;
      fileSize = new TextEncoder().encode(sql).length;

      // Store metadata
      const supabase = createSupabaseAdmin();
      await supabase.from('backup_metadata').insert({
        user_id: userId,
        backup_type: 'manual',
        format: 'sql',
        file_size_bytes: fileSize,
        record_count: Object.values(backupData.metadata.recordCounts).reduce((a, b) => a + b, 0),
        created_at: new Date().toISOString(),
      });
    } else {
      // JSON format
      backupContent = JSON.stringify(backupData, null, 2);
      contentType = 'application/json';
      filename = `prepflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      fileSize = new TextEncoder().encode(backupContent as string).length;

      // Store metadata
      const supabase = createSupabaseAdmin();
      await supabase.from('backup_metadata').insert({
        user_id: userId,
        backup_type: 'manual',
        format: 'json',
        file_size_bytes: fileSize,
        record_count: Object.values(backupData.metadata.recordCounts).reduce((a, b) => a + b, 0),
        created_at: new Date().toISOString(),
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
  } catch (error: any) {
    logger.error('[Backup Create] Error creating backup:', error);
    return NextResponse.json(
      { error: 'Failed to create backup', message: error.message },
      { status: 500 },
    );
  }
}
