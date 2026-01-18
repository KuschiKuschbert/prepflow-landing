import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { generateDataHash } from '../../cardBuilding';
import { MenuItemData } from '../../fetchMenuItemData';
import { MenuItem } from '../fetchMenuItems';
import { ItemToGenerate } from '../types';

export interface OldMethodCheckResult {
  reused: boolean;
  itemToGenerate?: ItemToGenerate;
}

export async function checkByOldMethod(
  supabase: SupabaseClient,
  menuItem: MenuItem,
  menuItemData: MenuItemData,
  normalizedIngredients: any[], // justified
  signature: string,
): Promise<OldMethodCheckResult> {
  const currentHash = generateDataHash(menuItemData, normalizedIngredients);
  logger.dev(
    `[Card Reuse] Checking old method for menu item ${menuItem.id} (hash: ${currentHash.substring(0, 8)}...)`,
  );

  const { data: existingCardOld, error: cardError } = await supabase
    .from('menu_recipe_cards')
    .select('id, data_hash')
    .eq('menu_item_id', menuItem.id)
    .single();

  if (!cardError && existingCardOld) {
    logger.dev(
      `[Card Reuse] Found existing card ${existingCardOld.id} for menu_item_id ${menuItem.id}`,
    );
    logger.dev(
      `[Card Reuse] Comparing hashes - existing: ${existingCardOld.data_hash?.substring(0, 8) || 'none'}..., current: ${currentHash.substring(0, 8)}...`,
    );

    if (existingCardOld.data_hash === currentHash) {
      logger.dev(
        `[Card Reuse] ✅ Reusing existing card ${existingCardOld.id} for menu item ${menuItem.id} (hash matches)`,
      );
      return { reused: true };
    } else {
      logger.dev(
        `[Card Reuse] ⚠️ Card exists for menu item ${menuItem.id} but hash changed (old: ${existingCardOld.data_hash?.substring(0, 8) || 'none'}..., new: ${currentHash.substring(0, 8)}...), will regenerate`,
      );
      return {
        reused: false,
        itemToGenerate: { menuItem, menuItemData, signature },
      };
    }
  } else {
    if (cardError && cardError.code === 'PGRST116') {
      logger.dev(
        `[Card Reuse] ❌ No existing card found for menu item ${menuItem.id} (PGRST116 - no rows), will generate new card`,
      );
    } else if (cardError) {
      logger.warn(
        `[Card Reuse] Error checking for existing card for menu item ${menuItem.id}:`,
        cardError,
      );
    } else {
      logger.dev(
        `[Card Reuse] ❌ No existing card found for menu item ${menuItem.id}, will generate new card`,
      );
    }
    return {
      reused: false,
      itemToGenerate: { menuItem, menuItemData, signature },
    };
  }
}
