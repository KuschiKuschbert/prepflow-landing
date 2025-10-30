import type { TierSlug } from './tier-config';
import { getEntitlementsForTier, hasFeature } from './entitlements';

export interface GateResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Temporary gate that allows everything by default until Auth0 + Stripe tiers are active.
 * Reads optional header `x-mock-tier` for local testing.
 */
export function evaluateGate(featureKey: string, req?: Request): GateResult {
  const mockTier = req?.headers.get('x-mock-tier') as TierSlug | null;
  const tier: TierSlug = mockTier ?? 'starter';
  const ent = getEntitlementsForTier('anonymous', tier);
  const ok = hasFeature(ent, featureKey);
  return ok ? { allowed: true } : { allowed: false, reason: 'feature-disabled' };
}
