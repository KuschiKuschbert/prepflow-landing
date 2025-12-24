import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { EntityType } from '../types';
import { getLockedMenusByMenuItems } from './getLockedMenusUsingEntity/helpers/getLockedMenusByMenuItems';

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
    const lockedMenuIds: string[] = [];

    if (entityType === 'dish' || entityType === 'recipe') {
      const column = entityType === 'dish' ? 'dish_id' : 'recipe_id';
      const { data: menuItems, error } = await supabaseAdmin
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

      if (menuItems && menuItems.length > 0) {
        const menuIds = [...new Set(menuItems.map(item => item.menu_id))];
        const locked = await getLockedMenusByMenuItems(menuIds);
        lockedMenuIds.push(...locked);
      }
    } else if (entityType === 'ingredient') {
      const { data: recipeIngredients, error: recipeError } = await supabaseAdmin
        .from('recipe_ingredients')
        .select('recipe_id')
        .eq('ingredient_id', entityId);

      if (recipeError) {
        logger.warn('[Menu Change Tracking] Error fetching recipe ingredients:', {
          error: recipeError.message,
        });
      }

      const { data: dishIngredients, error: dishError } = await supabaseAdmin
        .from('dish_ingredients')
        .select('dish_id')
        .eq('ingredient_id', entityId);

      if (dishError) {
        logger.warn('[Menu Change Tracking] Error fetching dish ingredients:', {
          error: dishError.message,
        });
      }

      const recipeIds = recipeIngredients
        ? [...new Set(recipeIngredients.map((ri: any) => ri.recipe_id))]
        : [];
      const dishIds = dishIngredients ? [...new Set(dishIngredients.map(di => di.dish_id))] : [];

      const menuItemQueries: Promise<any>[] = [];

      if (recipeIds.length > 0) {
        menuItemQueries.push(
          Promise.resolve(
            supabaseAdmin
              .from('menu_items')
              .select('menu_id')
              .in('recipe_id', recipeIds)
              .then(({ data, error }) => {
                if (error) {
                  logger.warn('[Menu Change Tracking] Error fetching menu items with recipes:', {
                    error: error.message,
                  });
                }
                return data || [];
              }),
          ),
        );
      }

      if (dishIds.length > 0) {
        menuItemQueries.push(
          Promise.resolve(
            supabaseAdmin
              .from('menu_items')
              .select('menu_id')
              .in('dish_id', dishIds)
              .then(({ data, error }) => {
                if (error) {
                  logger.warn('[Menu Change Tracking] Error fetching menu items with dishes:', {
                    error: error.message,
                  });
                }
                return data || [];
              }),
          ),
        );
      }

      const menuItemResults = await Promise.all(menuItemQueries);
      const allMenuIds = [...new Set(menuItemResults.flat().map((item: any) => item.menu_id))];

      if (allMenuIds.length > 0) {
        const locked = await getLockedMenusByMenuItems(allMenuIds);
        lockedMenuIds.push(...locked);
      }
    }

    return lockedMenuIds;
  } catch (err) {
    logger.error('[Menu Change Tracking] Error finding locked menus:', {
      error: err instanceof Error ? err.message : String(err),
      context: { entityType, entityId },
    });
    return [];
  }
}
