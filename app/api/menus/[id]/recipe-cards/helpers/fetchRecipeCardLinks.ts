/**
 * Helper to fetch recipe card links with fallback to old method.
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

import { ApiErrorHandler } from '@/lib/api-error-handler';

import { IngredientRow, MethodStepRow, RecipeCardDB } from '../types';

export interface RecipeCardLink {
  menu_item_id: string;
  recipe_card_id: string;
  menu_recipe_cards?: RecipeCardDB;
}

export interface RecipeCardOld {
  id: string;
  menu_item_id: string;
  title: string;
  base_yield: number;
  ingredients: IngredientRow[];
  method_steps: MethodStepRow[];
  notes: string[];
  card_content: Record<string, unknown> | null;
  parsed_at: string | null;
}

/**
 * Fetch recipe card links, with fallback to old method if junction table doesn't exist.
 */
export async function fetchRecipeCardLinks(
  supabase: SupabaseClient,
  menuItemIds: string[],
): Promise<{
  links: RecipeCardLink[] | null;
  cards: RecipeCardOld[] | null;
  useOldMethod: boolean;
}> {
  // Try to fetch recipe cards via junction table (cross-referencing)
  const { data: linksData, error: linksError } = await supabase
    .from('menu_item_recipe_card_links')
    .select(
      `
      menu_item_id,
      recipe_card_id,
      menu_recipe_cards (
        id,
        recipe_id,
        dish_id,
        recipe_signature,
        title,
        base_yield,
        ingredients,
        method_steps,
        notes,
        card_content,
        parsed_at
      )
    `,
    )
    .in('menu_item_id', menuItemIds);

  if (linksError) {
    // Check if error is about missing table (migration not run)
    const errorMessage = linksError.message || String(linksError);
    if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
      logger.dev('Junction table does not exist, falling back to old query method');
      // Fallback to old method: query cards directly by menu_item_id
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
          card_content,
          parsed_at
        `,
        )
        .in('menu_item_id', menuItemIds);

      if (cardsError) {
        logger.error('Failed to fetch recipe cards (old method):', cardsError);
        throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
      }

      return { links: null, cards: (cards || []) as RecipeCardOld[], useOldMethod: true };
    } else {
      logger.error('Failed to fetch recipe card links:', linksError);
      throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  return {
    links: (linksData || []) as unknown as RecipeCardLink[],
    cards: null,
    useOldMethod: false,
  };
}
