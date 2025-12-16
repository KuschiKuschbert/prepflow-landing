/**
 * Country Detection Utilities
 * Detects user country from IP address or request headers
 */

import { logger } from '@/lib/logger';

/**
 * List of restricted countries (ISO 3166-1 alpha-2 codes)
 * Data transfers to these countries are restricted unless explicit consent is given
 */
export const RESTRICTED_COUNTRIES = ['CN', 'RU', 'IR'] as const;

export type RestrictedCountry = (typeof RESTRICTED_COUNTRIES)[number];

/**
 * Check if a country code is restricted
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Whether country is restricted
 */
export function isRestrictedCountry(countryCode: string | null): boolean {
  if (!countryCode) {
    return false;
  }
  return RESTRICTED_COUNTRIES.includes(countryCode.toUpperCase() as RestrictedCountry);
}

/**
 * Detect country from request headers (Vercel geolocation)
 * @param headers - Request headers
 * @returns Country code or null
 */
export function detectCountryFromHeaders(headers: Headers): string | null {
  // Vercel automatically provides geolocation headers
  const countryCode = headers.get('x-vercel-ip-country');

  if (countryCode) {
    return countryCode.toUpperCase();
  }

  // Fallback: Try to detect from Accept-Language header
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    const locale = acceptLanguage.split(',')[0] || 'en-AU';
    // Extract country from locale (e.g., 'en-AU' -> 'AU')
    const parts = locale.split('-');
    if (parts.length > 1) {
      return parts[1].toUpperCase();
    }
  }

  return null;
}

/**
 * Detect country from IP address (using Vercel headers or external service)
 * @param request - Request object with headers
 * @returns Country code or null
 */
export async function detectCountryFromRequest(request: Request): Promise<string | null> {
  try {
    // Try Vercel geolocation header first
    const countryCode = detectCountryFromHeaders(request.headers);

    if (countryCode) {
      return countryCode;
    }

    // Fallback: Could use external IP geolocation service if needed
    // For now, return null if detection fails
    return null;
  } catch (error) {
    logger.error('[Country Detection] Error detecting country:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Get user's country from database or detect from request
 * @param userEmail - User email
 * @param request - Request object (optional, for detection)
 * @returns Country code or null
 */
export async function getUserCountry(userEmail: string, request?: Request): Promise<string | null> {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase');

    if (!supabaseAdmin) {
      // If no database, try to detect from request
      if (request) {
        return await detectCountryFromRequest(request);
      }
      return null;
    }

    // Get country from database
    const { data, error } = await supabaseAdmin
      .from('data_transfer_restrictions')
      .select('country_code')
      .eq('user_email', userEmail)
      .single();

    if (error || !data) {
      // Not in database, try to detect from request
      if (request) {
        const detectedCountry = await detectCountryFromRequest(request);
        // Store detected country for future use
        if (detectedCountry) {
          await storeUserCountry(userEmail, detectedCountry);
        }
        return detectedCountry;
      }
      return null;
    }

    return data.country_code;
  } catch (error) {
    logger.error('[Country Detection] Error getting user country:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return null;
  }
}

/**
 * Store user's country in database
 * @param userEmail - User email
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Success status
 */
export async function storeUserCountry(userEmail: string, countryCode: string): Promise<boolean> {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase');

    if (!supabaseAdmin) {
      return false;
    }

    const restricted = isRestrictedCountry(countryCode);

    const { error } = await supabaseAdmin.from('data_transfer_restrictions').upsert(
      {
        user_email: userEmail,
        country_code: countryCode.toUpperCase(),
        restricted,
        last_updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_email',
      },
    );

    if (error) {
      logger.error('[Country Detection] Failed to store user country:', {
        error: error.message,
        userEmail,
        countryCode,
      });
      return false;
    }

    logger.info('[Country Detection] User country stored:', {
      userEmail,
      countryCode: countryCode.toUpperCase(),
      restricted,
    });

    return true;
  } catch (error) {
    logger.error('[Country Detection] Unexpected error storing country:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
      countryCode,
    });
    return false;
  }
}




