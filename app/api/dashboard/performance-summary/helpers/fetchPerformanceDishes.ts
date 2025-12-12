/**
 * Helper for fetching dishes for performance analysis
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Fetches dishes for performance analysis with optional menu filtering
 *
 * @param {string | null} targetMenuId - Optional menu ID to filter by
 * @returns {Promise<{ dishes: any[] | null; isEmpty: boolean }>} Dishes data and empty flag
 */
export async function fetchPerformanceDishes(targetMenuId: string | null): Promise<{
  dishes: any[] | null;
  isEmpty: boolean;
}> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  // Build base query
  let dishesQuery = supabaseAdmin.from('menu_dishes').select(
    `
      id,
      name,
      selling_price,
      profit_margin,
      sales_data (
        id,
        number_sold,
        popularity_percentage,
        date
      )
    `,
  );

  // Filter by menu if menuId is provided
  if (targetMenuId) {
    // Get dish IDs from menu_items for this menu
    const { data: menuItems, error: menuItemsError } = await supabaseAdmin
      .from('menu_items')
      .select('dish_id')
      .eq('menu_id', targetMenuId)
      .not('dish_id', 'is', null);

    if (menuItemsError) {
      logger.error('[Performance Summary API] Error fetching menu items:', menuItemsError);
      // Continue without filtering if there's an error
    } else if (menuItems && menuItems.length > 0) {
      const dishIds = menuItems.map(item => item.dish_id).filter(Boolean) as string[];
      dishesQuery = dishesQuery.in('id', dishIds);
      logger.dev('[Performance Summary API] Filtering dishes by menu:', {
        menuId: targetMenuId,
        dishCount: dishIds.length,
      });
    } else {
      // No dishes in this menu, return empty result
      logger.dev('[Performance Summary API] No dishes found in menu:', { menuId: targetMenuId });
      return { dishes: null, isEmpty: true };
    }
  }

  const { data: dishes, error: dishesError } = await dishesQuery.order('created_at', {
    ascending: false,
  });

  if (dishesError) {
    logger.error('Error fetching dishes:', dishesError);
    throw new Error('Database error: Could not retrieve menu dishes from database');
  }

  return { dishes: dishes || [], isEmpty: false };
}




