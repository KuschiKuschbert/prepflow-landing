import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { calculateMenuStatistics } from './helpers/calculateMenuStatistics';
import { handleMenuStatisticsError } from './helpers/handleMenuStatisticsError';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;

    if (!menuId) {
      return NextResponse.json({ error: 'Missing menu id' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Fetch menu items with dishes and recipes
    const { data: menuItems } = await supabaseAdmin
      .from('menu_items')
      .select(
        `
        dish_id,
        recipe_id,
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
      .eq('menu_id', menuId);

    if (!menuItems || menuItems.length === 0) {
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

    const statistics = await calculateMenuStatistics(menuItems);

    return NextResponse.json({
      success: true,
      statistics,
    });
  } catch (err) {
    return handleMenuStatisticsError(err);
  }
}
