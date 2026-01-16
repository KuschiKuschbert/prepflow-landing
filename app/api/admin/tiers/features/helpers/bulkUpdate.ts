import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextRequest, NextResponse } from 'next/server';
import type { TierSlug } from '@/lib/tier-config';

interface BulkUpdateParams {
  mappings: Array<{ feature_key: string; required_tier: TierSlug }>;
  adminEmail: string;
  request: NextRequest;
}

/**
 * Bulk update feature tier mappings
 *
 * @param {BulkUpdateParams} params - Bulk update parameters
 * @returns {Promise<NextResponse>} Success response with mappings data
 */
export async function bulkUpdateFeatureMappings(params: BulkUpdateParams): Promise<NextResponse> {
  const { mappings, adminEmail, request } = params;

  // Get current mappings for audit log
  const featureKeys = mappings.map(m => m.feature_key);
  const { data: currentMappings, error: currentMappingsError } = await supabaseAdmin!
    .from('feature_tier_mapping')
    .select('feature_key, required_tier')
    .in('feature_key', featureKeys);

  if (currentMappingsError) {
    logger.warn('[Admin Tiers Features] Error fetching current mappings:', {
      error: currentMappingsError.message,
      code: (currentMappingsError as unknown).code,
      featureKeys,
    });
  }

  const currentMap = new Map(
    (currentMappings || []).map(m => [m.feature_key, m.required_tier as TierSlug]),
  );

  // Upsert all mappings
  const updates = mappings.map(m => ({
    feature_key: m.feature_key,
    required_tier: m.required_tier,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabaseAdmin!
    .from('feature_tier_mapping')
    .upsert(updates, { onConflict: 'feature_key' })
    .select();

  if (error) {
    logger.error('[Admin Tiers Features] Failed to bulk update mappings:', error);
    return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
  }

  // Log each change
  const { logFeatureTierChange } = await import('@/lib/admin-audit');
  for (const mapping of mappings) {
    const oldTier = (currentMap.get(mapping.feature_key) as TierSlug) || 'starter';
    if (oldTier !== mapping.required_tier) {
      await logFeatureTierChange(
        adminEmail,
        mapping.feature_key,
        oldTier,
        mapping.required_tier,
        request,
      );
    }
  }

  const { invalidateTierCache } = await import('@/lib/tier-config-db');
  await invalidateTierCache();

  return NextResponse.json({ mappings: data || [], updated: mappings.length });
}
