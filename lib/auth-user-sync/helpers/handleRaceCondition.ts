import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { splitName } from './splitName';

/**
 * Handle race condition when user is created by another request
 */
export async function handleRaceCondition(email: string, name?: string | null): Promise<void> {
  const updateData: {
    last_login: string;
    updated_at: string;
    first_name?: string | null;
    last_name?: string | null;
  } = {
    last_login: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (name) {
    const { first_name, last_name } = splitName(name);
    const { data: existingUser, error: existingUserError } = await supabaseAdmin
      .from('users')
      .select('first_name, last_name')
      .eq('email', email)
      .maybeSingle();

    if (existingUserError) {
      logger.warn('[Auth0 Sync] Error fetching existing user for name update:', {
        error: existingUserError.message,
        code: (existingUserError as any).code,
        context: { email, operation: 'fetchExistingUserForNameUpdate' },
      });
    }

    if (existingUser) {
      if (!existingUser.first_name && first_name) {
        updateData.first_name = first_name;
      }
      if (!existingUser.last_name && last_name) {
        updateData.last_name = last_name;
      }
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update(updateData)
    .eq('email', email);
  if (updateError) {
    logger.error('[Auth0 Sync] Error updating user after race condition:', {
      error: updateError.message,
      code: (updateError as any).code,
      context: { email, operation: 'updateUserAfterRaceCondition' },
    });
  } else {
    logger.dev('[Auth0 Sync] User already exists, updated last_login:', { email });
  }
}
