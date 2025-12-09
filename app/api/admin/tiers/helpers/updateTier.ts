import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { invalidateTierCache } from '@/lib/tier-config-db';
import { logTierConfigChange } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';
import type { AdminUser } from '@/lib/admin-auth';

/**
 * Updates a tier configuration in the database.
 *
 * @param {string} tierSlug - The tier slug to update.
 * @param {Record<string, unknown>} updates - Update data.
 * @param {AdminUser} adminUser - The admin user updating the tier.
 * @param {NextRequest} request - The request object for audit logging.
 * @returns {Promise<{ tier: any } | NextResponse>} Updated tier data or error response.
 */
export async function updateTier(
  tierSlug: string,
  updates: Record<string, unknown>,
  adminUser: AdminUser,
  request: NextRequest,
): Promise<{ tier: any } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }

  // Get current config for audit log
  const { data: currentData } = await supabaseAdmin
    .from('tier_configurations')
    .select('*')
    .eq('tier_slug', tierSlug)
    .single();

  const { data, error } = await supabaseAdmin
    .from('tier_configurations')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('tier_slug', tierSlug)
    .select()
    .single();

  if (error) {
    logger.error('[Admin Tiers] Failed to update tier:', error);
    return NextResponse.json({ error: 'Failed to update tier' }, { status: 500 });
  }

  await invalidateTierCache();
  await logTierConfigChange(adminUser.email, tierSlug, updates, request);

  return { tier: data };
}
