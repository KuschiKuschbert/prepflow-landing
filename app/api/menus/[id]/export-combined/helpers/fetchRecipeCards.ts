/**
 * Helper to fetch recipe cards for export.
 */

import { createSupabaseAdmin } from '@/lib/supabase';

export interface RecipeCardData {
  id: string;
  title: string;
  baseYield: number;
  ingredients: any[];
  methodSteps: any[];
  notes: string[];
  category: string;
  position: number;
}

/**
 * Fetch recipe cards for a menu, sorted by category and position.
 */
export async function fetchRecipeCards(menuId: string): Promise<RecipeCardData[]> {
  const supabase = createSupabaseAdmin();
  const { data: cards } = await supabase
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

  if (!cards || cards.length === 0) {
    return [];
  }

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('id, category, position')
    .eq('menu_id', menuId)
    .order('category', { ascending: true })
    .order('position', { ascending: true });

  const itemOrderMap = new Map<string, { category: string; position: number }>();
  if (menuItems) {
    menuItems.forEach((item: any) => {
      itemOrderMap.set(item.id, {
        category: item.category || '',
        position: item.position || 0,
      });
    });
  }

  return cards
    .map((card: any) => ({
      id: card.id,
      title: card.title || 'Unknown Recipe',
      baseYield: card.base_yield || 1,
      ingredients: card.ingredients || [],
      methodSteps: card.method_steps || [],
      notes:
        card.notes && typeof card.notes === 'string'
          ? card.notes.split('\n').filter((n: string) => n.trim().length > 0)
          : Array.isArray(card.notes)
            ? card.notes
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
