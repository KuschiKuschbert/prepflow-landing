import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { TransferRestrictionResult } from '../types';

/**
 * Check if user has given consent for restricted data transfer
 */
export async function checkUserConsent(
  userEmail: string,
  countryCode: string,
): Promise<{ consentGiven: boolean; error?: string }> {
  if (!supabaseAdmin) {
    return {
      consentGiven: false,
      error: 'Database not available to verify consent',
    };
  }

  const { data, error } = await supabaseAdmin
    .from('data_transfer_restrictions')
    .select('consent_given_at, consent_revoked_at')
    .eq('user_email', userEmail)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      logger.warn('[Data Transfer Restrictions] Error checking consent:', {
        error: error.message,
        code: error.code,
        userEmail,
        countryCode,
      });
    }
    return { consentGiven: false };
  }

  if (!data) {
    return { consentGiven: false };
  }

  return {
    consentGiven: !!data.consent_given_at && !data.consent_revoked_at,
  };
}

/**
 * Build restriction result for restricted country
 */
export function buildRestrictedResult(
  countryCode: string,
  consentGiven: boolean,
  reason?: string,
): TransferRestrictionResult {
  if (consentGiven) {
    return {
      allowed: true,
      restricted: true,
      countryCode,
      requiresConsent: true,
      consentGiven: true,
    };
  }

  return {
    allowed: false,
    restricted: true,
    countryCode,
    reason: reason || `Data transfers to ${countryCode} require explicit consent.`,
    requiresConsent: true,
    consentGiven: false,
  };
}
