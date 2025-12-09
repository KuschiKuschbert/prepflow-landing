import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { logger } from '@/lib/logger';
import { fetchTiers } from './helpers/fetchTiers';
import { createTier, tierConfigSchema } from './helpers/createTier';
import { updateTier } from './helpers/updateTier';
import { deleteTier } from './helpers/deleteTier';

/**
 * GET /api/admin/tiers
 * List all tier configurations
 */
export async function GET(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);
    if (adminUser instanceof NextResponse) return adminUser;

    const result = await fetchTiers();
    if (result instanceof NextResponse) return result;

    return NextResponse.json({ tiers: result.tiers });
  } catch (error) {
    logger.error('[Admin Tiers] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/tiers
 * Create new tier (future expansion)
 */
export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);
    if (adminUser instanceof NextResponse) return adminUser;

    const body = await request.json();
    const validationResult = tierConfigSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error },
        { status: 400 },
      );
    }

    const result = await createTier(validationResult.data, adminUser, request);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({ tier: result.tier });
  } catch (error) {
    logger.error('[Admin Tiers] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/tiers
 * Update tier configuration
 */
export async function PUT(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);
    if (adminUser instanceof NextResponse) return adminUser;

    const body = await request.json();
    const validationResult = tierConfigSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error },
        { status: 400 },
      );
    }

    const { tier_slug, ...updates } = validationResult.data;

    const result = await updateTier(tier_slug, updates, adminUser, request);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({ tier: result.tier });
  } catch (error) {
    logger.error('[Admin Tiers] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/tiers
 * Disable tier (soft delete)
 */
export async function DELETE(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);
    if (adminUser instanceof NextResponse) return adminUser;

    const { searchParams } = new URL(request.url);
    const tierSlug = searchParams.get('tier_slug');

    if (!tierSlug) {
      return NextResponse.json({ error: 'tier_slug is required' }, { status: 400 });
    }

    const result = await deleteTier(tierSlug, adminUser, request);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({ tier: result.tier });
  } catch (error) {
    logger.error('[Admin Tiers] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
