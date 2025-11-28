/**
 * Backup encryption system - supports user password-protected and PrepFlow-only encryption.
 * Main orchestrator file that exports all public functions.
 */

import { decryptBackup } from './decrypt';
import { encryptBackup } from './encrypt';
import { getPrepFlowEncryptionKey } from './key-management';

// Re-export all public functions
export { encryptBackup, decryptBackup };

/**
 * Get PrepFlow encryption key (for server-side operations).
 * Exported for use in restore operations.
 *
 * @returns {Promise<string>} Server-side encryption key
 */
export async function getPrepFlowServerKey(): Promise<string> {
  return getPrepFlowEncryptionKey();
}
