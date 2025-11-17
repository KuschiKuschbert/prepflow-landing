import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateRecipeSellingPrice } from '../../[id]/statistics/helpers/calculateRecipeSellingPrice';
import { calculateDishSellingPrice } from '../../[id]/statistics/helpers/calculateDishSellingPrice';

/**
 * Fetch menu with items.
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<Object>} Menu with items
 * @throws {Error} If menu not found
 */
export async function fetchMenuWithItems(menuId: string) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  // Fetch menu
  const { data: menu, error: menuError } = await supabaseAdmin
    .from('menus')
    .select('*')
    .eq('id', menuId)
    .single();

  if (menuError || !menu) {
    logger.error('[Menus API] Menu not found:', {
      error: menuError?.message,
      code: (menuError as any)?.code,
      context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
    });
    throw ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404, {
      message: 'The requested menu could not be found',
    });
  }

  // Fetch menu items with dishes and recipes
  // Try to fetch with pricing columns, fallback to basic columns if they don't exist
  let menuItems: any[] | null = null;
  let itemsError: any = null;

  // First try with pricing columns
  const { data: itemsWithPricing, error: pricingError } = await supabaseAdmin
    .from('menu_items')
    .select(
      `
      id,
      dish_id,
      recipe_id,
      category,
      position,
      actual_selling_price,
      recommended_selling_price,
      dishes (
        id,
        dish_name,
        description,
        selling_price
      ),
      recipes (
        id,
        name,
        description,
        yield,
        selling_price
      )
    `,
    )
    .eq('menu_id', menuId)
    .order('category')
    .order('position');

  // Check if error is due to missing columns
  const errorMessage = pricingError?.message || '';
  const isMissingColumnError =
    errorMessage.includes('column') &&
    (errorMessage.includes('actual_selling_price') ||
      errorMessage.includes('recommended_selling_price') ||
      errorMessage.includes('does not exist'));

  if (pricingError && isMissingColumnError) {
    // Fallback: fetch without pricing columns
    logger.warn('[Menus API] Pricing columns not found, fetching without them:', {
      error: errorMessage,
      context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
    });

    const { data: itemsBasic, error: basicError } = await supabaseAdmin
      .from('menu_items')
      .select(
        `
        id,
        dish_id,
        recipe_id,
        category,
        position,
        dishes (
          id,
          dish_name,
          description,
          selling_price
        ),
        recipes (
          id,
          name,
          description,
          yield,
          selling_price
        )
      `,
      )
      .eq('menu_id', menuId)
      .order('category')
      .order('position');

    if (basicError) {
      logger.error('[Menus API] Database error fetching menu items:', {
        error: basicError.message,
        code: (basicError as any).code,
        context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
      });
      throw ApiErrorHandler.fromSupabaseError(basicError, 500);
    }

    menuItems = itemsBasic;
  } else if (pricingError) {
    logger.error('[Menus API] Database error fetching menu items:', {
      error: itemsError?.message || pricingError.message,
      code: (pricingError as any).code,
      context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
    });
    throw ApiErrorHandler.fromSupabaseError(pricingError, 500);
  } else {
    menuItems = itemsWithPricing;
  }

  // Calculate recommended prices for items that don't have them
  // Only calculate if pricing columns exist (itemsWithPricing was successful)
  const itemsWithRecommendedPrices = await Promise.all(
    (menuItems || []).map(async (item: any) => {
      // If pricing columns exist and recommended_selling_price already exists, use it
      if (item.recommended_selling_price != null) {
        return item;
      }

      let recommendedPrice: number | null = null;

      // For dishes, calculate recommended price dynamically
      if (item.dish_id && item.dishes) {
        try {
          recommendedPrice = await calculateDishSellingPrice(item.dishes.id);
        } catch (err) {
          logger.error('[Menus API] Error calculating dish selling price:', err);
          recommendedPrice = null;
        }
      }
      // For recipes, calculate recommended price per serving
      else if (item.recipe_id) {
        try {
          const fullRecipePrice = await calculateRecipeSellingPrice(item.recipe_id);
          // Divide by recipe yield to get per-serving price (matching frontend calculateRecipePrice logic)
          const recipeYield = item.recipes?.yield || 1;
          recommendedPrice = recipeYield > 0 ? fullRecipePrice / recipeYield : fullRecipePrice;
        } catch (err) {
          logger.error('[Menus API] Error calculating recipe selling price:', err);
          recommendedPrice = null;
        }
      }

      // Only add pricing fields if pricing columns exist (itemsWithPricing was successful)
      // If we had a missing column error, we fetched without pricing columns, so don't add them
      if (!pricingError) {
        return {
          ...item,
          recommended_selling_price: recommendedPrice,
        };
      }

      // Return item as-is if pricing columns don't exist (fallback case)
      return item;
    }),
  );

  return {
    ...menu,
    items: itemsWithRecommendedPrices,
  };
}
