import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { calculateDishCost } from '../../../statistics/helpers/calculateDishCost';
import { calculateRecipeCost } from '../../../statistics/helpers/calculateRecipeCost';
import { cacheRecommendedPrice } from '../helpers/cacheRecommendedPrice';

/**
 * GET /api/menus/[id]/items/[itemId]/statistics
 * Get statistics for a menu item (cost, profit margin, etc.)
 *
 * @param {NextRequest} _req - Request object (unused)
 * @param {Object} context - Route context
 * @param {Promise<{id: string, itemId: string}>} context.params - Route parameters
 * @returns {Promise<NextResponse>} Menu item statistics
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string; itemId: string }> },
) {
  // Early logging to confirm route is being called
  logger.dev('[Menu Item Statistics API] Route handler called', {
    path: req.nextUrl.pathname,
    method: req.method,
    url: req.url,
  });

  try {
    const params = await context.params;
    const menuId = params?.id;
    const menuItemId = params?.itemId;

    logger.dev('[Menu Item Statistics API] GET request received', {
      menuId,
      menuItemId,
      params,
      pathname: req.nextUrl.pathname,
    });

    if (!menuId || !menuItemId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing menu id or item id',
          message: 'Both menu id and item id are required',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection not available',
          message: 'Database connection could not be established',
        },
        { status: 500 },
      );
    }

    // Fetch menu item with dish/recipe details
    const { data: menuItem, error: itemError } = await supabaseAdmin
      .from('menu_items')
      .select(
        `
        id,
        dish_id,
        recipe_id,
        actual_selling_price,
        recommended_selling_price,
        dishes (
          id,
          dish_name,
          selling_price
        ),
        recipes (
          id,
          name,
          yield
        )
      `,
      )
      .eq('id', menuItemId)
      .eq('menu_id', menuId)
      .single();

    if (itemError || !menuItem) {
      logger.error('Error fetching menu item:', itemError);
      return NextResponse.json(
        {
          success: false,
          error: itemError?.message || 'Menu item not found',
          message: 'Failed to fetch menu item',
        },
        { status: 404 },
      );
    }

    // Calculate COGS (per serving for recipes)
    let cogs = 0;
    let cogsError: string | null = null;
    const dish = Array.isArray(menuItem.dishes) ? menuItem.dishes[0] : menuItem.dishes;
    const recipe = Array.isArray(menuItem.recipes) ? menuItem.recipes[0] : menuItem.recipes;

    try {
      if (menuItem.dish_id && dish) {
        cogs = await calculateDishCost(dish.id);
        logger.dev('[Menu Item Statistics API] Dish COGS calculated', {
          dishId: dish.id,
          cogs,
        });
      } else if (menuItem.recipe_id) {
        const fullRecipeCost = await calculateRecipeCost(menuItem.recipe_id, 1);
        // Divide by recipe yield to get per-serving COGS (matching per-serving price calculation)
        const recipeYield = recipe?.yield || 1;
        cogs = recipeYield > 0 ? fullRecipeCost / recipeYield : fullRecipeCost;
        logger.dev('[Menu Item Statistics API] Recipe COGS calculated', {
          recipeId: menuItem.recipe_id,
          fullRecipeCost,
          recipeYield,
          cogs,
        });
      } else {
        cogsError = 'No dish_id or recipe_id found on menu item';
        logger.warn('[Menu Item Statistics API] Cannot calculate COGS:', {
          menuItemId,
          dish_id: menuItem.dish_id,
          recipe_id: menuItem.recipe_id,
        });
      }

      // Validate COGS calculation
      if (cogs === 0 && !cogsError) {
        cogsError = 'COGS calculation returned 0 - may indicate missing ingredients or cost data';
        logger.warn('[Menu Item Statistics API] COGS is 0:', {
          menuItemId,
          dish_id: menuItem.dish_id,
          recipe_id: menuItem.recipe_id,
        });
      }
    } catch (err) {
      cogsError = err instanceof Error ? err.message : 'Unknown error calculating COGS';
      logger.error('[Menu Item Statistics API] Error calculating COGS:', {
        menuItemId,
        dish_id: menuItem.dish_id,
        recipe_id: menuItem.recipe_id,
        error: err,
      });
      // Don't throw - return partial statistics with error message
    }

    // Calculate recommended selling price (always calculate for display)
    // Priority: cached recommended > dish.selling_price > calculated recommended
    let recommendedPrice: number | null = menuItem.recommended_selling_price;

    if (recommendedPrice == null) {
      // Try dish selling_price first (if it's a dish)
      if (menuItem.dish_id && dish?.selling_price) {
        recommendedPrice = parseFloat(String(dish.selling_price));
      } else {
        // Calculate dynamically based on COGS and target margin
        if (menuItem.dish_id && dish) {
          const { calculateDishSellingPrice } = await import(
            '../../../statistics/helpers/calculateDishSellingPrice'
          );
          recommendedPrice = await calculateDishSellingPrice(dish.id);
        } else if (menuItem.recipe_id) {
          const { calculateRecipeSellingPrice } = await import(
            '../../../statistics/helpers/calculateRecipeSellingPrice'
          );
          const fullRecipePrice = await calculateRecipeSellingPrice(menuItem.recipe_id);
          const recipeYield = recipe?.yield || 1;
          recommendedPrice = recipeYield > 0 ? fullRecipePrice / recipeYield : fullRecipePrice;
        }
      }

      // Cache the calculated price for future use (non-blocking)
      if (recommendedPrice != null && recommendedPrice > 0) {
        // Extract recipe yield from array if present
        const recipeYield =
          Array.isArray(menuItem.recipes) && menuItem.recipes.length > 0
            ? (menuItem.recipes[0] as any)?.yield
            : recipe?.yield;
        const menuItemForCache = {
          ...menuItem,
          recipes: recipeYield ? { yield: recipeYield } : undefined,
        };
        cacheRecommendedPrice(menuId, menuItemId, menuItemForCache).catch(err => {
          logger.error('[Menu Item Statistics API] Failed to cache recommended price:', err);
        });
      }
    }

    // Determine actual selling price to use for calculations
    // Priority: menu_items.actual_selling_price > recommended_price
    const actualPrice = menuItem.actual_selling_price;
    const sellingPrice = actualPrice != null ? actualPrice : (recommendedPrice ?? 0);

    // Calculate statistics
    const grossProfit = sellingPrice - cogs;
    const grossProfitMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
    const foodCostPercent = sellingPrice > 0 ? (cogs / sellingPrice) * 100 : 0;

    return NextResponse.json({
      success: true,
      statistics: {
        cogs,
        recommended_selling_price: recommendedPrice,
        actual_selling_price: menuItem.actual_selling_price,
        selling_price: sellingPrice,
        gross_profit: grossProfit,
        gross_profit_margin: grossProfitMargin,
        food_cost_percent: foodCostPercent,
      },
      // Include error information if COGS calculation had issues
      ...(cogsError && { cogs_error: cogsError }),
    });
  } catch (err) {
    logger.error('Unexpected error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
