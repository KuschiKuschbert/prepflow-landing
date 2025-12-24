// PrepFlow - Country Detection API
// Detects user's country from IP address using Vercel geolocation

import { NextRequest, NextResponse } from 'next/server';
import { detectCountryFromLocale } from '@/lib/country-config';

import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
export async function GET(request: NextRequest) {
  try {
    // Vercel automatically provides geolocation headers
    const countryCode = request.headers.get('x-vercel-ip-country') || null;

    // Fallback to browser locale if IP detection fails
    const acceptLanguage = request.headers.get('accept-language');
    const browserLocale = acceptLanguage?.split(',')[0] || 'en-AU';
    const fallbackCountry = detectCountryFromLocale(browserLocale);

    return NextResponse.json({
      success: true,
      country: countryCode || fallbackCountry,
      detected: !!countryCode,
      source: countryCode ? 'ip' : 'browser',
    });
  } catch (error) {
    logger.error('[Detect Country API] Error detecting country:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/detect-country', method: 'GET' },
    });
    // Return default fallback (graceful degradation)
    return NextResponse.json({
      success: true,
      country: 'AU',
      detected: false,
      source: 'fallback',
    });
  }
}
