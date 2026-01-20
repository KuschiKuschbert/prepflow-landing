import { encryptBackup } from '@/lib/backup/encryption';
import { convertToSQL } from '@/lib/backup/export';
import { storeBackupMetadata } from './storeMetadata';

export type BackupFormat = 'json' | 'sql' | 'encrypted';

export interface ProcessedBackup {
  content: string | Uint8Array;
  contentType: string;
  filename: string;
  fileSize: number;
}

export async function prepareBackupContent(
  userId: string,
  format: BackupFormat,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
