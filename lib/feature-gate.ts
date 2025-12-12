import { getEntitlementsForTier, hasFeature } from './entitlements';
import { logger } from './logger';
import { supabaseAdmin } from './supabase';
import type { TierSlug } from './tier-config';

export interface GateResult {
  allowed: boolean;
  reason?: string;
}

// In-memory cache for tier lookups (5-minute TTL)
const tierCache = new Map<string, { tier: TierSlug; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get user tier from database with caching.
 */
async function getUserTier(userEmail: string): Promise<TierSlug> {
  // Check cache first
  const cached = tierCache.get(userEmail);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.tier;
  }

  if (!supabaseAdmin) {
    return 'starter'; // Default fallback
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('subscription_tier')
      .eq('email', userEmail)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      logger.warn('[Feature Gate] Failed to fetch user tier:', {
        error: error.message,
        userEmail,
      });
      return 'starter';
    }

    const tier = (data?.subscription_tier as TierSlug) || 'starter';

    // Cache the result
    tierCache.set(userEmail, {
      tier,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return tier;
  } catch (error) {
    logger.warn('[Feature Gate] Error fetching user tier:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return 'starter';
  }
}

/**
 * Clear tier cache for a user (call after subscription updates).
 */
export function clearTierCache(userEmail?: string): void {
  if (userEmail) {
    tierCache.delete(userEmail);
  } else {
    tierCache.clear();
  }
}

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
 * Use this for unlockable features that require admin access or special flags.
 * Admin emails (in ALLOWED_EMAILS) automatically get all hidden features enabled.
 *
 * @param {string} featureKey - Feature flag key
 * @param {Request} [req] - Optional request object (for extracting user email from session)
 * @param {string} [userEmail] - Optional user email for admin check
 */
export async function evaluateGateAsync(
  featureKey: string,
  req?: Request,
  userEmail?: string,
): Promise<GateResult> {
  // Try to get user email from session if not provided
  let email = userEmail;
  if (!email && req) {
    try {
      const { auth0 } = await import('@/lib/auth0');
      const session = await auth0.getSession(req as any); // Convert Request to NextRequest if needed
      email = session?.user?.email || undefined;
    } catch {
      // Ignore errors getting session
    }
  }

  // Check hidden feature flags first (for unlockable features)
  // This now includes admin email check
  try {
    // Dynamic import with error handling
    let hiddenFeatureFlagsModule: {
      isHiddenFeatureEnabled?: (key: string, email?: string) => Promise<boolean>;
    } | null = null;
    try {
      hiddenFeatureFlagsModule = await import('./hidden-feature-flags');
    } catch {
      // Module doesn't exist or can't be imported - skip hidden feature check
      hiddenFeatureFlagsModule = null;
    }

    if (hiddenFeatureFlagsModule?.isHiddenFeatureEnabled) {
      const enabled = await hiddenFeatureFlagsModule.isHiddenFeatureEnabled(featureKey, email);
      if (enabled) {
        return { allowed: true };
      }
      // If feature exists but is disabled, return disabled reason
      // (isHiddenFeatureEnabled handles admin check, so if it returns false, feature is disabled)
      return { allowed: false, reason: 'hidden-feature-disabled' };
    }
  } catch (err: any) {
    // Table doesn't exist or other error - fall through to tier check
    // Don't log as error since table might not be created yet
    if (err?.message?.includes('relation') || err?.message?.includes('does not exist')) {
      // Table doesn't exist, use tier-based check
    } else {
      // Other error, log it
      logger.warn('[Feature Gate] Error checking hidden feature flag:', err);
    }
  }

  // Get user tier from database
  if (!email) {
    // No email available, use default tier
    return evaluateGate(featureKey, req);
  }

  try {
    const tier = await getUserTier(email);

    // Get tier config from database (with code fallback)
    const { getTierConfigFromDB } = await import('./tier-config-db');
    const tierConfig = await getTierConfigFromDB(tier);
    const ent = tierConfig
      ? { userId: email, tier, features: tierConfig.features }
      : getEntitlementsForTier(email, tier);

    const ok = hasFeature(ent, featureKey);

    if (ok) {
      return { allowed: true };
    }

    // Feature not allowed - determine reason
    // Check feature tier mapping from database (with code fallback)
    const { getFeatureTierMapping } = await import('./tier-config-db');
    const requiredTier = await getFeatureTierMapping(featureKey);

    if (requiredTier) {
      const tierOrder: TierSlug[] = ['starter', 'pro', 'business'];
      const currentTierIndex = tierOrder.indexOf(tier);
      const requiredTierIndex = tierOrder.indexOf(requiredTier);

      if (currentTierIndex < requiredTierIndex) {
        return {
          allowed: false,
          reason: 'upgrade-required',
        };
      }
    }

    return { allowed: false, reason: 'feature-disabled' };
  } catch (error) {
    logger.warn('[Feature Gate] Error evaluating gate:', {
      error: error instanceof Error ? error.message : String(error),
      featureKey,
      userEmail: email,
    });
    // Fallback to default behavior
    return evaluateGate(featureKey, req);
  }
}
