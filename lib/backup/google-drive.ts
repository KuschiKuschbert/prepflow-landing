/**
 * Google Drive integration for backup storage.
 */

import { google, type Auth } from 'googleapis';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { encryptToken, decryptToken } from './token-encryption';
import type { EncryptedBackup, BackupFile } from './types';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/backup/google-callback`;

/**
 * Get OAuth2 client for Google Drive.
 *
 * @returns {auth.OAuth2Client} OAuth2 client
 */
function getOAuth2Client(): Auth.OAuth2Client {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth2 credentials not configured');
  }

  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
}

/**
 * Get encrypted refresh token from database.
 *
 * @param {string} userId - User ID (email)
 * @returns {Promise<string | null>} Encrypted refresh token or null
 */
async function getEncryptedRefreshToken(userId: string): Promise<string | null> {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from('user_google_tokens')
    .select('encrypted_refresh_token')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  try {
    // Decrypt the token
    const decryptedToken = await decryptToken(data.encrypted_refresh_token);
    return decryptedToken;
  } catch (error: any) {
    logger.error(`[Google Drive] Failed to decrypt token for user ${userId}:`, error);
    // If decryption fails, token is invalid - return null to trigger re-auth
    return null;
  }
}

/**
 * Store encrypted refresh token in database.
 *
 * @param {string} userId - User ID (email)
 * @param {string} refreshToken - Refresh token to encrypt and store
 */
async function storeEncryptedRefreshToken(userId: string, refreshToken: string): Promise<void> {
  const supabase = createSupabaseAdmin();

  // Encrypt the token before storing
  const encryptedToken = await encryptToken(refreshToken);

  const { error } = await supabase.from('user_google_tokens').upsert(
    {
      user_id: userId,
      encrypted_refresh_token: encryptedToken,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id',
    },
  );

  if (error) {
    throw new Error(`Failed to store refresh token: ${error.message}`);
  }
}

/**
 * Authenticate Google Drive for a user.
 *
 * @param {string} userId - User ID (email)
 * @returns {Promise<auth.OAuth2Client>} Authenticated OAuth2 client
 */
export async function authenticateGoogleDrive(userId: string): Promise<Auth.OAuth2Client> {
  const oauth2Client = getOAuth2Client();

  // Try to get stored refresh token
  const encryptedRefreshToken = await getEncryptedRefreshToken(userId);

  if (encryptedRefreshToken) {
    // Set credentials with refresh token
    oauth2Client.setCredentials({
      refresh_token: encryptedRefreshToken, // Should be decrypted
    });

    // Try to refresh access token
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      return oauth2Client;
    } catch (error) {
      logger.warn(
        `[Google Drive] Failed to refresh token for user ${userId}, re-authentication required`,
      );
      throw new Error('Google Drive authentication expired. Please reconnect.');
    }
  }

  throw new Error('Google Drive not connected. Please connect your Google account first.');
}

/**
 * Generate a secure state token for OAuth flow.
 * Includes user ID and a timestamp for validation.
 *
 * @param {string} userId - User ID (email)
 * @returns {string} Base64 encoded state token
 */
function generateSecureState(userId: string): string {
  const stateData = {
    userId,
    timestamp: Date.now(),
    nonce: crypto.getRandomValues(new Uint8Array(16)).toString(),
  };
  return Buffer.from(JSON.stringify(stateData)).toString('base64');
}

/**
 * Verify and extract user ID from secure state token.
 *
 * @param {string} stateToken - State token from OAuth callback
 * @param {number} maxAgeMs - Maximum age of state token in milliseconds (default: 10 minutes)
 * @returns {string} User ID if valid
 * @throws {Error} If state is invalid or expired
 */
function verifySecureState(stateToken: string, maxAgeMs: number = 10 * 60 * 1000): string {
  try {
    const stateData = JSON.parse(Buffer.from(stateToken, 'base64').toString());
    const age = Date.now() - stateData.timestamp;

    if (age > maxAgeMs) {
      throw new Error('OAuth state token expired');
    }

    if (!stateData.userId) {
      throw new Error('Invalid OAuth state token: missing userId');
    }

    return stateData.userId;
  } catch (error: any) {
    logger.error('[Google Drive] Failed to verify state token:', error);
    throw new Error('Invalid OAuth state token');
  }
}

/**
 * Get Google Drive authorization URL for OAuth flow.
 *
 * @param {string} userId - User ID (email)
 * @returns {string} Authorization URL
 */
export function getGoogleDriveAuthUrl(userId: string): string {
  const oauth2Client = getOAuth2Client();

  const scopes = ['https://www.googleapis.com/auth/drive.file']; // Limited scope for file access only

  // Generate secure state token with user ID
  const stateToken = generateSecureState(userId);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent', // Force consent to get refresh token
    state: stateToken, // Secure state token with user ID
  });

  return authUrl;
}

/**
 * Handle OAuth callback and store refresh token.
 *
 * @param {string} code - Authorization code from OAuth callback
 * @param {string} stateToken - Secure state token from OAuth callback
 * @param {string} expectedUserId - Expected user ID from authenticated session (for verification)
 * @returns {Promise<void>}
 */
export async function handleGoogleDriveCallback(
  code: string,
  stateToken: string,
  expectedUserId: string,
): Promise<void> {
  // Verify state token and extract user ID
  const userIdFromState = verifySecureState(stateToken);

  // Security check: Ensure state token matches authenticated user
  if (userIdFromState !== expectedUserId) {
    logger.error(
      `[Google Drive] State token mismatch: expected ${expectedUserId}, got ${userIdFromState}`,
    );
    throw new Error('OAuth state verification failed. User ID mismatch.');
  }

  const oauth2Client = getOAuth2Client();

  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.refresh_token) {
    throw new Error('No refresh token received from Google');
  }

  // Store refresh token (encrypted) for the verified user
  await storeEncryptedRefreshToken(expectedUserId, tokens.refresh_token);

  logger.info(`[Google Drive] Successfully connected for user ${expectedUserId}`);
}

/**
 * Ensure user-specific folder exists in Google Drive.
 * Creates "PrepFlow Backups/{userId}" folder structure.
 *
 * @param {auth.OAuth2Client} client - Authenticated OAuth2 client
 * @param {string} userId - User ID (email)
 * @returns {Promise<string>} Folder ID
 */
async function ensureUserBackupFolder(client: Auth.OAuth2Client, userId: string): Promise<string> {
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
  } catch (error: any) {
    logger.error('[Google Drive] Failed to create/find parent folder:', error);
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
  } catch (error: any) {
    logger.warn(`[Google Drive] Failed to find user folder for ${userId}:`, error);
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

/**
 * Disconnect Google Drive for a user.
 *
 * @param {string} userId - User ID (email)
 */
export async function disconnectGoogleDrive(userId: string): Promise<void> {
  const supabase = createSupabaseAdmin();

  const { error } = await supabase.from('user_google_tokens').delete().eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to disconnect Google Drive: ${error.message}`);
  }

  logger.info(`[Google Drive] Disconnected for user ${userId}`);
}
