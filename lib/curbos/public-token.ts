import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

/**
 * Generate a secure public token for CurbOS display
 */
export function generatePublicToken(): string {
  return crypto.randomBytes(32).toString('hex'); // 64-character hex string
}

/**
 * Get or create public token for a user
 */
export async function getOrCreatePublicToken(userEmail: string): Promise<string | null> {
  if (!supabaseAdmin) {
    logger.error('[CurbOS Public Token] Supabase admin client not available on server');
    return null;
  }

  try {
    logger.dev('[CurbOS Public Token] Checking for existing token for:', { userEmail });
    // Check if token exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('curbos_public_tokens')
      .select('public_token')
      .eq('user_email', userEmail)
      .eq('is_active', true)
      .maybeSingle();

    if (fetchError) {
      logger.error('[CurbOS Public Token] Error fetching existing token:', {
        error: fetchError.message,
        code: fetchError.code,
        userEmail
      });
      return null;
    }

    if (existing?.public_token) {
      logger.dev('[CurbOS Public Token] Found existing token:', { userEmail });
      return existing.public_token;
    }

    // Create new token
    logger.dev('[CurbOS Public Token] creating new token for:', { userEmail });
    const newToken = generatePublicToken();
    const { error: insertError } = await supabaseAdmin.from('curbos_public_tokens').insert({
      user_email: userEmail,
      public_token: newToken,
      created_by_user_email: userEmail,
    });

    if (insertError) {
      logger.error('[CurbOS Public Token] Error inserting new token:', {
        error: insertError.message,
        code: insertError.code,
        userEmail
      });
      return null;
    }

    logger.dev('[CurbOS Public Token] Successfully created token for:', { userEmail });
    return newToken;
  } catch (error) {
    logger.error('[CurbOS Public Token] Unexpected error in getOrCreatePublicToken:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return null;
  }
}

/**
 * Regenerate public token for a user
 */
export async function regeneratePublicToken(userEmail: string): Promise<string | null> {
  if (!supabaseAdmin) {
    return null;
  }

  try {
    const newToken = generatePublicToken();
    const { error } = await supabaseAdmin.from('curbos_public_tokens').upsert(
      {
        user_email: userEmail,
        public_token: newToken,
        last_regenerated_at: new Date().toISOString(),
        is_active: true,
      },
      {
        onConflict: 'user_email',
      },
    );

    if (error) {
      logger.error('[CurbOS Public Token] Error regenerating token:', error);
      return null;
    }

    return newToken;
  } catch (error) {
    logger.error('[CurbOS Public Token] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return null;
  }
}

/**
 * Validate public token and get associated user email
 */
export async function validatePublicToken(token: string): Promise<string | null> {
  if (!supabaseAdmin) {
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('curbos_public_tokens')
      .select('user_email')
      .eq('public_token', token)
      .eq('is_active', true)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      logger.warn('[CurbOS Public Token] Error validating token:', {
        error: error.message,
        tokenPrefix: token.substring(0, 8), // Log only first 8 chars for security
      });
      return null;
    }

    if (!data) {
      return null;
    }

    return data.user_email;
  } catch (error) {
    logger.error('[CurbOS Public Token] Error validating token:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
