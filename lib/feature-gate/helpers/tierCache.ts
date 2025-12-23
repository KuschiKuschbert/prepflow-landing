import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { TierSlug } from '@/lib/tier-config';

const tierCache = new Map<string, { tier: TierSlug; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Get user tier from database with caching.
 */
export async function getUserTier(userEmail: string): Promise<TierSlug> {
  const cached = tierCache.get(userEmail);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.tier;
  }

  if (!supabaseAdmin) {
    return 'starter';
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

