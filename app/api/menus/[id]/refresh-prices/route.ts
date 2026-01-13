/**
 * Menu Refresh Prices API Endpoint
 * POST /api/menus/[id]/refresh-prices - Recalculate recommended prices for all menu items
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getUserEmail } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { refreshMenuRecommendedPrices } from '../items/[itemId]/helpers/cacheRecommendedPrice';

/**
 * POST /api/menus/[id]/refresh-prices
 * Recalculate recommended prices for all menu items in a menu
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuId } = await context.params;

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Get user email for auth
    try {
      const userEmail = await getUserEmail(request);
      if (!userEmail && process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
          { status: 401 },
        );
      }
    } catch (authError: unknown) {
      logger.error('[route.ts] Error in catch block:', {
        error: authError instanceof Error ? authError.message : String(authError),
        stack: authError instanceof Error ? authError.stack : undefined,
      });

      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          ApiErrorHandler.createError('Authentication error', 'AUTH_ERROR', 401),
          { status: 401 },
        );
      }
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Verify menu exists
    const { data: menu, error: menuError } = await supabaseAdmin
      .from('menus')
      .select('id')
      .eq('id', menuId)
      .single();

    if (menuError || !menu) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Use existing refresh function
    const { updated, failed } = await refreshMenuRecommendedPrices(menuId);

    logger.dev(
      `[Menu Refresh Prices API] Refreshed prices for menu ${menuId}: ${updated} updated, ${failed} failed`,
    );

    return NextResponse.json({
      success: true,
      updated,
      failed,
      message: `Refreshed prices for ${updated} menu item${updated !== 1 ? 's' : ''}`,
    });
  } catch (err: unknown) {
    logger.error('[Menu Refresh Prices API] Error refreshing prices:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        err instanceof Error ? err.message : 'Failed to refresh prices',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
