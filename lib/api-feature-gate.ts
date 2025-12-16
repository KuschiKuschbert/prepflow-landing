import { evaluateGateAsync, type GateResult } from './feature-gate';
import { NextResponse } from 'next/server';
import { ApiErrorHandler } from './api-error-handler';

/**
 * Check feature access for API routes.
 * Returns GateResult or throws NextResponse with 403 if access denied.
 *
 * @param {string} featureKey - Feature key to check
 * @param {string} userEmail - User email
 * @param {Request} [req] - Optional request object
 * @returns {Promise<GateResult>} Gate result
 * @throws {NextResponse} 403 response if access denied
 */
export async function checkFeatureAccess(
  featureKey: string,
  userEmail: string,
  req?: Request,
): Promise<GateResult> {
  const result = await evaluateGateAsync(featureKey, req, userEmail);

  if (!result.allowed) {
    // Return upgrade message for upgrade-required reason
    if (result.reason === 'upgrade-required') {
      throw NextResponse.json(
        ApiErrorHandler.createError(
          'This feature requires a higher subscription tier. Please upgrade to access this feature.',
          'UPGRADE_REQUIRED',
          403,
        ),
        { status: 403 },
      );
    }

    // Generic access denied
    throw NextResponse.json(
      ApiErrorHandler.createError(
        'Access denied. This feature is not available.',
        'FEATURE_DISABLED',
        403,
      ),
      { status: 403 },
    );
  }

  return result;
}




