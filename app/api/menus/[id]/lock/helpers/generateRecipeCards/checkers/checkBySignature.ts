import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { generateDataHash } from '../../cardBuilding';
import { findExistingCardBySignature, getRecipeSignature } from '../../cardManagement';
import { MenuItemData } from '../../types';
import { MenuItem } from '../fetchMenuItems';
import { ItemToGenerate } from '../types';

// Define result type
export interface SignatureCheckResult {
  handled: boolean;
  action?: 'link' | 'generate';
  cardId?: string;
  signature?: string;
  itemToGenerate?: ItemToGenerate;
}

export async function checkBySignature(
  supabase: SupabaseClient,
  menuItem: MenuItem,
  menuItemData: MenuItemData,
  normalizedIngredients: any[], // justified
): Promise<SignatureCheckResult> {
  const signature = getRecipeSignature(menuItemData, menuItem) || '';
  if (!signature) {
    logger.dev(
      `[Card Reuse] Could not determine signature for menu item ${menuItem.id}, falling back to old method`,
    );
    return { handled: false };
  }

  logger.dev(
    `[Card Reuse] Menu item ${menuItem.id} signature: ${signature} (dish_id: ${menuItem.dish_id}, recipe_id: ${menuItem.recipe_id})`,
  );

  const existingCard = await findExistingCardBySignature(supabase, signature, menuItem);
  if (!existingCard) {
    logger.dev(
      `[Card Reuse] ❌ No existing card found for signature ${signature} (dish_id: ${menuItem.dish_id}, recipe_id: ${menuItem.recipe_id}), falling back to old method check`,
    );
    return { handled: false, signature };
  }

  logger.dev(`[Card Reuse] ✅ Found existing card ${existingCard.id} for signature ${signature}`);
  const currentHash = generateDataHash(menuItemData, normalizedIngredients);
  logger.dev(
    `[Card Reuse] Comparing hashes - existing: ${existingCard.data_hash?.substring(0, 8) || 'none'}..., current: ${currentHash.substring(0, 8)}...`,
  );

  if (existingCard.data_hash === currentHash) {
    logger.dev(
      `[Card Reuse] ✅ Linking menu item ${menuItem.id} to existing card ${existingCard.id} (signature: ${signature}, hash matches)`,
    );
    return { handled: true, action: 'link', cardId: existingCard.id, signature };
  } else {
    logger.dev(
      `[Card Reuse] ⚠️ Card exists but data changed for menu item ${menuItem.id} (hash mismatch), will regenerate and update existing card...`,
    );
    return {
      handled: true,
      action: 'generate',
      signature,
      itemToGenerate: {
        menuItem,
        menuItemData,
        signature,
        existingCardId: existingCard.id,
      },
    };
  }
}
