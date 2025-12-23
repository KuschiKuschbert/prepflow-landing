import { logger } from '@/lib/logger';
import { isRestrictedCountry, getUserCountry } from '../country-detection';
import type { TransferRestrictionResult } from '../types';
import { checkUserConsent, buildRestrictedResult } from './checkConsent';

/**
 * Check if data transfer is allowed for a user
 */
export async function checkTransferRestriction(
  userEmail: string,
  request?: Request,
): Promise<TransferRestrictionResult> {
  try {
    const countryCode = await getUserCountry(userEmail, request);

    if (!countryCode) {
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
      return {
        allowed: true,
        restricted: false,
        countryCode,
        requiresConsent: false,
        consentGiven: false,
      };
    }

    const { consentGiven, error } = await checkUserConsent(userEmail, countryCode);

    if (error) {
      return {
        allowed: false,
        restricted: true,
        countryCode,
        reason: error,
        requiresConsent: true,
        consentGiven: false,
      };
    }

    return buildRestrictedResult(
      countryCode,
      consentGiven,
      `Data transfers to ${countryCode} are restricted. Explicit consent is required.`,
    );
  } catch (error) {
    logger.error('[Data Transfer Restrictions] Unexpected error checking restriction:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
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
