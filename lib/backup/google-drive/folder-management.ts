/**
 * Google Drive folder management for backups.
 */

import { logger } from '@/lib/logger';
import { google, type Auth } from 'googleapis';

/**
 * Ensure user-specific folder exists in Google Drive.
 * Creates "PrepFlow Backups/{userId}" folder structure.
 *
 * @param {auth.OAuth2Client} client - Authenticated OAuth2 client
 * @param {string} userId - User ID (email)
 * @returns {Promise<string>} Folder ID
 */
export async function ensureUserBackupFolder(
  client: Auth.OAuth2Client,
  userId: string,
): Promise<string> {
  const drive = google.drive({ version: 'v3', auth: client });

  // First, ensure "PrepFlow Backups" parent folder exists
  let parentFolderId: string | null = null;

  try {
    const parentSearch = await drive.files.list({
      q: "name='PrepFlow Backups' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (parentSearch.data.files && parentSearch.data.files.length > 0) {
      parentFolderId = parentSearch.data.files[0].id || null;
    } else {
      // Create parent folder
      const parentCreate = await drive.files.create({
        requestBody: {
          name: 'PrepFlow Backups',
          mimeType: 'application/vnd.google-apps.folder',
        },
        fields: 'id',
      });
      parentFolderId = parentCreate.data.id || null;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[Google Drive] Failed to create/find parent folder:', { error: errorMessage });
    throw new Error('Failed to create backup folder structure');
  }

  if (!parentFolderId) {
    throw new Error('Failed to get parent folder ID');
  }

  // Sanitize userId for folder name (remove special characters)
  const sanitizedUserId = userId.replace(/[^a-zA-Z0-9@._-]/g, '_');
  const userFolderName = `User: ${sanitizedUserId}`;

  // Check if user folder exists
  const userFolderQuery = `name='${userFolderName}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`;
  const userFolderSearch = await drive.files.list({
    q: userFolderQuery,
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  if (userFolderSearch.data.files && userFolderSearch.data.files.length > 0) {
    return userFolderSearch.data.files[0].id!;
  }

  // Create user-specific folder
  const userFolderCreate = await drive.files.create({
    requestBody: {
      name: userFolderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    },
    fields: 'id',
  });

  const userFolderId = userFolderCreate.data.id;
  if (!userFolderId) {
    throw new Error('Failed to create user backup folder');
  }

  logger.info(`[Google Drive] Created user folder for ${userId}: ${userFolderId}`);
  return userFolderId;
}
