import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';
import { isSquarePOSEnabled } from '@/lib/square/feature-flags';

/**
 * Check if Square POS integration is enabled for user
 *
 * @param {string} email - User email address
 * @returns {Promise<NextResponse | null>} Error response if disabled, null if enabled
 */
export async function checkSquareFeatureFlag(email: string): Promise<NextResponse | null> {
  const enabled = await isSquarePOSEnabled(email, email);
  if (!enabled) {
    return NextResponse.json(
      ApiErrorHandler.createError('Square POS integration is not enabled', 'FEATURE_DISABLED', 403),
      { status: 403 },
    );
  }
  return null;
}
