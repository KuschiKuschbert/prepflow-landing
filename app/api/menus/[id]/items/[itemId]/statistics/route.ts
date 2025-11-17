import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { calculateDishCost } from '../../../statistics/helpers/calculateDishCost';
import { calculateRecipeCost } from '../../../statistics/helpers/calculateRecipeCost';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const { id, itemId } = await context.params;
    const menuId = id;
    const menuItemId = itemId;

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
          recipe_name,
          yield,
          selling_price
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
    if (menuItem.dish_id && menuItem.dishes) {
      cogs = await calculateDishCost(menuItem.dishes.id);
    } else if (menuItem.recipe_id) {
      const fullRecipeCost = await calculateRecipeCost(menuItem.recipe_id, 1);
      // Divide by recipe yield to get per-serving COGS (matching per-serving price calculation)
      const recipeYield = menuItem.recipes?.yield || 1;
      cogs = recipeYield > 0 ? fullRecipeCost / recipeYield : fullRecipeCost;
    }

    // Determine selling price (priority: actual > dish/recipe.selling_price > recommended)
    let sellingPrice = 0;
    if (menuItem.actual_selling_price != null) {
      sellingPrice = menuItem.actual_selling_price;
    } else if (menuItem.dish_id && menuItem.dishes?.selling_price) {
      sellingPrice = parseFloat(menuItem.dishes.selling_price);
    } else if (menuItem.recipe_id && menuItem.recipes?.selling_price) {
      // For recipes, selling_price is already per serving
      sellingPrice = parseFloat(menuItem.recipes.selling_price);
    } else if (menuItem.recommended_selling_price != null) {
      sellingPrice = menuItem.recommended_selling_price;
    }

    // Calculate statistics
    const grossProfit = sellingPrice - cogs;
    const grossProfitMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
    const foodCostPercent = sellingPrice > 0 ? (cogs / sellingPrice) * 100 : 0;

    // Calculate recommended price if not already set
    let recommendedPrice = menuItem.recommended_selling_price;
    if (recommendedPrice == null) {
      // Calculate dynamically if not cached
      if (menuItem.dish_id && menuItem.dishes) {
        const { calculateDishSellingPrice } = await import(
          '../../../statistics/helpers/calculateDishSellingPrice'
        );
        recommendedPrice = await calculateDishSellingPrice(menuItem.dishes.id);
      } else if (menuItem.recipe_id) {
        const { calculateRecipeSellingPrice } = await import(
          '../../../statistics/helpers/calculateRecipeSellingPrice'
        );
        const fullRecipePrice = await calculateRecipeSellingPrice(menuItem.recipe_id);
        const recipeYield = menuItem.recipes?.yield || 1;
        recommendedPrice = recipeYield > 0 ? fullRecipePrice / recipeYield : fullRecipePrice;
      }
    }

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
