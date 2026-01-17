/**
 * Backup decryption operations.
 */

import type { BackupData } from '../types';
import {
    AUTH_TAG_LENGTH,
    BACKUP_HEADER,
    BACKUP_VERSION,
    ENCRYPTION_MODE_PREPFLOW_ONLY,
    ENCRYPTION_MODE_USER_PASSWORD,
    IV_LENGTH,
} from './constants';
import {
    deriveKeyFromPassword,
    deriveKeyFromServerKey,
    getPrepFlowEncryptionKey,
} from './key-management';

/**
 * Decrypt backup file.
 *
 * @param {Uint8Array} encryptedFile - Encrypted backup file data
 * @param {string} passwordOrKey - Password (for user-password mode) or server key (for prepflow-only mode)
 * @returns {Promise<BackupData>} Decrypted backup data
 */
export async function decryptBackup(
  encryptedFile: Uint8Array,
  passwordOrKey: string,
): Promise<BackupData> {
  let offset = 0;

  // Read header
  const headerLength = BACKUP_HEADER.length;
  const header = new TextDecoder().decode(encryptedFile.slice(offset, offset + headerLength));
  offset += headerLength;

  if (header !== BACKUP_HEADER) {
    throw new Error('Invalid backup file format: incorrect header');
  }

  // Read version
  const version = encryptedFile[offset];
  offset += 1;

  if (version !== BACKUP_VERSION) {
    throw new Error(`Unsupported backup version: ${version}`);
  }

  // Read encryption mode
  const encryptionMode = encryptedFile[offset];
  offset += 1;

  if (
    encryptionMode !== ENCRYPTION_MODE_USER_PASSWORD &&
    encryptionMode !== ENCRYPTION_MODE_PREPFLOW_ONLY
  ) {
    throw new Error(`Invalid encryption mode: ${encryptionMode}`);
  }

  // Read salt length and salt
  const saltLength = encryptedFile[offset];
  offset += 1;
  const salt = encryptedFile.slice(offset, offset + saltLength);
  offset += saltLength;

  // Read IV
  const iv = encryptedFile.slice(offset, offset + IV_LENGTH);
  offset += IV_LENGTH;

  // Read metadata size
  const metadataSize = new DataView(encryptedFile.buffer, offset, 4).getUint32(0, false); // Big-endian
  offset += 4;

  // Read encrypted metadata
  const metadataCiphertext = encryptedFile.slice(offset, offset + metadataSize);
  offset += metadataSize;

  // Read metadata auth tag
  const metadataAuthTag = encryptedFile.slice(offset, offset + AUTH_TAG_LENGTH);
  offset += AUTH_TAG_LENGTH;

  // Read encrypted data
  const dataCiphertext = encryptedFile.slice(offset, -AUTH_TAG_LENGTH);

  // Read auth tag
  const authTag = encryptedFile.slice(-AUTH_TAG_LENGTH);

  // Derive decryption key using salt from file
  let decryptionKey: CryptoKey;

  if (encryptionMode === ENCRYPTION_MODE_USER_PASSWORD) {
    decryptionKey = await deriveKeyFromPassword(passwordOrKey, salt);
  } else {
    // PrepFlow-only mode - passwordOrKey should be the server key
    // If not provided, get from environment
    const serverKey = passwordOrKey || (await getPrepFlowEncryptionKey());
    decryptionKey = await deriveKeyFromServerKey(serverKey, salt);
  }

  // Decrypt metadata
  const metadataArray = new Uint8Array([...metadataCiphertext, ...metadataAuthTag]);
  let decryptedMetadata: Record<string, unknown>;

  try {
    const decryptedMetadataBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      decryptionKey,
      metadataArray,
    );

    const metadataJson = new TextDecoder().decode(decryptedMetadataBuffer);
    decryptedMetadata = JSON.parse(metadataJson);
  } catch (error) {
    throw new Error('Failed to decrypt backup metadata. Invalid password or key.');
  }

  // Now decrypt actual data
  const dataArray = new Uint8Array([...dataCiphertext, ...authTag]);
  let decryptedDataBuffer: ArrayBuffer;

  try {
    decryptedDataBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      decryptionKey,
      dataArray,
    );
  } catch (error) {
    throw new Error('Failed to decrypt backup data. Invalid password or key.');
  }

  // Parse decrypted JSON
  const decryptedJson = new TextDecoder().decode(decryptedDataBuffer);
  const backupData: BackupData = JSON.parse(decryptedJson);

  return backupData;
}
