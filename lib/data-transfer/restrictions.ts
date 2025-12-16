/**
 * Data Transfer Restrictions
 * Enforces restrictions on data transfers to restricted countries
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { isRestrictedCountry, getUserCountry, type RestrictedCountry } from './country-detection';

export interface TransferRestrictionResult {
  allowed: boolean;
  restricted: boolean;
  countryCode: string | null;
  reason?: string;
  requiresConsent: boolean;
  consentGiven: boolean;
}

/**
 * Check if data transfer is allowed for a user
 * @param userEmail - User email
 * @param request - Request object (optional, for country detection)
 * @returns Transfer restriction result
 */
export async function checkTransferRestriction(
  userEmail: string,
  request?: Request,
): Promise<TransferRestrictionResult> {
  try {
    // Get user's country
    const countryCode = await getUserCountry(userEmail, request);

    if (!countryCode) {
      // Country not detected - allow transfer (fail open for better UX)
      logger.warn('[Data Transfer Restrictions] Country not detected, allowing transfer:', {
        userEmail,
      });
      return {
        allowed: true,
        restricted: false,
        countryCode: null,
        requiresConsent: false,
        consentGiven: false,
      };
    }

    const restricted = isRestrictedCountry(countryCode);

    if (!restricted) {
      // Not a restricted country - allow transfer
      return {
        allowed: true,
        restricted: false,
        countryCode,
        requiresConsent: false,
        consentGiven: false,
      };
    }

    // Restricted country - check if consent was given
    if (!supabaseAdmin) {
      logger.error('[Data Transfer Restrictions] Supabase not available, blocking transfer');
      return {
        allowed: false,
        restricted: true,
        countryCode,
        reason: 'Database not available to verify consent',
        requiresConsent: true,
        consentGiven: false,
      };
    }

    const { data, error } = await supabaseAdmin
      .from('data_transfer_restrictions')
      .select('consent_given_at, consent_revoked_at')
      .eq('user_email', userEmail)
      .single();

    if (error || !data) {
      // No consent record - block transfer
      return {
        allowed: false,
        restricted: true,
        countryCode,
        reason: `Data transfers to ${countryCode} are restricted. Explicit consent is required.`,
        requiresConsent: true,
        consentGiven: false,
      };
    }

    const consentGiven = !!data.consent_given_at && !data.consent_revoked_at;

    if (!consentGiven) {
      // Consent not given or revoked - block transfer
      return {
        allowed: false,
        restricted: true,
        countryCode,
        reason: `Data transfers to ${countryCode} require explicit consent.`,
        requiresConsent: true,
        consentGiven: false,
      };
    }

    // Consent given - allow transfer
    return {
      allowed: true,
      restricted: true,
      countryCode,
      requiresConsent: true,
      consentGiven: true,
    };
  } catch (error) {
    logger.error('[Data Transfer Restrictions] Unexpected error checking restriction:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    // Fail closed for security
    return {
      allowed: false,
      restricted: true,
      countryCode: null,
      reason: 'Error checking transfer restrictions',
      requiresConsent: false,
      consentGiven: false,
    };
  }
}

/**
 * Record user consent for restricted data transfer
 * @param userEmail - User email
 * @param countryCode - Country code
 * @returns Success status
 */
export async function recordTransferConsent(
  userEmail: string,
  countryCode: string,
): Promise<boolean> {
  if (!isRestrictedCountry(countryCode)) {
    // Not a restricted country - no consent needed
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

/**
 * Revoke user consent for restricted data transfer
 * @param userEmail - User email
 * @returns Success status
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

    logger.info('[Data Transfer Restrictions] Consent revoked:', {
      userEmail,
    });

    return true;
  } catch (error) {
    logger.error('[Data Transfer Restrictions] Unexpected error revoking consent:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return false;
  }
}




