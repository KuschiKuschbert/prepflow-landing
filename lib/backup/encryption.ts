/**
 * Backup encryption system - supports user password-protected and PrepFlow-only encryption.
 */

import { logger } from '@/lib/logger';
import type { BackupData, EncryptedBackup, EncryptionOptions } from './types';

const BACKUP_HEADER = 'PREPFLOW_BACKUP';
const BACKUP_VERSION = 1;
const ENCRYPTION_MODE_USER_PASSWORD = 0x01;
const ENCRYPTION_MODE_PREPFLOW_ONLY = 0x02;
const PBKDF2_ITERATIONS = 100000;
const IV_LENGTH = 12; // GCM recommended IV length
const AUTH_TAG_LENGTH = 16; // GCM auth tag length

/**
 * Get PrepFlow encryption key from environment variable.
 *
 * @returns {Promise<string>} Encryption key (32-byte hex string)
 * @throws {Error} If key is not configured
 */
async function getPrepFlowEncryptionKey(): Promise<string> {
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
async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
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
async function deriveKeyFromServerKey(serverKey: string, salt: Uint8Array): Promise<CryptoKey> {
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
    encryptionMode = ENCRYPTION_MODE_USER_PASSWORD;
  } else {
    // PrepFlow-only mode
    const serverKey = await getPrepFlowEncryptionKey();
    encryptionKey = await deriveKeyFromServerKey(serverKey, salt);
    encryptionMode = ENCRYPTION_MODE_PREPFLOW_ONLY;
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
      iv,
    },
    encryptionKey,
    metadataBuffer,
  );

  const encryptedMetadataArray = new Uint8Array(encryptedMetadata);
  const metadataAuthTag = encryptedMetadataArray.slice(-AUTH_TAG_LENGTH);
  const metadataCiphertext = encryptedMetadataArray.slice(0, -AUTH_TAG_LENGTH);

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
    encryptionMode: options.mode,
    createdAt: new Date().toISOString(),
  };
}

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
  let decryptedMetadata: any;

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

/**
 * Get PrepFlow encryption key (for server-side operations).
 * Exported for use in restore operations.
 *
 * @returns {Promise<string>} Server-side encryption key
 */
export async function getPrepFlowServerKey(): Promise<string> {
  return getPrepFlowEncryptionKey();
}
