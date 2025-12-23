import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { isRestrictedCountry } from '../country-detection';

/**
 * Record user consent for restricted data transfer
 */
export async function recordTransferConsent(
  userEmail: string,
  countryCode: string,
): Promise<boolean> {
  if (!isRestrictedCountry(countryCode)) {
    return true;
  }

  if (!supabaseAdmin) {
    logger.error('[Data Transfer Restrictions] Supabase not available, cannot record consent');
    return false;
  }

  try {
    const { error } = await supabaseAdmin.from('data_transfer_restrictions').upsert(
      {
        user_email: userEmail,
        country_code: countryCode.toUpperCase(),
        restricted: true,
        consent_given_at: new Date().toISOString(),
        consent_revoked_at: null,
        last_updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_email',
      },
    );

    if (error) {
      logger.error('[Data Transfer Restrictions] Failed to record consent:', {
        error: error.message,
        userEmail,
        countryCode,
      });
      return false;
    }

    logger.info('[Data Transfer Restrictions] Consent recorded:', {
      userEmail,
      countryCode: countryCode.toUpperCase(),
    });

    return true;
  } catch (error) {
    logger.error('[Data Transfer Restrictions] Unexpected error recording consent:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
      countryCode,
    });
    return false;
  }
}
