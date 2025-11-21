/**
 * Menu Lock Change Tracking Utilities
 * Tracks changes to dishes/recipes/ingredients while menus are locked
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export type EntityType = 'dish' | 'recipe' | 'ingredient';
export type ChangeType =
  | 'updated'
  | 'deleted'
  | 'price_changed'
  | 'ingredients_changed'
  | 'recipes_changed'
  | 'cost_changed'
  | 'yield_changed'
  | 'instructions_changed';

export interface ChangeDetails {
  field?: string;
  before?: any;
  after?: any;
  change?: string;
  [key: string]: any;
}

export interface MenuChangeTracking {
  id: string;
  menu_id: string;
  entity_type: EntityType;
  entity_id: string;
  entity_name: string;
  change_type: ChangeType;
  change_details: ChangeDetails;
  changed_at: string;
  changed_by: string | null;
  handled: boolean;
  handled_at: string | null;
}

/**
 * Find all locked menus using a specific entity (dish, recipe, or ingredient)
 */
async function getLockedMenusUsingEntity(
  entityType: EntityType,
  entityId: string,
): Promise<string[]> {
  if (!supabaseAdmin) {
    logger.error('[Menu Change Tracking] Supabase admin client not available');
    return [];
  }

  try {
    const lockedMenuIds: string[] = [];

    if (entityType === 'dish') {
      // Find menu items using this dish
      const { data: menuItems, error } = await supabaseAdmin
        .from('menu_items')
        .select('menu_id')
        .eq('dish_id', entityId);

      if (error) {
        logger.error('[Menu Change Tracking] Failed to fetch menu items with dish:', {
          dishId: entityId,
          error: error.message,
        });
        return [];
      }

      if (menuItems && menuItems.length > 0) {
        const menuIds = [...new Set(menuItems.map(item => item.menu_id))];
        // Check which menus are locked
        const { data: lockedMenus, error: lockError } = await supabaseAdmin
          .from('menus')
          .select('id')
          .in('id', menuIds)
          .eq('is_locked', true);

        if (!lockError && lockedMenus) {
          lockedMenuIds.push(...lockedMenus.map(m => m.id));
        }
      }
    } else if (entityType === 'recipe') {
      // Find menu items using this recipe
      const { data: menuItems, error } = await supabaseAdmin
        .from('menu_items')
        .select('menu_id')
        .eq('recipe_id', entityId);

      if (error) {
        logger.error('[Menu Change Tracking] Failed to fetch menu items with recipe:', {
          recipeId: entityId,
          error: error.message,
        });
        return [];
      }

      if (menuItems && menuItems.length > 0) {
        const menuIds = [...new Set(menuItems.map(item => item.menu_id))];
        // Check which menus are locked
        const { data: lockedMenus, error: lockError } = await supabaseAdmin
          .from('menus')
          .select('id')
          .in('id', menuIds)
          .eq('is_locked', true);

        if (!lockError && lockedMenus) {
          lockedMenuIds.push(...lockedMenus.map(m => m.id));
        }
      }
    } else if (entityType === 'ingredient') {
      // Find recipes using this ingredient
      const { data: recipeIngredients, error: recipeError } = await supabaseAdmin
        .from('recipe_ingredients')
        .select('recipe_id')
        .eq('ingredient_id', entityId);

      // Find dishes using this ingredient directly
      const { data: dishIngredients, error: dishError } = await supabaseAdmin
        .from('dish_ingredients')
        .select('dish_id')
        .eq('ingredient_id', entityId);

      const recipeIds = recipeIngredients
        ? [...new Set(recipeIngredients.map((ri: any) => ri.recipe_id))]
        : [];
      const dishIds = dishIngredients ? [...new Set(dishIngredients.map(di => di.dish_id))] : [];

      // Find menu items using these recipes
      const menuItemQueries: Promise<any>[] = [];

      if (recipeIds.length > 0) {
        menuItemQueries.push(
          Promise.resolve(
            supabaseAdmin.from('menu_items').select('menu_id').in('recipe_id', recipeIds),
          ).then(({ data }) => data || []),
        );
      }

      // Find menu items using these dishes
      if (dishIds.length > 0) {
        menuItemQueries.push(
          Promise.resolve(
            supabaseAdmin.from('menu_items').select('menu_id').in('dish_id', dishIds),
          ).then(({ data }) => data || []),
        );
      }

      const menuItemResults = await Promise.all(menuItemQueries);
      const allMenuIds = [...new Set(menuItemResults.flat().map((item: any) => item.menu_id))];

      if (allMenuIds.length > 0) {
        // Check which menus are locked
        const { data: lockedMenus, error: lockError } = await supabaseAdmin
          .from('menus')
          .select('id')
          .in('id', allMenuIds)
          .eq('is_locked', true);

        if (!lockError && lockedMenus) {
          lockedMenuIds.push(...lockedMenus.map(m => m.id));
        }
      }
    }

    return lockedMenuIds;
  } catch (err) {
    logger.error('[Menu Change Tracking] Error finding locked menus:', err);
    return [];
  }
}

/**
 * Track a change for all locked menus using a specific entity
 */
export async function trackChangeForLockedMenus(
  entityType: EntityType,
  entityId: string,
  entityName: string,
  changeType: ChangeType,
  changeDetails: ChangeDetails,
  changedBy: string | null = null,
): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Menu Change Tracking] Supabase admin client not available');
    return;
  }

  try {
    const lockedMenuIds = await getLockedMenusUsingEntity(entityType, entityId);

    if (lockedMenuIds.length === 0) {
      return; // No locked menus using this entity
    }

    // Create change tracking records for each locked menu
    const changeRecords = lockedMenuIds.map(menuId => ({
      menu_id: menuId,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName,
      change_type: changeType,
      change_details: changeDetails,
      changed_by: changedBy,
      handled: false,
    }));

    const { error } = await supabaseAdmin.from('menu_change_tracking').insert(changeRecords);

    if (error) {
      logger.error('[Menu Change Tracking] Failed to track changes:', {
        entityType,
        entityId,
        entityName,
        changeType,
        lockedMenuIds,
        error: error.message,
      });
    } else {
      logger.dev(
        `[Menu Change Tracking] Tracked ${changeType} for ${entityName} (${entityType}) in ${lockedMenuIds.length} locked menu(s)`,
      );
    }
  } catch (err) {
    logger.error('[Menu Change Tracking] Error tracking changes:', err);
  }
}

/**
 * Get all unhandled changes for a menu
 */
export async function getMenuChanges(menuId: string): Promise<MenuChangeTracking[]> {
  if (!supabaseAdmin) {
    logger.error('[Menu Change Tracking] Supabase admin client not available');
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('menu_change_tracking')
      .select('*')
      .eq('menu_id', menuId)
      .eq('handled', false)
      .order('changed_at', { ascending: false });

    if (error) {
      logger.error('[Menu Change Tracking] Failed to get menu changes:', {
        menuId,
        error: error.message,
      });
      return [];
    }

    return (data || []) as MenuChangeTracking[];
  } catch (err) {
    logger.error('[Menu Change Tracking] Error getting menu changes:', err);
    return [];
  }
}

/**
 * Mark changes as handled for a menu
 */
export async function markChangesHandled(menuId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Menu Change Tracking] Supabase admin client not available');
    return;
  }

  try {
    const { error } = await supabaseAdmin
      .from('menu_change_tracking')
      .update({
        handled: true,
        handled_at: new Date().toISOString(),
      })
      .eq('menu_id', menuId)
      .eq('handled', false);

    if (error) {
      logger.error('[Menu Change Tracking] Failed to mark changes as handled:', {
        menuId,
        error: error.message,
      });
    } else {
      logger.dev(`[Menu Change Tracking] Marked changes as handled for menu ${menuId}`);
    }
  } catch (err) {
    logger.error('[Menu Change Tracking] Error marking changes as handled:', err);
  }
}

/**
 * Clear all changes for a menu (on lock or after handling)
 */
export async function clearMenuChanges(menuId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Menu Change Tracking] Supabase admin client not available');
    return;
  }

  try {
    const { error } = await supabaseAdmin
      .from('menu_change_tracking')
      .delete()
      .eq('menu_id', menuId);

    if (error) {
      logger.error('[Menu Change Tracking] Failed to clear menu changes:', {
        menuId,
        error: error.message,
      });
    } else {
      logger.dev(`[Menu Change Tracking] Cleared all changes for menu ${menuId}`);
    }
  } catch (err) {
    logger.error('[Menu Change Tracking] Error clearing menu changes:', err);
  }
}

/**
 * Check if a menu is locked
 */
export async function isMenuLocked(menuId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    return false;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('menus')
      .select('is_locked')
      .eq('id', menuId)
      .single();

    if (error || !data) {
      return false;
    }

    return data.is_locked === true;
  } catch (err) {
    logger.error('[Menu Change Tracking] Error checking if menu is locked:', err);
    return false;
  }
}
