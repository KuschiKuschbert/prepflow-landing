/**
 * Key management for backup encryption.
 */

import { PBKDF2_ITERATIONS } from './constants';

/**
 * Get PrepFlow encryption key from environment variable.
 *
 * @returns {Promise<string>} Encryption key (32-byte hex string)
 * @throws {Error} If key is not configured
 */
export async function getPrepFlowEncryptionKey(): Promise<string> {
  const key = process.env.PREPFLOW_BACKUP_ENCRYPTION_KEY;

  if (!key) {
    throw new Error('PREPFLOW_BACKUP_ENCRYPTION_KEY environment variable is not set');
  }

  // Validate key length (should be 64 hex characters = 32 bytes)
  if (key.length !== 64) {
    throw new Error('PREPFLOW_BACKUP_ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
  }

  return key;
}

/**
 * Derive encryption key from password using PBKDF2.
 *
 * @param {string} password - User password
 * @param {Uint8Array} salt - Salt for key derivation
 * @returns {Promise<CryptoKey>} Derived encryption key
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, [
    'deriveBits',
    'deriveKey',
  ]);

  // Derive key using PBKDF2
  // Create a new Uint8Array to ensure proper ArrayBuffer
  const saltArray = new Uint8Array(salt);
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltArray,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );

  return key;
}

/**
 * Derive encryption key from PrepFlow server key.
 *
 * @param {string} serverKey - Server-side encryption key (hex string)
 * @param {Uint8Array} salt - Salt for key derivation
 * @returns {Promise<CryptoKey>} Derived encryption key
 */
export async function deriveKeyFromServerKey(
  serverKey: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  // Convert hex string to bytes
  const hexBytes = serverKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16));
  const keyBytes = new Uint8Array(hexBytes.length);
  for (let i = 0; i < hexBytes.length; i++) {
    keyBytes[i] = hexBytes[i];
  }

  // Import key material
  const keyMaterial = await crypto.subtle.importKey('raw', keyBytes.buffer, 'PBKDF2', false, [
    'deriveBits',
    'deriveKey',
  ]);

  // Derive key using PBKDF2 (fewer iterations for server key since it's already secure)
  // Create a new Uint8Array to ensure proper ArrayBuffer
  const saltArray = new Uint8Array(salt);
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltArray,
      iterations: 10000, // Fewer iterations for server key
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );

  return key;
}
