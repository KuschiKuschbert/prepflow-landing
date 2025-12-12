import { supabaseAdmin } from './supabase';
import { logger } from './logger';

/**
 * Sync user from Auth0 to database on first login
 * Auth0 best practice: Create user record immediately on authentication
 *
 * @param email - User email from Auth0
 * @param emailVerified - Email verification status from Auth0
 * @returns Promise<void>
 */
export async function syncUserFromAuth0(
  email: string,
  emailVerified: boolean = false,
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
      // Update last_login timestamp (Auth0 best practice: track login activity)
      await supabaseAdmin
        .from('users')
        .update({
          last_login: new Date().toISOString(),
          email_verified: emailVerified || existingUser.email_verified, // Don't downgrade verification
          updated_at: new Date().toISOString(),
        })
        .eq('email', email);

      logger.dev('[Auth0 Sync] Updated user last_login:', { email });
      return;
    }

    // Create new user record (Auth0 best practice: create on first login)
    const { error: createError } = await supabaseAdmin.from('users').insert({
      email,
      email_verified: emailVerified,
      subscription_tier: 'starter', // Default tier
      subscription_status: 'trial', // Default status
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (createError) {
      // If user already exists (race condition), just update last_login
      if (createError.code === '23505') {
        // Unique constraint violation - user was created by another request
        await supabaseAdmin
          .from('users')
          .update({
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('email', email);
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




