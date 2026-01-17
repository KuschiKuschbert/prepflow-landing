import { logAdminApiAction } from '@/lib/admin-audit';
import type { AdminUser } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { invalidateTierCache } from '@/lib/tier-config-db';
import { NextRequest, NextResponse } from 'next/server';
/**
 * Disables a tier configuration (soft delete) in the database.
 *
 * @param {string} tierSlug - The tier slug to disable.
 * @param {AdminUser} adminUser - The admin user disabling the tier.
 * @param {NextRequest} request - The request object for audit logging.
 * @returns {Promise<{ tier: Record<string, unknown> } | NextResponse>} Updated tier data or error response.
 */
export async function deleteTier(
  tierSlug: string,
  adminUser: AdminUser,
  request: NextRequest,
): Promise<{ tier: Record<string, unknown> } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 503),
      { status: 503 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from('tier_configurations')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('tier_slug', tierSlug)
    .select()
    .single();

  if (error) {
    logger.error('[Admin Tiers] Failed to disable tier:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to disable tier', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }

  await invalidateTierCache();
  await logAdminApiAction(adminUser, 'tier_disabled', request, {
    target_type: 'tier_configuration',
    target_id: tierSlug,
  });

  return { tier: data };
}
