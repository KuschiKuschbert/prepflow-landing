import { NextRequest, NextResponse } from 'next/server';
import { fetchMenuWithItems } from '../helpers/fetchMenuWithItems';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { collectIngredientIds } from './helpers/collectIngredientIds';
import { fetchIngredientsWithParLevels } from './helpers/fetchIngredientsWithParLevels';
import { groupIngredients } from './helpers/groupIngredients';

/**
 * GET /api/menus/[id]/ingredients
 * Get all ingredients used in menu items, grouped by storage location
 *
 * @param {NextRequest} request - Request object
 * @param {Object} context - Route context
 * @param {Promise<{id: string}>} context.params - Route parameters
 * @param {string} [request.url.searchParams.sortBy] - Sort option ('storage' | 'name' | 'cost')
 * @returns {Promise<NextResponse>} Ingredients grouped by storage location
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Get sort option from query params
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'storage';

    // Fetch menu with items
    const menu = await fetchMenuWithItems(menuId);

    if (!menu.items || menu.items.length === 0) {
      return NextResponse.json({
        success: true,
        menuName: menu.menu_name,
        ingredients: [],
        groupedIngredients: {},
      });
    }

    // Collect all dish IDs and recipe IDs
    const dishIds = new Set<string>();
    const recipeIds = new Set<string>();

    for (const menuItem of menu.items) {
      if (menuItem.dish_id) {
        dishIds.add(menuItem.dish_id);
      }
      if (menuItem.recipe_id) {
        recipeIds.add(menuItem.recipe_id);
      }
    }

    // Collect all ingredient IDs
    const ingredientIds = await collectIngredientIds(dishIds, recipeIds, menuId);

    if (ingredientIds.size === 0) {
      return NextResponse.json({
        success: true,
        menuName: menu.menu_name,
        ingredients: [],
        groupedIngredients: {},
      });
    }

    // Fetch ingredients with par levels
    const ingredientsWithParLevels = await fetchIngredientsWithParLevels(ingredientIds, menuId);

    // Group ingredients by sort option
    const groupedIngredients = groupIngredients(ingredientsWithParLevels, sortBy);

    return NextResponse.json({
      success: true,
      menuName: menu.menu_name,
      menuId: menu.id,
      ingredients: ingredientsWithParLevels,
      groupedIngredients,
      sortBy,
    });
  } catch (err: any) {
    logger.error('[Menu Ingredients API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch menu ingredients', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}
