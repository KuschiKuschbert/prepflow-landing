import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface Dish {
  id: string;
  name?: string;
  recipe_id?: string | null;
  selling_price?: number | null;
}

interface MenuItem {
  id: string;
  menu_id: string;
  dish_id: string;
  category?: string;
}

export async function GET(_req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Fetch all menus
    const { data: menus, error: menusError } = await supabaseAdmin
      .from('menus')
      .select('id, menu_name')
      .order('created_at', { ascending: false });

    if (menusError) {
      logger.error('[Dashboard Menu Summary] Error fetching menus:', {
        error: menusError.message,
        code: menusError.code,
        context: { endpoint: '/api/dashboard/menu-summary', operation: 'GET' },
      });
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(menusError, 500), { status: 500 });
    }

    // Fetch all menu items
    const { data: menuItems, error: menuItemsError } = await supabaseAdmin
      .from('menu_items')
      .select('id, menu_id, dish_id, category');

    if (menuItemsError) {
      logger.error('[Dashboard Menu Summary] Error fetching menu items:', {
        error: menuItemsError.message,
        code: menuItemsError.code,
        context: { endpoint: '/api/dashboard/menu-summary', operation: 'GET' },
      });
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(menuItemsError, 500), {
        status: 500,
      });
    }

    // Fetch all dishes to check for recipes and costs
    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from('menu_dishes')
      .select('id, name, recipe_id, selling_price');

    if (dishesError) {
      logger.error('[Dashboard Menu Summary] Error fetching dishes:', {
        error: dishesError.message,
        code: dishesError.code,
        context: { endpoint: '/api/dashboard/menu-summary', operation: 'GET' },
      });
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(dishesError, 500), {
        status: 500,
      });
    }

    // Create dish lookup map
    const dishMap = new Map(((dishes as Dish[]) || []).map(dish => [dish.id, dish]));

    // Count active menus (menus with items)
    const menusWithItems = new Set(((menuItems as MenuItem[]) || []).map(item => item.menu_id));
    const activeMenus = menusWithItems.size;

    // Count total dishes across all menus
    const totalDishes = menuItems?.length || 0;

    // Count dishes without recipes
    const dishesWithoutRecipes = ((menuItems as MenuItem[]) || []).filter(item => {
      const dish = dishMap.get(item.dish_id);
      return dish && (!dish.recipe_id || dish.recipe_id === null);
    }).length;

    // Count dishes without costs
    const dishesWithoutCosts = ((menuItems as MenuItem[]) || []).filter(item => {
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
    logger.error('[Dashboard Menu Summary] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { endpoint: '/api/dashboard/menu-summary', method: 'GET' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
