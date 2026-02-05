import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { calculateMenuStatistics } from './helpers/calculateMenuStatistics';
import { handleMenuStatisticsError } from './helpers/handleMenuStatisticsError';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Missing menu id', 'SERVER_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    // Fetch menu items with dishes and recipes
    // Note: recipes table uses 'name' column, not 'recipe_name'
    const { data: menuItems, error: queryError } = await supabaseAdmin
      .from('menu_items')
      .select(
        `
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
          name:recipe_name,
          yield
        )
      `,
      )
      .eq('menu_id', menuId);

    if (queryError) {
      logger.error('[Menu Statistics API] Database query error:', {
        error: queryError,
        menuId,
        message: queryError.message,
        details: queryError.details,
      });
      return NextResponse.json(
        {
          error: 'Database query failed',
          message: queryError.message || 'Failed to fetch menu items',
        },
        { status: 500 },
      );
    }

    logger.dev('[Menu Statistics API] Menu items fetched:', {
      menuId,
      itemCount: menuItems?.length || 0,
      items: menuItems?.map(item => ({
        dish_id: item.dish_id,
        recipe_id: item.recipe_id,
        has_dish: !!item.dishes,
        has_recipe: !!item.recipes,
        actual_selling_price: item.actual_selling_price,
      })),
    });

    if (!menuItems || menuItems.length === 0) {
      logger.dev('[Menu Statistics API] No menu items found, returning zeros');
      return NextResponse.json({
        success: true,
        statistics: {
          total_items: 0,
          total_dishes: 0,
          total_recipes: 0,
          total_cogs: 0,
          total_revenue: 0,
          gross_profit: 0,
          average_profit_margin: 0,
          food_cost_percent: 0,
        },
      });
    }

    logger.dev('[Menu Statistics API] Calculating statistics', { itemCount: menuItems.length });
    const statistics = await calculateMenuStatistics(menuItems);
    logger.dev('[Menu Statistics API] Statistics calculated:', statistics);

    return NextResponse.json({
      success: true,
      statistics,
    });
  } catch (err) {
    logger.error('[route.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return handleMenuStatisticsError(err);
  }
}
