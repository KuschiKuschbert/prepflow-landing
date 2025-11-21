import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { isMenuLocked, trackChangeForLockedMenus } from '@/lib/menu-lock/change-tracking';

/**
 * Invalidate cached recommended prices for all menu items using a specific recipe.
 * Called when recipe ingredients or yield change.
 * Skips invalidation for locked menus and tracks changes instead.
 *
 * @param {string} recipeId - Recipe ID
 * @param {string} recipeName - Recipe name (for change tracking)
 * @param {string} changeType - Type of change (for tracking)
 * @param {any} changeDetails - Change details (for tracking)
 * @param {string} changedBy - User email (for tracking)
 * @returns {Promise<void>} Resolves when invalidation completes
 */
export async function invalidateMenuItemsWithRecipe(
  recipeId: string,
  recipeName?: string,
  changeType: string = 'ingredients_changed',
  changeDetails: any = {},
  changedBy: string | null = null,
): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Menu Pricing Cache] Supabase admin client not available');
    return;
  }

  try {
    // Find all menu items using this recipe
    const { data: menuItems, error: fetchError } = await supabaseAdmin
      .from('menu_items')
      .select('id, menu_id')
      .eq('recipe_id', recipeId);

    if (fetchError) {
      logger.error('[Menu Pricing Cache] Failed to fetch menu items with recipe:', {
        recipeId,
        error: fetchError.message,
      });
      return;
    }

    if (!menuItems || menuItems.length === 0) {
      return;
    }

    // Group menu items by menu_id and check which menus are locked
    const menuIds = [...new Set(menuItems.map(item => item.menu_id))];
    const lockedMenuIds = new Set<string>();
    const unlockedMenuIds = new Set<string>();

    // Check lock status for each menu
    await Promise.all(
      menuIds.map(async menuId => {
        const locked = await isMenuLocked(menuId);
        if (locked) {
          lockedMenuIds.add(menuId);
        } else {
          unlockedMenuIds.add(menuId);
        }
      }),
    );

    // Track changes for locked menus
    if (lockedMenuIds.size > 0 && recipeName) {
      await trackChangeForLockedMenus(
        'recipe',
        recipeId,
        recipeName,
        changeType as any,
        changeDetails,
        changedBy,
      );
    }

    // Only invalidate prices for unlocked menus
    const unlockedMenuItemIds = menuItems
      .filter(item => unlockedMenuIds.has(item.menu_id))
      .map(item => item.id);

    if (unlockedMenuItemIds.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('menu_items')
        .update({ recommended_selling_price: null })
        .in('id', unlockedMenuItemIds);

      if (updateError) {
        logger.error('[Menu Pricing Cache] Failed to invalidate menu items with recipe:', {
          recipeId,
          menuItemIds: unlockedMenuItemIds,
          error: updateError.message,
        });
      } else {
        logger.dev(
          `[Menu Pricing Cache] Invalidated recommended prices for ${unlockedMenuItemIds.length} menu items using recipe ${recipeId} (${lockedMenuIds.size} locked menus skipped)`,
        );
      }
    } else if (lockedMenuIds.size > 0) {
      logger.dev(
        `[Menu Pricing Cache] Skipped price invalidation for recipe ${recipeId} (all ${lockedMenuIds.size} menus are locked, changes tracked)`,
      );
    }
  } catch (err) {
    logger.error('[Menu Pricing Cache] Error invalidating menu items with recipe:', err);
  }
}

/**
 * Invalidate cached recommended prices for all menu items using a specific dish.
 * Called when dish ingredients or recipes change.
 * Skips invalidation for locked menus and tracks changes instead.
 *
 * @param {string} dishId - Dish ID
 * @param {string} dishName - Dish name (for change tracking)
 * @param {string} changeType - Type of change (for tracking)
 * @param {any} changeDetails - Change details (for tracking)
 * @param {string} changedBy - User email (for tracking)
 * @returns {Promise<void>} Resolves when invalidation completes
 */
export async function invalidateMenuItemsWithDish(
  dishId: string,
  dishName?: string,
  changeType: string = 'ingredients_changed',
  changeDetails: any = {},
  changedBy: string | null = null,
): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Menu Pricing Cache] Supabase admin client not available');
    return;
  }

  try {
    // Find all menu items using this dish
    const { data: menuItems, error: fetchError } = await supabaseAdmin
      .from('menu_items')
      .select('id, menu_id')
      .eq('dish_id', dishId);

    if (fetchError) {
      logger.error('[Menu Pricing Cache] Failed to fetch menu items with dish:', {
        dishId,
        error: fetchError.message,
      });
      return;
    }

    if (!menuItems || menuItems.length === 0) {
      return;
    }

    // Group menu items by menu_id and check which menus are locked
    const menuIds = [...new Set(menuItems.map(item => item.menu_id))];
    const lockedMenuIds = new Set<string>();
    const unlockedMenuIds = new Set<string>();

    // Check lock status for each menu
    await Promise.all(
      menuIds.map(async menuId => {
        const locked = await isMenuLocked(menuId);
        if (locked) {
          lockedMenuIds.add(menuId);
        } else {
          unlockedMenuIds.add(menuId);
        }
      }),
    );

    // Track changes for locked menus
    if (lockedMenuIds.size > 0 && dishName) {
      await trackChangeForLockedMenus(
        'dish',
        dishId,
        dishName,
        changeType as any,
        changeDetails,
        changedBy,
      );
    }

    // Only invalidate prices for unlocked menus
    const unlockedMenuItemIds = menuItems
      .filter(item => unlockedMenuIds.has(item.menu_id))
      .map(item => item.id);

    if (unlockedMenuItemIds.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('menu_items')
        .update({ recommended_selling_price: null })
        .in('id', unlockedMenuItemIds);

      if (updateError) {
        logger.error('[Menu Pricing Cache] Failed to invalidate menu items with dish:', {
          dishId,
          menuItemIds: unlockedMenuItemIds,
          error: updateError.message,
        });
      } else {
        logger.dev(
          `[Menu Pricing Cache] Invalidated recommended prices for ${unlockedMenuItemIds.length} menu items using dish ${dishId} (${lockedMenuIds.size} locked menus skipped)`,
        );
      }
    } else if (lockedMenuIds.size > 0) {
      logger.dev(
        `[Menu Pricing Cache] Skipped price invalidation for dish ${dishId} (all ${lockedMenuIds.size} menus are locked, changes tracked)`,
      );
    }
  } catch (err) {
    logger.error('[Menu Pricing Cache] Error invalidating menu items with dish:', err);
  }
}

/**
 * Invalidate cached recommended prices for all menu items using recipes/dishes that contain a specific ingredient.
 * Called when ingredient costs change.
 * Skips invalidation for locked menus and tracks changes instead.
 *
 * @param {string} ingredientId - Ingredient ID
 * @param {string} ingredientName - Ingredient name (for change tracking)
 * @param {any} changeDetails - Change details (for tracking)
 * @param {string} changedBy - User email (for tracking)
 * @returns {Promise<void>} Resolves when invalidation completes
 */
export async function invalidateMenuItemsWithIngredient(
  ingredientId: string,
  ingredientName?: string,
  changeDetails: any = {},
  changedBy: string | null = null,
): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Menu Pricing Cache] Supabase admin client not available');
    return;
  }

  try {
    // Find all recipes using this ingredient
    const { data: recipeIngredients, error: recipeError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id')
      .eq('ingredient_id', ingredientId);

    if (recipeError) {
      logger.error('[Menu Pricing Cache] Failed to fetch recipes with ingredient:', {
        ingredientId,
        error: recipeError.message,
      });
    }

    // Find all dishes using this ingredient directly
    const dishIngredientsQuery = supabaseAdmin
      .from('dish_ingredients')
      .select('dish_id')
      .eq('ingredient_id', ingredientId);

    // Wrap in Promise.resolve to handle PromiseLike
    let dishIngredients: any = null;
    let dishError: any = null;
    try {
      const result = await Promise.resolve(dishIngredientsQuery);
      dishIngredients = result.data;
      dishError = result.error;
    } catch {
      dishIngredients = null;
      dishError = null;
    }

    if (dishError && dishError.code !== '42P01') {
      // Ignore table doesn't exist error
      logger.error('[Menu Pricing Cache] Failed to fetch dishes with ingredient:', {
        ingredientId,
        error: dishError.message,
      });
    }

    const recipeIds = recipeIngredients
      ? [...new Set(recipeIngredients.map(ri => ri.recipe_id))]
      : [];
    const dishIds = dishIngredients
      ? [...new Set(dishIngredients.map((di: any) => di.dish_id))]
      : [];

    // Find menu items using these recipes or dishes
    const menuItemQueries: Promise<any>[] = [];

    if (recipeIds.length > 0) {
      menuItemQueries.push(
        Promise.resolve(
          supabaseAdmin.from('menu_items').select('id, menu_id').in('recipe_id', recipeIds),
        ).then(({ data }) => data || []),
      );
    }

    if (dishIds.length > 0) {
      menuItemQueries.push(
        Promise.resolve(
          supabaseAdmin.from('menu_items').select('id, menu_id').in('dish_id', dishIds),
        ).then(({ data }) => data || []),
      );
    }

    const menuItemResults = await Promise.all(menuItemQueries);
    const allMenuItems = menuItemResults.flat();

    if (allMenuItems.length === 0) {
      return;
    }

    // Group menu items by menu_id and check which menus are locked
    const menuIds = [...new Set(allMenuItems.map((item: any) => item.menu_id))];
    const lockedMenuIds = new Set<string>();
    const unlockedMenuIds = new Set<string>();

    // Check lock status for each menu
    await Promise.all(
      menuIds.map(async menuId => {
        const locked = await isMenuLocked(menuId);
        if (locked) {
          lockedMenuIds.add(menuId);
        } else {
          unlockedMenuIds.add(menuId);
        }
      }),
    );

    // Track changes for locked menus
    if (lockedMenuIds.size > 0 && ingredientName) {
      await trackChangeForLockedMenus(
        'ingredient',
        ingredientId,
        ingredientName,
        'cost_changed',
        changeDetails,
        changedBy,
      );
    }

    // Only invalidate prices for unlocked menus
    const unlockedMenuItemIds = allMenuItems
      .filter((item: any) => unlockedMenuIds.has(item.menu_id))
      .map((item: any) => item.id);

    if (unlockedMenuItemIds.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('menu_items')
        .update({ recommended_selling_price: null })
        .in('id', unlockedMenuItemIds);

      if (updateError) {
        logger.error('[Menu Pricing Cache] Failed to invalidate menu items with ingredient:', {
          ingredientId,
          menuItemIds: unlockedMenuItemIds,
          error: updateError.message,
        });
      } else {
        logger.dev(
          `[Menu Pricing Cache] Invalidated recommended prices for ${unlockedMenuItemIds.length} menu items using ingredient ${ingredientId} (${lockedMenuIds.size} locked menus skipped)`,
        );
      }
    } else if (lockedMenuIds.size > 0) {
      logger.dev(
        `[Menu Pricing Cache] Skipped price invalidation for ingredient ${ingredientId} (all ${lockedMenuIds.size} menus are locked, changes tracked)`,
      );
    }
  } catch (err) {
    logger.error('[Menu Pricing Cache] Error invalidating menu items with ingredient:', err);
  }
}

/**
 * Invalidate cached recommended prices for all menu items in a specific menu.
 * Useful for bulk refresh operations.
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<void>} Resolves when invalidation completes
 */
export async function invalidateMenuRecommendedPrices(menuId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Menu Pricing Cache] Supabase admin client not available');
    return;
  }

  try {
    const { error: updateError } = await supabaseAdmin
      .from('menu_items')
      .update({ recommended_selling_price: null })
      .eq('menu_id', menuId);

    if (updateError) {
      logger.error('[Menu Pricing Cache] Failed to invalidate menu recommended prices:', {
        menuId,
        error: updateError.message,
      });
    } else {
      logger.dev(`[Menu Pricing Cache] Invalidated recommended prices for menu ${menuId}`);
    }
  } catch (err) {
    logger.error('[Menu Pricing Cache] Error invalidating menu recommended prices:', err);
  }
}
