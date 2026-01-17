/**
 * List backup files from Google Drive.
 */

import { logger } from '@/lib/logger';
import { google, type Auth } from 'googleapis';
import type { BackupFile } from '../types';

/**
 * List backup files from Google Drive for a specific user.
 *
 * @param {auth.OAuth2Client} client - Authenticated OAuth2 client
 * @param {string} userId - User ID (email)
 * @returns {Promise<BackupFile[]>} Array of backup files
 */
export async function listBackupsFromDrive(
  client: Auth.OAuth2Client,
  userId: string,
): Promise<BackupFile[]> {
  const drive = google.drive({ version: 'v3', auth: client });

  // Get user-specific folder ID
  let userFolderId: string | null = null;
  try {
    // Find parent folder
    const parentSearch = await drive.files.list({
      q: "name='PrepFlow Backups' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: 'files(id)',
      spaces: 'drive',
    });

    if (parentSearch.data.files && parentSearch.data.files.length > 0) {
      const parentFolderId = parentSearch.data.files[0].id!;
      const sanitizedUserId = userId.replace(/[^a-zA-Z0-9@._-]/g, '_');
      const userFolderName = `User: ${sanitizedUserId}`;

      // Find user folder
      const userFolderSearch = await drive.files.list({
        q: `name='${userFolderName}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`,
        fields: 'files(id)',
        spaces: 'drive',
      });

      if (userFolderSearch.data.files && userFolderSearch.data.files.length > 0) {
        userFolderId = userFolderSearch.data.files[0].id!;
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.warn(`[Google Drive] Failed to find user folder for ${userId}:`, {
      error: errorMessage,
    });
    // Continue with root search as fallback
  }

  // Search for backup files in user's folder (or root if folder not found)
  const folderQuery = userFolderId
    ? `'${userFolderId}' in parents`
    : "name contains 'prepflow-backup'";
  const response = await drive.files.list({
    q: `${folderQuery} and trashed = false`,
    fields: 'files(id, name, size, createdTime, modifiedTime)',
    orderBy: 'createdTime desc',
  });

  if (!response.data.files) {
    return [];
  }

  const backupFiles: BackupFile[] = (response.data.files || []).map(file => {
    const filename = file.name || '';
    const format = filename.endsWith('.pfbk')
      ? 'encrypted'
      : filename.endsWith('.sql')
        ? 'sql'
        : 'json';
    const encryptionMode = filename.endsWith('.pfbk') ? 'prepflow-only' : undefined; // Default assumption

    return {
      id: file.id || '',
      filename: filename,
      size: parseInt(file.size || '0', 10),
      createdAt: file.createdTime || new Date().toISOString(),
      format: format as 'json' | 'sql' | 'encrypted',
      encryptionMode: encryptionMode as 'user-password' | 'prepflow-only' | undefined,
      googleDriveFileId: file.id || undefined,
    };
  });

  return backupFiles;
}
