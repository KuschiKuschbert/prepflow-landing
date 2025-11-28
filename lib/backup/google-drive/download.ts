/**
 * Download backup files from Google Drive.
 */

import { google, type Auth } from 'googleapis';

/**
 * Download backup file from Google Drive.
 *
 * @param {auth.OAuth2Client} client - Authenticated OAuth2 client
 * @param {string} fileId - Google Drive file ID
 * @returns {Promise<Uint8Array>} Backup file data
 */
export async function downloadBackupFromDrive(
  client: Auth.OAuth2Client,
  fileId: string,
): Promise<Uint8Array> {
  const drive = google.drive({ version: 'v3', auth: client });

  const response = await drive.files.get(
    {
      fileId,
      alt: 'media',
    },
    {
      responseType: 'arraybuffer',
    },
  );

  if (!response.data) {
    throw new Error('Failed to download backup from Google Drive: No data returned');
  }

  return new Uint8Array(response.data as ArrayBuffer);
}
