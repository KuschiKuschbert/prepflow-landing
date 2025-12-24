import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Revoke user consent for restricted data transfer
 */
export async function revokeTransferConsent(userEmail: string): Promise<boolean> {
  if (!supabaseAdmin) {
    logger.error('[Data Transfer Restrictions] Supabase not available, cannot revoke consent');
    return false;
  }

  try {
    const { error } = await supabaseAdmin
      .from('data_transfer_restrictions')
      .update({
        consent_revoked_at: new Date().toISOString(),
        last_updated_at: new Date().toISOString(),
      })
      .eq('user_email', userEmail)
      .eq('restricted', true);

    if (error) {
      logger.error('[Data Transfer Restrictions] Failed to revoke consent:', {
        error: error.message,
        userEmail,
      });
      return false;
    }

    logger.info('[Data Transfer Restrictions] Consent revoked:', { userEmail });
    return true;
  } catch (error) {
    logger.error('[Data Transfer Restrictions] Unexpected error revoking consent:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return false;
  }
}
