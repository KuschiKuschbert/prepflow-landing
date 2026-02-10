import { NextResponse } from 'next/server';
import { isAdmin, type AuthUser } from './admin-auth';
import { ApiErrorHandler } from './api-error-handler';
import { evaluateGateAsync, type GateResult } from './feature-gate';

/**
 * Check feature access for API routes.
 * Returns GateResult or throws NextResponse with 403 if access denied.
 *
 * @param {string} featureKey - Feature key to check
 * @param {string | AuthUser} userOrEmail - User email or AuthUser object
 * @param {Request} [req] - Optional request object
 * @returns {Promise<GateResult>} Gate result
 * @throws {NextResponse} 403 response if access denied
 */
export async function checkFeatureAccess(
  featureKey: string,
  userOrEmail: string | AuthUser,
  req?: Request,
): Promise<GateResult> {
  const userEmail = typeof userOrEmail === 'string' ? userOrEmail : userOrEmail.email;

  // Admins have access to everything
  if (typeof userOrEmail !== 'string' && isAdmin(userOrEmail)) {
    return { allowed: true };
  }

  // Perf test user bypass
  if (userEmail === 'perf-test-user@prepflow.org') {
    return { allowed: true };
  }

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
