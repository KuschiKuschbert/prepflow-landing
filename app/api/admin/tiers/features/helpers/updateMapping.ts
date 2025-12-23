import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextRequest, NextResponse } from 'next/server';
import type { TierSlug } from '@/lib/tier-config';

interface UpdateMappingParams {
  feature_key: string;
  required_tier: TierSlug;
  updates: Record<string, unknown>;
  adminEmail: string;
  request: NextRequest;
}

/**
 * Update a single feature tier mapping
 *
 * @param {UpdateMappingParams} params - Update parameters
 * @returns {Promise<NextResponse>} Success response with mapping data
 */
export async function updateFeatureMapping(params: UpdateMappingParams): Promise<NextResponse> {
  const { feature_key, required_tier, updates, adminEmail, request } = params;

  // Get current mapping for audit log
  const { data: currentData, error: currentDataError } = await supabaseAdmin!
    .from('feature_tier_mapping')
    .select('required_tier')
    .eq('feature_key', feature_key)
    .maybeSingle();

  if (currentDataError && currentDataError.code !== 'PGRST116') {
    logger.warn('[Admin Tiers Features] Error fetching current mapping:', {
      error: currentDataError.message,
      code: (currentDataError as any).code,
      feature_key,
    });
  }

  const oldTier = (currentData?.required_tier as TierSlug) || 'starter';

  const { data, error } = await supabaseAdmin!
    .from('feature_tier_mapping')
    .upsert(
      {
        feature_key,
        required_tier,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'feature_key' },
    )
    .select()
    .single();

  if (error) {
    logger.error('[Admin Tiers Features] Failed to update mapping:', error);
    return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
  }

  const { invalidateTierCache } = await import('@/lib/tier-config-db');
  const { logFeatureTierChange } = await import('@/lib/admin-audit');
  await invalidateTierCache();
  await logFeatureTierChange(adminEmail, feature_key, oldTier, required_tier, request);

  return NextResponse.json({ mapping: data });
}

