import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { logFeatureTierChange, logAdminApiAction } from '@/lib/admin-audit';
import { invalidateTierCache } from '@/lib/tier-config-db';
import { z } from 'zod';
import type { TierSlug } from '@/lib/tier-config';

const featureMappingSchema = z.object({
  feature_key: z.string(),
  required_tier: z.enum(['starter', 'pro', 'business']),
  description: z.string().optional(),
  is_premium: z.boolean().optional(),
});

const bulkUpdateSchema = z.object({
  mappings: z.array(
    z.object({
      feature_key: z.string(),
      required_tier: z.enum(['starter', 'pro', 'business']),
    }),
  ),
});

/**
 * GET /api/admin/tiers/features
 * List feature-to-tier mappings
 */
export async function GET(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);
    if (adminUser instanceof NextResponse) return adminUser;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const { data, error } = await supabaseAdmin
      .from('feature_tier_mapping')
      .select('*')
      .order('feature_key');

    if (error) {
      logger.error('[Admin Tiers Features] Failed to fetch mappings:', error);
      return NextResponse.json({ error: 'Failed to fetch mappings' }, { status: 500 });
    }

    return NextResponse.json({ mappings: data || [] });
  } catch (error) {
    logger.error('[Admin Tiers Features] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/tiers/features
 * Update feature tier requirement
 */
export async function PUT(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);
    if (adminUser instanceof NextResponse) return adminUser;

    const body = await request.json();
    const validationResult = featureMappingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const { feature_key, required_tier, ...updates } = validationResult.data;

    // Get current mapping for audit log
    const { data: currentData } = await supabaseAdmin
      .from('feature_tier_mapping')
      .select('required_tier')
      .eq('feature_key', feature_key)
      .maybeSingle();

    const oldTier = (currentData?.required_tier as TierSlug) || 'starter';

    const { data, error } = await supabaseAdmin
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
      return NextResponse.json({ error: 'Failed to update mapping' }, { status: 500 });
    }

    await invalidateTierCache();
    await logFeatureTierChange(adminUser.email, feature_key, oldTier, required_tier, request);

    return NextResponse.json({ mapping: data });
  } catch (error) {
    logger.error('[Admin Tiers Features] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/tiers/features
 * Bulk update feature tiers
 */
export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);
    if (adminUser instanceof NextResponse) return adminUser;

    const body = await request.json();
    const validationResult = bulkUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const { mappings } = validationResult.data;

    // Get current mappings for audit log
    const featureKeys = mappings.map(m => m.feature_key);
    const { data: currentMappings } = await supabaseAdmin
      .from('feature_tier_mapping')
      .select('feature_key, required_tier')
      .in('feature_key', featureKeys);

    const currentMap = new Map(
      (currentMappings || []).map(m => [m.feature_key, m.required_tier as TierSlug]),
    );

    // Upsert all mappings
    const updates = mappings.map(m => ({
      feature_key: m.feature_key,
      required_tier: m.required_tier,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabaseAdmin
      .from('feature_tier_mapping')
      .upsert(updates, { onConflict: 'feature_key' })
      .select();

    if (error) {
      logger.error('[Admin Tiers Features] Failed to bulk update mappings:', error);
      return NextResponse.json({ error: 'Failed to bulk update mappings' }, { status: 500 });
    }

    // Log each change
    for (const mapping of mappings) {
      const oldTier = (currentMap.get(mapping.feature_key) as TierSlug) || 'starter';
      if (oldTier !== mapping.required_tier) {
        await logFeatureTierChange(
          adminUser.email,
          mapping.feature_key,
          oldTier,
          mapping.required_tier,
          request,
        );
      }
    }

    await invalidateTierCache();

    return NextResponse.json({ mappings: data || [], updated: mappings.length });
  } catch (error) {
    logger.error('[Admin Tiers Features] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




