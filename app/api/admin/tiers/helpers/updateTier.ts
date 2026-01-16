import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
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
): Promise<{ tier: unknown } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 503),
      { status: 503 },
    );
  }

  // Get current config for audit log
  const { data: currentData, error: currentDataError } = await supabaseAdmin
    .from('tier_configurations')
    .select('*')
    .eq('tier_slug', tierSlug)
    .single();

  if (currentDataError && currentDataError.code !== 'PGRST116') {
    logger.warn('[Admin Tiers] Error fetching current tier config:', {
      error: currentDataError.message,
      code: currentDataError.code,
      tierSlug,
    });
  }

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
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to update tier', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }

  await invalidateTierCache();
  await logTierConfigChange(adminUser.email, tierSlug, updates, request);

  return { tier: data };
}
