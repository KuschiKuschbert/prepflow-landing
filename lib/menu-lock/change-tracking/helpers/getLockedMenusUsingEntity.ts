import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { EntityType } from '../types';
import { getLockedMenusByMenuItems } from './getLockedMenusUsingEntity/helpers/getLockedMenusByMenuItems';

async function getMenuIdsByDishOrRecipe(
  entityType: 'dish' | 'recipe',
  entityId: string,
): Promise<string[]> {
  const column = entityType === 'dish' ? 'dish_id' : 'recipe_id';
  const { data: menuItems, error } = await supabaseAdmin!
    .from('menu_items')
    .select('menu_id')
    .eq(column, entityId);

  if (error) {
    logger.error(`[Menu Change Tracking] Failed to fetch menu items with ${entityType}:`, {
      [entityType === 'dish' ? 'dishId' : 'recipeId']: entityId,
      error: error.message,
    });
    return [];
  }

  return menuItems ? [...new Set(menuItems.map(item => item.menu_id))] : [];
}

async function getMenuIdsByIngredient(entityId: string): Promise<string[]> {
  // Fetch recipes and dishes using this ingredient in parallel
  const [recipesRes, dishesRes] = await Promise.all([
    supabaseAdmin!.from('recipe_ingredients').select('recipe_id').eq('ingredient_id', entityId),
    supabaseAdmin!.from('dish_ingredients').select('dish_id').eq('ingredient_id', entityId),
  ]);

  if (recipesRes.error) {
    logger.warn('[Menu Change Tracking] Error fetching recipe ingredients:', {
      error: recipesRes.error.message,
    });
  }
  if (dishesRes.error) {
    logger.warn('[Menu Change Tracking] Error fetching dish ingredients:', {
      error: dishesRes.error.message,
    });
  }

  const recipeIds = recipesRes.data?.map(ri => ri.recipe_id) || [];
  const dishIds = dishesRes.data?.map(di => di.dish_id) || [];

  const menuItemQueries: (Promise<{ menu_id: string }[] | null> | PromiseLike<{ menu_id: string }[] | null>)[] = [];

  if (recipeIds.length > 0) {
    menuItemQueries.push(
      supabaseAdmin!
        .from('menu_items')
        .select('menu_id')
        .in('recipe_id', recipeIds)
        .then(res => res.data as { menu_id: string }[] | null),
    );
  }

  if (dishIds.length > 0) {
    menuItemQueries.push(
      supabaseAdmin!
        .from('menu_items')
        .select('menu_id')
        .in('dish_id', dishIds)
        .then(res => res.data as { menu_id: string }[] | null),
    );
  }

  const results = await Promise.all(menuItemQueries);
  const allMenuIds = results
    .flat()
    .filter((r): r is { menu_id: string } => !!r)
    .map(r => r.menu_id);

  return [...new Set(allMenuIds)];
}

/**
 * Find all locked menus using a specific entity (dish, recipe, or ingredient)
 */
export async function getLockedMenusUsingEntity(
  entityType: EntityType,
  entityId: string,
): Promise<string[]> {
  if (!supabaseAdmin) {
    logger.error('[Menu Change Tracking] Supabase admin client not available');
    return [];
  }

  try {
    let menuIds: string[] = [];

    if (entityType === 'dish' || entityType === 'recipe') {
      menuIds = await getMenuIdsByDishOrRecipe(entityType, entityId);
    } else if (entityType === 'ingredient') {
      menuIds = await getMenuIdsByIngredient(entityId);
    }

    if (menuIds.length === 0) {
      return [];
    }

    return await getLockedMenusByMenuItems(menuIds);
  } catch (err) {
    logger.error('[Menu Change Tracking] Error finding locked menus:', {
      error: err instanceof Error ? err.message : String(err),
      context: { entityType, entityId },
    });
    return [];
  }
}
