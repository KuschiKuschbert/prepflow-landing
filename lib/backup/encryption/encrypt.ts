/**
 * Backup encryption operations.
 * Main orchestrator file.
 */

import type { BackupData, EncryptedBackup, EncryptionOptions } from '../types';
import { buildEncryptedFile } from './encrypt/build-file';
import { encryptBackupData } from './encrypt/encrypt-data';
import { encryptMetadata } from './encrypt/encrypt-metadata';

/**
 * Encrypt backup data.
 *
 * @param {BackupData} data - Backup data to encrypt
 * @param {EncryptionOptions} options - Encryption options
 * @returns {Promise<EncryptedBackup>} Encrypted backup file
 */
export async function encryptBackup(
  data: BackupData,
  options: EncryptionOptions,
): Promise<EncryptedBackup> {
  // Encrypt data and derive key
  const { ciphertext, authTag, iv, salt, encryptionKey, encryptionMode } = await encryptBackupData(
    data,
    options,
  );

  // Encrypt metadata
  const { metadataCiphertext, metadataAuthTag } = await encryptMetadata(
    data,
    encryptionKey,
    iv,
    encryptionMode,
    salt,
  );

  // Build encrypted file
  return buildEncryptedFile({
    ciphertext,
    authTag,
    iv,
    salt,
    encryptionMode,
    metadataCiphertext,
    metadataAuthTag,
    encryptionModeOption: options.mode,
  });
}
