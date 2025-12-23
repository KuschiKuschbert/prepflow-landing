import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { invalidateTierCache } from '@/lib/tier-config-db';
import { logTierConfigChange } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { AdminUser } from '@/lib/admin-auth';
const tierConfigSchema = z.object({
  tier_slug: z.enum(['starter', 'pro', 'business']),
  name: z.string().optional(),
  price_monthly: z.number().optional(),
  price_yearly: z.number().optional(),
  features: z.record(z.string(), z.boolean()).optional(),
  limits: z
    .object({
      recipes: z.number().optional(),
      ingredients: z.number().optional(),
    })
    .optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().optional(),
});

/**
 * Creates a new tier configuration in the database.
 *
 * @param {z.infer<typeof tierConfigSchema>} validated - Validated tier configuration data.
 * @param {AdminUser} adminUser - The admin user creating the tier.
 * @param {NextRequest} request - The request object for audit logging.
 * @returns {Promise<{ tier: any } | NextResponse>} Created tier data or error response.
 */
export async function createTier(
  validated: z.infer<typeof tierConfigSchema>,
  adminUser: AdminUser,
  request: NextRequest,
): Promise<{ tier: any } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 503), { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('tier_configurations')
    .insert({
      ...validated,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    logger.error('[Admin Tiers] Failed to create tier:', error);
    return NextResponse.json(ApiErrorHandler.createError('Failed to create tier', 'SERVER_ERROR', 500), { status: 500 });
  }

  await invalidateTierCache();
  await logTierConfigChange(adminUser.email, validated.tier_slug, validated, request);

  return { tier: data };
}

export { tierConfigSchema };
