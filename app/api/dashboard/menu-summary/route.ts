import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
export async function GET(_req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // Fetch all menus
    const { data: menus, error: menusError } = await supabaseAdmin
      .from('menus')
      .select('id, menu_name')
      .order('created_at', { ascending: false });

    if (menusError) {
      logger.error('Error fetching menus:', menusError);
      return NextResponse.json(
        {
          error: 'Database error',
          message: 'Could not retrieve menus from database',
        },
        { status: 500 },
      );
    }

    // Fetch all menu items
    const { data: menuItems, error: menuItemsError } = await supabaseAdmin
      .from('menu_items')
      .select('id, menu_id, dish_id, category');

    if (menuItemsError) {
      logger.error('Error fetching menu items:', menuItemsError);
      return NextResponse.json(
        {
          error: 'Database error',
          message: 'Could not retrieve menu items from database',
        },
        { status: 500 },
      );
    }

    // Fetch all dishes to check for recipes and costs
    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from('menu_dishes')
      .select('id, name, recipe_id, selling_price');

    if (dishesError) {
      logger.error('Error fetching dishes:', dishesError);
      return NextResponse.json(
        {
          error: 'Database error',
          message: 'Could not retrieve dishes from database',
        },
        { status: 500 },
      );
    }

    // Create dish lookup map
    const dishMap = new Map((dishes || []).map((dish: any) => [dish.id, dish]));

    // Count active menus (menus with items)
    const menusWithItems = new Set((menuItems || []).map((item: any) => item.menu_id));
    const activeMenus = menusWithItems.size;

    // Count total dishes across all menus
    const totalDishes = menuItems?.length || 0;

    // Count dishes without recipes
    const dishesWithoutRecipes = (menuItems || []).filter((item: any) => {
      const dish = dishMap.get(item.dish_id);
      return dish && (!dish.recipe_id || dish.recipe_id === null);
    }).length;

    // Count dishes without costs
    const dishesWithoutCosts = (menuItems || []).filter((item: any) => {
      const dish = dishMap.get(item.dish_id);
      return (
        dish && (!dish.selling_price || dish.selling_price === null || dish.selling_price === 0)
      );
    }).length;

    return NextResponse.json({
      success: true,
      activeMenus,
      totalDishes,
      dishesWithoutRecipes,
      dishesWithoutCosts,
      totalMenus: menus?.length || 0,
    });
  } catch (error) {
    logger.error('Error in menu summary API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}
