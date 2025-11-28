/**
 * Backup encryption system - supports user password-protected and PrepFlow-only encryption.
 * Re-exports all functions from the refactored modules.
 */

export { decryptBackup, encryptBackup, getPrepFlowServerKey } from './encryption/index';
