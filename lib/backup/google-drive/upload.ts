/**
 * Upload backup files to Google Drive.
 */

import { google, type Auth } from 'googleapis';
import { logger } from '@/lib/logger';
import type { EncryptedBackup } from '../types';
import { ensureUserBackupFolder } from './folder-management';

/**
 * Upload backup file to Google Drive.
 *
 * @param {auth.OAuth2Client} client - Authenticated OAuth2 client
 * @param {EncryptedBackup} backup - Encrypted backup file
 * @param {string} userId - User ID (email)
 * @returns {Promise<string>} Google Drive file ID
 */
export async function uploadBackupToDrive(
  client: Auth.OAuth2Client,
  backup: EncryptedBackup,
  userId: string,
): Promise<string> {
  const drive = google.drive({ version: 'v3', auth: client });

  // Ensure user-specific folder exists
  const userFolderId = await ensureUserBackupFolder(client, userId);

  // Convert backup data to buffer
  const fileBuffer = Buffer.from(
    backup.data.buffer,
    backup.data.byteOffset,
    backup.data.byteLength,
  );

  // Upload file to user's folder
  const response = await drive.files.create({
    requestBody: {
      name: backup.filename,
      parents: [userFolderId], // Upload to user-specific folder
      description: `PrepFlow backup created on ${backup.createdAt} for user ${userId}`,
    },
    media: {
      mimeType: 'application/octet-stream',
      body: fileBuffer,
    },
    fields: 'id',
  });

  if (!response.data.id) {
    throw new Error('Failed to upload backup to Google Drive: No file ID returned');
  }

  logger.info(
    `[Google Drive] Uploaded backup ${backup.filename} to Drive for user ${userId}, file ID: ${response.data.id}`,
  );

  return response.data.id;
}
