/**
 * Invalidate tier configuration cache.
 */
import { supabaseAdmin } from '../supabase';
import { logger } from '../logger';
import { tierConfigCache, featureMappingCache } from './helpers/cacheManagement';

/**
 * Invalidate tier configuration cache.
 */
export async function invalidateTierCache(): Promise<void> {
  if (!supabaseAdmin) {
    // Clear in-memory cache
    tierConfigCache.clear();
    featureMappingCache.clear();
    return;
  }

  try {
    // Update cache invalidation timestamp
    const { error: upsertError } = await supabaseAdmin.from('tier_config_cache').upsert(
      {
        cache_key: 'tier_configs',
        invalidated_at: new Date().toISOString(),
      },
      { onConflict: 'cache_key' },
    );

    if (upsertError) {
      logger.warn('[Tier Config DB] Error updating cache invalidation:', {
        error: upsertError.message,
      });
    }

    // Clear in-memory cache
    tierConfigCache.clear();
    featureMappingCache.clear();

    logger.dev('[Tier Config DB] Cache invalidated');
  } catch (error) {
    logger.warn('[Tier Config DB] Error invalidating cache:', {
      error: error instanceof Error ? error.message : String(error),
    });
    // Still clear in-memory cache
    tierConfigCache.clear();
    featureMappingCache.clear();
  }
}



