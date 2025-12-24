import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { splitName } from './splitName';
import { handleRaceCondition } from './handleRaceCondition';

/**
 * Create new user record
 */
export async function createNewUser(
  email: string,
  emailVerified: boolean,
  name?: string | null,
): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Auth0 Sync] Database connection not available');
    throw new Error('Database connection not available');
  }

  const { first_name, last_name } = splitName(name);
  const { error: createError } = await supabaseAdmin.from('users').insert({
    email,
    email_verified: emailVerified,
    first_name,
    last_name,
    subscription_tier: 'starter',
    subscription_status: 'trial',
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (createError) {
    if (createError.code === '23505') {
      await handleRaceCondition(email, name);
      return;
    }
    logger.error('[Auth0 Sync] Failed to create user:', {
      error: createError.message,
      email,
    });
    throw createError;
  }

  logger.dev('[Auth0 Sync] Created new user:', { email, emailVerified });
}
