/**
 * EU Customer Detection
 * Detects EU customers for enhanced cancellation rights (EU Data Act compliance)
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { detectCountryFromHeaders, getUserCountry } from '@/lib/data-transfer/country-detection';

/**
 * List of EU member countries (ISO 3166-1 alpha-2 codes)
 * Source: https://europa.eu/european-union/about-eu/countries_en
 */
export const EU_COUNTRIES = [
  'AT', // Austria
  'BE', // Belgium
  'BG', // Bulgaria
  'HR', // Croatia
  'CY', // Cyprus
  'CZ', // Czech Republic
  'DK', // Denmark
  'EE', // Estonia
  'FI', // Finland
  'FR', // France
  'DE', // Germany
  'GR', // Greece
  'HU', // Hungary
  'IE', // Ireland
  'IT', // Italy
  'LV', // Latvia
  'LT', // Lithuania
  'LU', // Luxembourg
  'MT', // Malta
  'NL', // Netherlands
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'SK', // Slovakia
  'SI', // Slovenia
  'ES', // Spain
  'SE', // Sweden
] as const;

export type EUCountry = (typeof EU_COUNTRIES)[number];

/**
 * Check if a country code is an EU member country
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Whether country is an EU member
 */
export function isEUCountry(countryCode: string | null): boolean {
  if (!countryCode) {
    return false;
  }
  return EU_COUNTRIES.includes(countryCode.toUpperCase() as EUCountry);
}

/**
 * Detect if user is an EU customer from request headers
 * @param headers - Request headers
 * @returns Whether user is an EU customer
 */
export function detectEUFromHeaders(headers: Headers): boolean {
  const countryCode = detectCountryFromHeaders(headers);
  return isEUCountry(countryCode);
}

/**
 * Get user's EU status from database or detect from request
 * @param userEmail - User email
 * @param request - Request object (optional, for detection)
 * @returns Whether user is an EU customer
 */
export async function getUserEUStatus(userEmail: string, request?: Request): Promise<boolean> {
  try {
    // Get country from database or detect from request
    const countryCode = await getUserCountry(userEmail, request);

    if (!countryCode) {
      return false;
    }

    return isEUCountry(countryCode);
  } catch (error) {
    logger.error('[EU Detection] Error getting EU status:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return false;
  }
}

/**
 * Store user's EU status in database
 * @param userEmail - User email
 * @param isEU - Whether user is an EU customer
 * @returns Success status
 */
export async function storeUserEUStatus(userEmail: string, isEU: boolean): Promise<boolean> {
  try {
    if (!supabaseAdmin) {
      return false;
    }

    // Update users table with EU status
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        is_eu_customer: isEU,
        updated_at: new Date().toISOString(),
      })
      .eq('email', userEmail);

    if (error) {
      logger.error('[EU Detection] Failed to store EU status:', {
        error: error.message,
        userEmail,
        isEU,
      });
      return false;
    }

    logger.info('[EU Detection] EU status stored:', {
      userEmail,
      isEU,
    });

    return true;
  } catch (error) {
    logger.error('[EU Detection] Unexpected error storing EU status:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
      isEU,
    });
    return false;
  }
}

/**
 * Detect and store user's EU status
 * Should be called when request headers are available (e.g., in middleware or API routes)
 *
 * @param {string} email - User email
 * @param {Headers} headers - Request headers
 * @returns {Promise<boolean>} Whether user is an EU customer
 */
export async function detectAndStoreEUStatus(email: string, headers: Headers): Promise<boolean> {
  try {
    const isEU = detectEUFromHeaders(headers);
    await storeUserEUStatus(email, isEU);
    return isEU;
  } catch (error) {
    logger.warn('[EU Detection] Failed to detect/store EU status:', {
      error: error instanceof Error ? error.message : String(error),
      email,
    });
    return false;
  }
}



