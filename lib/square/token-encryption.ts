/**
 * Token encryption utilities for Square access tokens.
 * Uses AES-256-GCM encryption with a server-side key.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Environment Variables, Security Best Practices sections) for
 * comprehensive token encryption setup and security guidelines.
 */

import { logger } from '@/lib/logger';

const ENCRYPTION_KEY_ENV = 'SQUARE_TOKEN_ENCRYPTION_KEY';
const IV_LENGTH = 12; // GCM recommended IV length

/**
 * Get encryption key from environment variable.
 *
 * @returns {Promise<CryptoKey>} Encryption key
 * @throws {Error} If key is not configured
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyHex = process.env[ENCRYPTION_KEY_ENV];

  if (!keyHex) {
    throw new Error(`${ENCRYPTION_KEY_ENV} environment variable is not set`);
  }

  // Validate key length (should be 64 hex characters = 32 bytes)
  if (keyHex.length !== 64) {
    throw new Error(`${ENCRYPTION_KEY_ENV} must be 64 hex characters (32 bytes)`);
  }

  // Convert hex string to bytes
  const keyBytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    keyBytes[i] = parseInt(keyHex.substr(i * 2, 2), 16);
  }

  return crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ]);
}

/**
 * Encrypts a Square access token for storage.
 *
 * @param {string} token - Access token to encrypt
 * @returns {Promise<string>} Encrypted token (base64 encoded)
 */
export async function encryptSquareToken(token: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encoder = new TextEncoder();
    const data = encoder.encode(token);

    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
    const encryptedArray = new Uint8Array(encrypted);

    // Combine IV + encrypted data + auth tag
    const combined = new Uint8Array(IV_LENGTH + encryptedArray.length);
    combined.set(iv, 0);
    combined.set(encryptedArray, IV_LENGTH);

    // Convert to base64 for storage
    return Buffer.from(combined).toString('base64');
  } catch (error: any) {
    logger.error('[Square Token Encryption] Failed to encrypt token:', error);
    throw new Error('Failed to encrypt Square access token');
  }
}

/**
 * Decrypts a Square access token from storage.
 *
 * @param {string} encryptedToken - Encrypted token (base64 encoded)
 * @returns {Promise<string>} Decrypted access token
 */
export async function decryptSquareToken(encryptedToken: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const combined = Buffer.from(encryptedToken, 'base64');
    const iv = combined.slice(0, IV_LENGTH);
    const encryptedData = combined.slice(IV_LENGTH);

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData);
    const decoder = new TextDecoder();

    return decoder.decode(decrypted);
  } catch (error: any) {
    logger.error('[Square Token Decryption] Failed to decrypt token:', error);
    throw new Error(
      'Failed to decrypt Square access token. Token may be corrupted or encryption key may have changed.',
    );
  }
}
