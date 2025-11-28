/**
 * Data encryption logic.
 */

import type { BackupData } from '../../types';
import { AUTH_TAG_LENGTH, IV_LENGTH } from '../constants';
import {
  deriveKeyFromPassword,
  deriveKeyFromServerKey,
  getPrepFlowEncryptionKey,
} from '../key-management';
import type { EncryptionOptions } from '../../types';

interface EncryptDataResult {
  ciphertext: Uint8Array;
  authTag: Uint8Array;
  iv: Uint8Array;
  salt: Uint8Array;
  encryptionKey: CryptoKey;
  encryptionMode: number;
}

/**
 * Encrypt backup data and derive encryption key.
 */
export async function encryptBackupData(
  data: BackupData,
  options: EncryptionOptions,
): Promise<EncryptDataResult> {
  // Validate options
  if (options.mode === 'user-password' && !options.password) {
    throw new Error('Password is required for user-password encryption mode');
  }

  // Convert backup data to JSON string
  const jsonData = JSON.stringify(data);
  const dataBuffer = new TextEncoder().encode(jsonData);

  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  // Generate salt for key derivation
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Derive encryption key based on mode
  let encryptionKey: CryptoKey;
  let encryptionMode: number;

  if (options.mode === 'user-password') {
    encryptionKey = await deriveKeyFromPassword(options.password!, salt);
    encryptionMode = 0x01; // ENCRYPTION_MODE_USER_PASSWORD
  } else {
    // PrepFlow-only mode
    const serverKey = await getPrepFlowEncryptionKey();
    encryptionKey = await deriveKeyFromServerKey(serverKey, salt);
    encryptionMode = 0x02; // ENCRYPTION_MODE_PREPFLOW_ONLY
  }

  // Encrypt data
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    encryptionKey,
    dataBuffer,
  );

  const encryptedArray = new Uint8Array(encryptedData);

  // Extract auth tag (last 16 bytes)
  const authTag = encryptedArray.slice(-AUTH_TAG_LENGTH);
  const ciphertext = encryptedArray.slice(0, -AUTH_TAG_LENGTH);

  return {
    ciphertext,
    authTag,
    iv,
    salt,
    encryptionKey,
    encryptionMode,
  };
}
