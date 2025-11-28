/**
 * Metadata encryption logic.
 */

import type { BackupData } from '../../types';
import { AUTH_TAG_LENGTH, BACKUP_VERSION } from '../constants';

interface EncryptMetadataResult {
  metadataCiphertext: Uint8Array;
  metadataAuthTag: Uint8Array;
}

/**
 * Create and encrypt metadata.
 */
export async function encryptMetadata(
  data: BackupData,
  encryptionKey: CryptoKey,
  iv: Uint8Array,
  encryptionMode: number,
  salt: Uint8Array,
): Promise<EncryptMetadataResult> {
  // Create metadata
  const metadata = {
    version: BACKUP_VERSION,
    encryptionMode,
    salt: Array.from(salt),
    timestamp: data.timestamp,
    userId: data.userId,
    tableCount: Object.keys(data.tables).length,
    recordCounts: data.metadata.recordCounts,
  };

  const metadataJson = JSON.stringify(metadata);
  const metadataBuffer = new TextEncoder().encode(metadataJson);

  // Encrypt metadata with same key
  const encryptedMetadata = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    encryptionKey,
    metadataBuffer,
  );

  const encryptedMetadataArray = new Uint8Array(encryptedMetadata);
  const metadataAuthTag = encryptedMetadataArray.slice(-AUTH_TAG_LENGTH);
  const metadataCiphertext = encryptedMetadataArray.slice(0, -AUTH_TAG_LENGTH);

  return {
    metadataCiphertext,
    metadataAuthTag,
  };
}
