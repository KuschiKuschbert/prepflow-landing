import type { BackupFormat, EncryptionMode } from '@/lib/backup/types';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';

interface BackupMetadata {
  recordCounts: Record<string, number>;
  fileSize: number;
}

/**
 * Store backup metadata in database
 *
 * @param {string} userId - User ID
 * @param {BackupFormat} format - Backup format
 * @param {EncryptionMode | undefined} encryptionMode - Encryption mode (if encrypted)
 * @param {BackupMetadata} metadata - Backup metadata
 */
export async function storeBackupMetadata(
  userId: string,
  format: BackupFormat,
  encryptionMode: EncryptionMode | undefined,
  metadata: BackupMetadata,
): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error: metadataError } = await supabase.from('backup_metadata').insert({
    user_id: userId,
    backup_type: 'manual',
    format,
    encryption_mode: encryptionMode || null,
    file_size_bytes: metadata.fileSize,
    record_count: Object.values(metadata.recordCounts).reduce((a, b) => a + b, 0),
    created_at: new Date().toISOString(),
  });

  if (metadataError) {
    logger.warn('[Backup Create] Error storing backup metadata:', {
      error: metadataError.message,
      code: metadataError.code,
      userId,
    });
    // Don't fail the backup if metadata storage fails
  }
}
