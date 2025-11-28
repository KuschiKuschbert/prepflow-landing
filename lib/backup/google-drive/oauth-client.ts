/**
 * OAuth2 client creation for Google Drive.
 */

import { google, type Auth } from 'googleapis';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/backup/google-callback`;

/**
 * Get OAuth2 client for Google Drive.
 *
 * @returns {auth.OAuth2Client} OAuth2 client
 */
export function getOAuth2Client(): Auth.OAuth2Client {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth2 credentials not configured');
  }

  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
}
