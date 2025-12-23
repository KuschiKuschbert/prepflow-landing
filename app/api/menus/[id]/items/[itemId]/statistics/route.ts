import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { calculateItemCOGS } from './helpers/calculateItemCOGS';
import { calculateRecommendedPrice } from './helpers/calculateRecommendedPrice';
import { calculateStatistics } from './helpers/calculateStatistics';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * GET /api/menus/[id]/items/[itemId]/statistics
 * Get statistics for a menu item (cost, profit margin, etc.)
 *
 * @param {NextRequest} req - Request object
 * @param {Object} context - Route context
 * @param {Promise<{id: string, itemId: string}>} context.params - Route parameters
 * @returns {Promise<NextResponse>} Menu item statistics
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string; itemId: string }> },
) {
  logger.dev('[Menu Item Statistics API] Route handler called', {
    path: req.nextUrl.pathname,
    method: req.method,
    url: req.url,
  });

  try {
    const params = await context.params;
    const menuId = params?.id;
    const menuItemId = params?.itemId;

    logger.dev('[Menu Item Statistics API] GET request received', {
      menuId,
      menuItemId,
      params,
      pathname: req.nextUrl.pathname,
    });

    if (!menuId || !menuItemId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Both menu id and item id are required', 'MISSING_REQUIRED_FIELD', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection not available',
          message: 'Database connection could not be established',
        },
        { status: 500 },
      );
    }

    // Fetch menu item with dish/recipe details
    // Note: recipes table doesn't have selling_price column - recipes use calculated recommended price
    const { data: menuItem, error: itemError } = await supabaseAdmin
      .from('menu_items')
      .select(
        `
        id,
        dish_id,
        recipe_id,
        actual_selling_price,
        recommended_selling_price,
        dishes (
          id,
          dish_name,
          selling_price
        ),
        recipes (
          id,
          name,
          yield
        )
      `,
      )
      .eq('id', menuItemId)
      .eq('menu_id', menuId)
      .single();

    if (itemError || !menuItem) {
      logger.error('Error fetching menu item:', itemError);
      return NextResponse.json(
        {
          success: false,
          error: itemError?.message || 'Menu item not found',
          message: 'Failed to fetch menu item',
        },
        { status: 404 },
      );
    }

    // Calculate COGS
    const { cogs, error: cogsError } = await calculateItemCOGS(menuItem);

    // Calculate recommended price
    const recommendedPrice = await calculateRecommendedPrice(menuItem, menuId);

    // Calculate statistics
    const statistics = calculateStatistics(menuItem, cogs, recommendedPrice);

    return NextResponse.json({
      success: true,
      statistics,
      // Include error information if COGS calculation had issues
      ...(cogsError && { cogs_error: cogsError }),
    });
  } catch (err) {
    logger.error('Unexpected error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
