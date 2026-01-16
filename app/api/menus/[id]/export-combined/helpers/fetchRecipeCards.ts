/**
 * Helper to fetch recipe cards for export.
 */

import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';

import { IngredientRow, MethodStepRow } from '../../recipe-cards/types';

export interface RecipeCardData {
  id: string;
  title: string;
  baseYield: number;
  ingredients: IngredientRow[];
  methodSteps: MethodStepRow[];
  notes: string[];
  category: string;
  position: number;
}

/**
 * Fetch recipe cards for a menu, sorted by category and position.
 */
export async function fetchRecipeCards(menuId: string): Promise<RecipeCardData[]> {
  const supabase = createSupabaseAdmin();
  const { data: cards, error: cardsError } = await supabase
    .from('menu_recipe_cards')
    .select(
      `
      id,
      menu_item_id,
      title,
      base_yield,
      ingredients,
      method_steps,
      notes,
      menu_items!inner (
        id,
        category,
        position
      )
    `,
    )
    .eq('menu_items.menu_id', menuId);

  if (cardsError) {
    logger.error('[Menus API] Error fetching recipe cards:', {
      error: cardsError.message,
      menuId,
      context: { endpoint: '/api/menus/[id]/export-combined', operation: 'fetchRecipeCards' },
    });
  }

  if (!cards || cards.length === 0) {
    return [];
  }

  const { data: menuItems, error: menuItemsError } = await supabase
    .from('menu_items')
    .select('id, category, position')
    .eq('menu_id', menuId)
    .order('category', { ascending: true })
    .order('position', { ascending: true });

  if (menuItemsError) {
    logger.error('[Menus API] Error fetching menu items:', {
      error: menuItemsError.message,
      menuId,
      context: { endpoint: '/api/menus/[id]/export-combined', operation: 'fetchRecipeCards' },
    });
  }

  interface MenuItemOrderResult {
    id: string;
    category: string | null;
    position: number | null;
  }

  const itemOrderMap = new Map<string, { category: string; position: number }>();
  if (menuItems) {
    (menuItems as unknown as MenuItemOrderResult[]).forEach(item => {
      itemOrderMap.set(item.id, {
        category: item.category || '',
        position: item.position || 0,
      });
    });
  }

  interface RawRecipeCard {
    id: string;
    title: string;
    base_yield: number;
    ingredients: IngredientRow[];
    method_steps: MethodStepRow[];
    notes: string[] | string | null;
    menu_item_id: string;
  }

  return (cards as unknown as RawRecipeCard[])
    .map(card => ({
      id: card.id,
      title: card.title || 'Unknown Recipe',
      baseYield: card.base_yield || 1,
      ingredients: card.ingredients || [],
      methodSteps: card.method_steps || [],
      notes:
        card.notes && typeof card.notes === 'string'
          ? card.notes.split('\n').filter((n: string) => n.trim().length > 0)
          : Array.isArray(card.notes)
            ? (card.notes as string[])
            : [],
      category: itemOrderMap.get(card.menu_item_id)?.category || 'Uncategorized',
      position: itemOrderMap.get(card.menu_item_id)?.position || 999,
    }))
    .sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare !== 0) return categoryCompare;
      return a.position - b.position;
    });
}
