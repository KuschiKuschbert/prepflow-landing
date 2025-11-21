/**
 * Helper functions for populating menus and menu_items
 */

import { logger } from '@/lib/logger';
import { cleanSampleMenus } from '@/lib/sample-menus-clean';
import { createSupabaseAdmin } from '@/lib/supabase';
import { buildMenuItemsData, createMenuLookupMaps, createMenuMap } from './menus-data-helpers';

interface PopulateResults {
  cleaned: number;
  populated: Array<{ table: string; count: number }>;
  errors: Array<{ table: string; error: string }>;
}

/**
 * Populate menus and menu_items
 */
export async function populateMenus(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
  dishesData: any[],
  recipesData: any[],
) {
  if (!dishesData || dishesData.length === 0) {
    logger.dev('No dishes available for menu creation');
  }

  if (!recipesData || recipesData.length === 0) {
    logger.dev('No recipes available for menu creation');
  }

  const { dishMap, recipeMap } = createMenuLookupMaps(dishesData || [], recipesData || []);

  // Create menus
  const menusToInsert = cleanSampleMenus.map(menu => ({
    menu_name: menu.menu_name,
    description: menu.description,
  }));

  const { data: menusData, error: menusError } = await supabaseAdmin
    .from('menus')
    .insert(menusToInsert)
    .select();

  if (menusError) {
    results.errors.push({ table: 'menus', error: menusError.message });
    logger.error('Error inserting menus:', menusError);
    return;
  }

  if (!menusData || menusData.length === 0) {
    logger.warn('No menus were created');
    return;
  }

  results.populated.push({ table: 'menus', count: menusData.length });
  logger.dev(`✅ Created ${menusData.length} menus`);

  // Create menu_items
  const menuMap = createMenuMap(menusData);
  const { data: menuItemsData, skipped: skippedItems } = buildMenuItemsData(
    menuMap,
    dishMap,
    recipeMap,
  );

  if (skippedItems.length > 0) {
    logger.warn(`Skipped ${skippedItems.length} menu item(s):`, {
      skippedItems: [...new Set(skippedItems)],
    });
  }

  if (menuItemsData.length > 0) {
    const { error: miError } = await supabaseAdmin.from('menu_items').insert(menuItemsData);

    if (miError) {
      results.errors.push({ table: 'menu_items', error: miError.message });
      logger.error('Error inserting menu_items:', miError);
    } else {
      results.populated.push({ table: 'menu_items', count: menuItemsData.length });
      logger.dev(`✅ Created ${menuItemsData.length} menu items`);
    }
  }
}
