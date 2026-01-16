import { createNewUser } from './auth-user-sync/helpers/createNewUser';
import { updateExistingUser } from './auth-user-sync/helpers/updateExistingUser';
import { logger } from './logger';
import { supabaseAdmin } from './supabase';

/**
 * Sync user from Auth0 to database on first login
 * Auth0 best practice: Create user record immediately on authentication
 *
 * @param email - User email from Auth0
 * @param emailVerified - Email verification status from Auth0
 * @param name - User full name from Auth0 (optional)
 * @returns Promise<void>
 */
export async function syncUserFromAuth0(
  email: string,
  emailVerified: boolean = false,
  name?: string | null,
): Promise<void> {
  if (!supabaseAdmin || !email) {
    return;
  }

  try {
    // Check if user already exists
    const { data: existingUser, error: existingUserError } = await supabaseAdmin
      .from('users')
      .select('id, email, email_verified, last_login')
      .eq('email', email)
      .maybeSingle();

    if (existingUserError) {
      logger.warn('[Auth0 Sync] Error checking existing user:', {
        error: existingUserError.message,
        code: existingUserError.code,
        context: { email, operation: 'checkExistingUser' },
      });
    }

    if (existingUser) {
      await updateExistingUser(email, emailVerified, existingUser.email_verified, name);
      return;
    }

    await createNewUser(email, emailVerified, name);
  } catch (error) {
    // Log error but don't throw - authentication should still succeed
    logger.error('[Auth0 Sync] Error syncing user:', {
      error: error instanceof Error ? error.message : String(error),
      email,
    });
  }
}

/**
 * Detect and store user country for data transfer restrictions
 * Should be called when request headers are available (e.g., in middleware or API routes)
 *
 * @param {string} email - User email
 * @param {Headers} headers - Request headers
 * @returns {Promise<void>}
 */
export async function detectAndStoreUserCountry(email: string, headers: Headers): Promise<void> {
  try {
    const { detectCountryFromHeaders, storeUserCountry } =
      await import('./data-transfer/country-detection');
    const countryCode = detectCountryFromHeaders(headers);
    if (countryCode) {
      await storeUserCountry(email, countryCode);
    }
  } catch (error) {
    // Don't fail if country detection fails
    logger.warn('[Auth User Sync] Failed to detect/store country:', {
      error: error instanceof Error ? error.message : String(error),
      email,
    });
  }
}
