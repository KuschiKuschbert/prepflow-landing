/**
 * Fetch and transform recipe cards for export. Extracted for filesize limit.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export interface ExportCard {
  id: string;
  menuItemId: string;
  menuItemName: string;
  title: string;
  baseYield: number;
  ingredients: unknown[];
  methodSteps: unknown[];
  notes: string[];
  category: string;
  position: number;
}

interface RawCard {
  id: string;
  menu_item_id: string;
  title: string;
  base_yield: number;
  ingredients: unknown[];
  method_steps: unknown[];
  notes: string | string[] | null;
  menu_items: {
    recipes: { name?: string; recipe_name?: string } | null;
    dishes: { dish_name?: string } | null;
  } | null;
}

export async function fetchAndTransformCards(
  supabase: SupabaseClient,
  menuId: string,
): Promise<NextResponse | { cards: ExportCard[]; menuName: string }> {
  const { data: cards, error } = await supabase
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
        dish_id,
        recipe_id,
        dishes (dish_name),
        recipes (recipe_name)
      )
    `,
    )
    .eq('menu_items.menu_id', menuId);

  if (error) {
    logger.error('[Recipe Cards Export] Failed to fetch recipe cards:', error);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to fetch recipe cards',
        'DATABASE_ERROR',
        500,
        error.message || String(error),
      ),
      { status: 500 },
    );
  }

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('id, category, position')
    .eq('menu_id', menuId)
    .order('category', { ascending: true })
    .order('position', { ascending: true });

  const itemOrderMap = new Map<string, { category: string; position: number }>();
  if (menuItems) {
    menuItems.forEach(item => {
      itemOrderMap.set(item.id, { category: item.category || '', position: item.position || 0 });
    });
  }

  const { data: menu } = await supabase.from('menus').select('menu_name').eq('id', menuId).single();

  const menuName = menu?.menu_name || 'Menu';

  const transformedCards = ((cards || []) as unknown as RawCard[])
    .map(card => {
      const menuItem = card.menu_items;
      const recipeName = menuItem?.recipes?.recipe_name || menuItem?.recipes?.name || null;
      const menuItemName = menuItem?.dishes?.dish_name || recipeName || 'Unknown Item';
      const title = card.title || menuItemName;

      return {
        id: card.id,
        menuItemId: card.menu_item_id,
        menuItemName,
        title,
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
        position: itemOrderMap.get(card.menu_item_id)?.position ?? 999,
      };
    })
    .sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare !== 0) return categoryCompare;
      return a.position - b.position;
    });

  return { cards: transformedCards, menuName };
}
