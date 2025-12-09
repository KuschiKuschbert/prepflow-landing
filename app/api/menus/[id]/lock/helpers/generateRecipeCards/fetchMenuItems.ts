/**
 * Fetch menu items and validate for recipe card generation
 */

import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface MenuItem {
  id: string;
  dish_id: string | null;
  recipe_id: string | null;
}

export async function fetchMenuItems(
  supabase: SupabaseClient,
  menuId: string,
): Promise<MenuItem[] | null> {
  const { data: menuItems, error: itemsError } = await supabase
    .from('menu_items')
    .select('id, dish_id, recipe_id')
    .eq('menu_id', menuId);

  if (itemsError || !menuItems) {
    logger.error('Failed to fetch menu items for recipe card generation', itemsError);
    return null;
  }

  if (menuItems.length === 0) {
    logger.info(`No menu items found for menu ${menuId}`);
    return [];
  }

  logger.dev(`Generating recipe cards for ${menuItems.length} menu items`);

  // Check if any existing cards exist for these menu items (for debugging)
  const menuItemIds = menuItems.map(mi => mi.id);
  const { data: existingCardsCheck, error: checkError } = await supabase
    .from('menu_recipe_cards')
    .select('id, menu_item_id, data_hash')
    .in('menu_item_id', menuItemIds);

  if (checkError) {
    logger.warn(`Error checking for existing cards:`, checkError);
  } else {
    logger.dev(
      `Found ${existingCardsCheck?.length || 0} existing cards for ${menuItems.length} menu items`,
    );
    if (existingCardsCheck && existingCardsCheck.length > 0) {
      logger.dev(
        `Existing card menu_item_ids: ${existingCardsCheck.map(c => c.menu_item_id).join(', ')}`,
      );
    }
  }

  return menuItems;
}
