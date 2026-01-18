/**
 * Build encrypted backup file structure.
 */

import type { EncryptedBackup } from '../../types';
import { BACKUP_HEADER, BACKUP_VERSION } from '../constants';

interface BuildFileParams {
  ciphertext: Uint8Array;
  authTag: Uint8Array;
  iv: Uint8Array;
  salt: Uint8Array;
  encryptionMode: number;
  metadataCiphertext: Uint8Array;
  metadataAuthTag: Uint8Array;
  encryptionModeOption: 'user-password' | 'prepflow-only';
}

/**
 * Build encrypted backup file structure.
 */
export function buildEncryptedFile({
  ciphertext,
  authTag,
  iv,
  salt,
  encryptionMode,
  metadataCiphertext,
  metadataAuthTag,
  encryptionModeOption,
}: BuildFileParams): EncryptedBackup {
  // Build backup file structure
  // Format: [Header][Version][Mode][Salt][IV][MetadataSize][EncryptedMetadata][MetadataAuthTag][EncryptedData][AuthTag]
  const headerBuffer = new TextEncoder().encode(BACKUP_HEADER);
  const versionBuffer = new Uint8Array([BACKUP_VERSION]);
  const modeBuffer = new Uint8Array([encryptionMode]);
  const saltSizeBuffer = new Uint8Array([salt.length]); // 1 byte for salt length

  // Calculate sizes
  const metadataSize = metadataCiphertext.length;
  const metadataSizeBuffer = new Uint8Array(4);
  new DataView(metadataSizeBuffer.buffer).setUint32(0, metadataSize, false); // Big-endian

  // Combine all parts
  const totalSize =
    headerBuffer.length +
    versionBuffer.length +
    modeBuffer.length +
    saltSizeBuffer.length +
    salt.length +
    iv.length +
    metadataSizeBuffer.length +
    metadataCiphertext.length +
    metadataAuthTag.length +
    ciphertext.length +
    authTag.length;

  const backupFile = new Uint8Array(totalSize);
  let offset = 0;

  // Write header
  backupFile.set(headerBuffer, offset);
  offset += headerBuffer.length;

  // Write version
  backupFile.set(versionBuffer, offset);
  offset += versionBuffer.length;

  // Write encryption mode
  backupFile.set(modeBuffer, offset);
  offset += modeBuffer.length;

  // Write salt length and salt (needed for key derivation)
  backupFile.set(saltSizeBuffer, offset);
  offset += saltSizeBuffer.length;
  backupFile.set(salt, offset);
  offset += salt.length;

  // Write IV
  backupFile.set(iv, offset);
  offset += iv.length;

  // Write metadata size
  backupFile.set(metadataSizeBuffer, offset);
  offset += metadataSizeBuffer.length;

  // Write encrypted metadata
  backupFile.set(metadataCiphertext, offset);
  offset += metadataCiphertext.length;

  // Write metadata auth tag
  backupFile.set(metadataAuthTag, offset);
  offset += metadataAuthTag.length;

  // Write encrypted data
  backupFile.set(ciphertext, offset);
  offset += ciphertext.length;

  // Write auth tag
  backupFile.set(authTag, offset);

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `prepflow-backup-${timestamp}.pfbk`;

  return {
    data: backupFile,
    filename,
    size: backupFile.length,
    encryptionMode: encryptionModeOption,
    createdAt: new Date().toISOString(),
  };
}
