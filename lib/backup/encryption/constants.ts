/**
 * Encryption constants for backup system.
 */

export const BACKUP_HEADER = 'PREPFLOW_BACKUP';
export const BACKUP_VERSION = 1;
export const ENCRYPTION_MODE_USER_PASSWORD = 0x01;
export const ENCRYPTION_MODE_PREPFLOW_ONLY = 0x02;
export const PBKDF2_ITERATIONS = 100000;
export const IV_LENGTH = 12; // GCM recommended IV length
export const AUTH_TAG_LENGTH = 16; // GCM auth tag length
