import type { NextRequest } from 'next/server';
import { getEntitlementsForTier, hasFeature } from './entitlements';
import { checkHiddenFeature } from './feature-gate/helpers/checkHiddenFeature';
import { evaluateTierGate } from './feature-gate/helpers/evaluateTierGate';
import { clearTierCache } from './feature-gate/helpers/tierCache';
import { logger } from './logger';
import type { TierSlug } from './tier-config';

export interface GateResult {
  allowed: boolean;
  reason?: string;
}

export { clearTierCache };

/**
 * Temporary gate that allows everything by default until Auth0 + Stripe tiers are active.
 * Reads optional header `x-mock-tier` for local testing.
 * For hidden feature flags, use evaluateGateAsync instead.
 */
export function evaluateGate(featureKey: string, req?: Request): GateResult {
  const mockTier = req?.headers.get('x-mock-tier') as TierSlug | null;
  const tier: TierSlug = mockTier ?? 'starter';
  const ent = getEntitlementsForTier('anonymous', tier);
  const ok = hasFeature(ent, featureKey);
  return ok ? { allowed: true } : { allowed: false, reason: 'feature-disabled' };
}

/**
 * Async version that checks hidden feature flags.
 */
export async function evaluateGateAsync(
  featureKey: string,
  req?: Request,
  userEmail?: string,
): Promise<GateResult> {
  let email = userEmail;
  if (!email && req) {
    try {
      const { auth0 } = await import('@/lib/auth0');
      const session = await auth0.getSession(req as unknown as NextRequest);
      email = session?.user?.email || undefined;
    } catch {
      // Ignore errors getting session
    }
  }

  const hiddenFeature = await checkHiddenFeature(featureKey, email);
  if (hiddenFeature.exists) {
    return hiddenFeature.enabled
      ? { allowed: true }
      : { allowed: false, reason: 'hidden-feature-disabled' };
  }

  if (!email) {
    return evaluateGate(featureKey, req);
  }

  try {
    return await evaluateTierGate(featureKey, email);
  } catch (error) {
    logger.warn('[Feature Gate] Error evaluating gate:', {
      error: error instanceof Error ? error.message : String(error),
      featureKey,
      userEmail: email,
    });
    return evaluateGate(featureKey, req);
  }
}
