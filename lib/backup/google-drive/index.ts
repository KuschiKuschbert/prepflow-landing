/**
 * Google Drive integration for backup storage.
 * Main orchestrator file that exports all public functions.
 */

import { authenticateGoogleDrive } from './authentication';
import { disconnectGoogleDrive as disconnectGoogleDriveImpl } from './disconnect';
import { downloadBackupFromDrive } from './download';
import { listBackupsFromDrive } from './list';
import { getGoogleDriveAuthUrl, handleGoogleDriveCallback } from './oauth-flow';
import { uploadBackupToDrive } from './upload';

// Re-export all public functions
export { authenticateGoogleDrive, getGoogleDriveAuthUrl, handleGoogleDriveCallback };
export { uploadBackupToDrive, listBackupsFromDrive, downloadBackupFromDrive };

/**
 * Disconnect Google Drive for a user.
 *
 * @param {string} userId - User ID (email)
 */
export async function disconnectGoogleDrive(userId: string): Promise<void> {
  return disconnectGoogleDriveImpl(userId);
}
