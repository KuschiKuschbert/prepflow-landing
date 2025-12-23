import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { z } from 'zod';
import { handleTiersFeaturesError } from './helpers/handleError';
import { updateFeatureMapping } from './helpers/updateMapping';
import { bulkUpdateFeatureMappings } from './helpers/bulkUpdate';

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
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 503),
        { status: 503 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('feature_tier_mapping')
      .select('*')
      .order('feature_key');

    if (error) {
      logger.error('[Admin Tiers Features] Failed to fetch mappings:', error);
      return NextResponse.json(
        ApiErrorHandler.fromSupabaseError(error, 500),
        { status: 500 },
      );
    }

    return NextResponse.json({ mappings: data || [] });
  } catch (error) {
    return handleTiersFeaturesError(error);
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
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 503),
        { status: 503 },
      );
    }

    const { feature_key, required_tier, ...updates } = validationResult.data;

    return await updateFeatureMapping({
      feature_key,
      required_tier,
      updates,
      adminEmail: adminUser.email,
      request,
    });
  } catch (error) {
    return handleTiersFeaturesError(error);
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
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'DATABASE_ERROR', 503),
        { status: 503 },
      );
    }

    const { mappings } = validationResult.data;

    return await bulkUpdateFeatureMappings({
      mappings,
      adminEmail: adminUser.email,
      request,
    });
  } catch (error) {
    return handleTiersFeaturesError(error);
  }
}
