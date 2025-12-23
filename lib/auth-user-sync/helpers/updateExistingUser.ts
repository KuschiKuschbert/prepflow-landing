import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { splitName } from './splitName';

/**
 * Update existing user with last_login and optional name fields
 */
export async function updateExistingUser(
  email: string,
  emailVerified: boolean,
  existingUserEmailVerified: boolean,
  name?: string | null,
): Promise<void> {
  const { data: userWithName, error: userWithNameError } = await supabaseAdmin
    .from('users')
    .select('first_name, last_name')
    .eq('email', email)
    .maybeSingle();

  if (userWithNameError) {
    logger.warn('[Auth0 Sync] Error fetching user name fields:', {
      error: userWithNameError.message,
      code: (userWithNameError as any).code,
      context: { email, operation: 'fetchUserNameFields' },
    });
  }

  const updateData: {
    last_login: string;
    updated_at: string;
    email_verified: boolean;
    first_name?: string | null;
    last_name?: string | null;
  } = {
    last_login: new Date().toISOString(),
    email_verified: emailVerified || existingUserEmailVerified,
    updated_at: new Date().toISOString(),
  };

  if (name && userWithName) {
    const { first_name, last_name } = splitName(name);
    if (!userWithName.first_name && first_name) {
      updateData.first_name = first_name;
    }
    if (!userWithName.last_name && last_name) {
      updateData.last_name = last_name;
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update(updateData)
    .eq('email', email);
  if (updateError) {
    logger.error('[Auth0 Sync] Error updating user:', {
      error: updateError.message,
      code: (updateError as any).code,
      context: { email, operation: 'updateUser' },
    });
  } else {
    logger.dev('[Auth0 Sync] Updated user:', {
      email,
      updatedName: !!(name && userWithName && (!userWithName.first_name || !userWithName.last_name)),
    });
  }
}
