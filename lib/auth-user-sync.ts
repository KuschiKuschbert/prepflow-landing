import { logger } from './logger';
import { supabaseAdmin } from './supabase';

/**
 * Split full name into first_name and last_name
 *
 * @param fullName - Full name string from Auth0
 * @returns Object with first_name and last_name
 */
function splitName(fullName: string | null | undefined): {
  first_name: string | null;
  last_name: string | null;
} {
  if (!fullName) return { first_name: null, last_name: null };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0], last_name: null };
  return { first_name: parts[0], last_name: parts.slice(1).join(' ') };
}

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
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, email, email_verified, last_login')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      // Check if we need to update name fields
      const { data: userWithName } = await supabaseAdmin
        .from('users')
        .select('first_name, last_name')
        .eq('email', email)
        .maybeSingle();

      const updateData: {
        last_login: string;
        updated_at: string;
        email_verified: boolean;
        first_name?: string | null;
        last_name?: string | null;
      } = {
        last_login: new Date().toISOString(),
        email_verified: emailVerified || existingUser.email_verified, // Don't downgrade verification
        updated_at: new Date().toISOString(),
      };

      // Update name if provided and user doesn't have one yet
      if (name && userWithName) {
        const { first_name, last_name } = splitName(name);
        if (!userWithName.first_name && first_name) {
          updateData.first_name = first_name;
        }
        if (!userWithName.last_name && last_name) {
          updateData.last_name = last_name;
        }
      }

      await supabaseAdmin.from('users').update(updateData).eq('email', email);
      logger.dev('[Auth0 Sync] Updated user:', {
        email,
        updatedName: !!(
          name &&
          userWithName &&
          (!userWithName.first_name || !userWithName.last_name)
        ),
      });
      return;
    }

    // Split name into first_name and last_name
    const { first_name, last_name } = splitName(name);

    // Create new user record (Auth0 best practice: create on first login)
    const { error: createError } = await supabaseAdmin.from('users').insert({
      email,
      email_verified: emailVerified,
      first_name,
      last_name,
      subscription_tier: 'starter', // Default tier
      subscription_status: 'trial', // Default status
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (createError) {
      // If user already exists (race condition), just update last_login and name if needed
      if (createError.code === '23505') {
        // Unique constraint violation - user was created by another request
        const updateData: {
          last_login: string;
          updated_at: string;
          first_name?: string | null;
          last_name?: string | null;
        } = {
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Try to update name if provided and user doesn't have one yet
        if (name) {
          const { first_name, last_name } = splitName(name);
          const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('first_name, last_name')
            .eq('email', email)
            .maybeSingle();

          if (existingUser) {
            if (!existingUser.first_name && first_name) {
              updateData.first_name = first_name;
            }
            if (!existingUser.last_name && last_name) {
              updateData.last_name = last_name;
            }
          }
        }

        await supabaseAdmin.from('users').update(updateData).eq('email', email);
        logger.dev('[Auth0 Sync] User already exists, updated last_login:', { email });
        return;
      }

      logger.error('[Auth0 Sync] Failed to create user:', {
        error: createError.message,
        email,
      });
      throw createError;
    }

    logger.dev('[Auth0 Sync] Created new user:', { email, emailVerified });
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
