/**
 * API endpoint for exporting combined menu display and allergen matrix
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { fetchMenuWithItems } from '../../helpers/fetchMenuWithItems';
import { generateCombinedHTML } from './helpers/generateCombinedHTML';
import { generateCombinedCSV } from './helpers/generateCombinedCSV';
import type { MenuItem } from '@/app/webapp/menu-builder/types';
import { aggregateRecipeDietaryStatus } from '@/lib/dietary/dietary-aggregation';
import { aggregateDishDietaryStatus } from '@/lib/dietary/dietary-aggregation';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuId } = await context.params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'html';
    const include = searchParams.get('include') || 'menu,matrix'; // Default to menu + matrix

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!['html', 'csv', 'pdf'].includes(format)) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Invalid format. Must be html, csv, or pdf',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Parse include parameter
    const includeParts = include.split(',').map(s => s.trim());
    const includeMenu = include === 'all' || includeParts.includes('menu');
    const includeMatrix = include === 'all' || includeParts.includes('matrix');
    const includeRecipes = include === 'all' || includeParts.includes('recipes');

    // Fetch menu with items
    const menu = await fetchMenuWithItems(menuId);

    if (!menu) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Ensure fresh dietary data by triggering recalculation for all recipes/dishes
    const dietaryRecalculations = (menu.items || []).map(async (item: MenuItem) => {
      try {
        if (item.recipe_id) {
          await aggregateRecipeDietaryStatus(item.recipe_id, false, true);
        } else if (item.dish_id) {
          await aggregateDishDietaryStatus(item.dish_id, false, true);
        }
      } catch (err) {
        logger.warn('[Combined Export] Failed to recalculate dietary status:', {
          itemId: item.recipe_id || item.dish_id,
          type: item.recipe_id ? 'recipe' : 'dish',
          error: err instanceof Error ? err.message : String(err),
        });
      }
    });

    await Promise.all(dietaryRecalculations);

    // Re-fetch menu with items to get updated dietary status
    const menuWithFreshData = await fetchMenuWithItems(menuId);

    if (!menuWithFreshData) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Transform menu items to display data (only if needed)
    const menuData = includeMenu
      ? (menuWithFreshData.items || []).map((item: MenuItem) => {
          const isDish = !!item.dish_id;
          const itemName = isDish
            ? item.dishes?.dish_name || 'Unknown Dish'
            : item.recipes?.recipe_name || 'Unknown Recipe';

          const description = isDish ? item.dishes?.description : item.recipes?.description;

          const price =
            item.actual_selling_price ||
            (isDish ? item.dishes?.selling_price : item.recommended_selling_price) ||
            0;

          return {
            name: itemName,
            description: description || undefined,
            price,
            category: item.category || 'Uncategorized',
          };
        })
      : [];

    // Transform menu items to allergen matrix data (only if needed)
    const matrixData = includeMatrix
      ? (menuWithFreshData.items || []).map((item: MenuItem) => {
          let allergens: string[] = [];
          if (item.allergens && Array.isArray(item.allergens)) {
            allergens = item.allergens;
          } else if (
            item.dish_id &&
            item.dishes?.allergens &&
            Array.isArray(item.dishes.allergens)
          ) {
            allergens = item.dishes.allergens;
          } else if (
            item.recipe_id &&
            item.recipes?.allergens &&
            Array.isArray(item.recipes.allergens)
          ) {
            allergens = item.recipes.allergens;
          }
          const validAllergenCodes = AUSTRALIAN_ALLERGENS.map(a => a.code);
          allergens = consolidateAllergens(allergens).filter(code =>
            validAllergenCodes.includes(code),
          );
          const isVegetarian =
            item.is_vegetarian ??
            (item.dish_id ? item.dishes?.is_vegetarian : item.recipes?.is_vegetarian);
          const isVegan =
            item.is_vegan ?? (item.dish_id ? item.dishes?.is_vegan : item.recipes?.is_vegan);
          return {
            name: item.dish_id ? item.dishes?.dish_name : item.recipes?.recipe_name || 'Unknown',
            type: item.dish_id ? 'Dish' : 'Recipe',
            allergens,
            isVegetarian: isVegetarian === true,
            isVegan: isVegan === true,
            category: item.category || 'Uncategorized',
          };
        })
      : [];

    // Fetch recipe cards (only if needed)
    let recipeCardsData: any[] = [];
    if (includeRecipes) {
      const supabase = createSupabaseAdmin();
      const { data: cards } = await supabase
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
            category,
            position
          )
        `,
        )
        .eq('menu_items.menu_id', menuId);

      if (cards) {
        const { data: menuItems } = await supabase
          .from('menu_items')
          .select('id, category, position')
          .eq('menu_id', menuId)
          .order('category', { ascending: true })
          .order('position', { ascending: true });

        const itemOrderMap = new Map<string, { category: string; position: number }>();
        if (menuItems) {
          menuItems.forEach((item: any) => {
            itemOrderMap.set(item.id, {
              category: item.category || '',
              position: item.position || 0,
            });
          });
        }

        recipeCardsData = cards
          .map((card: any) => ({
            id: card.id,
            title: card.title || 'Unknown Recipe',
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
            position: itemOrderMap.get(card.menu_item_id)?.position || 999,
          }))
          .sort((a, b) => {
            const categoryCompare = a.category.localeCompare(b.category);
            if (categoryCompare !== 0) return categoryCompare;
            return a.position - b.position;
          });
      }
    }

    // Generate export based on format
    if (format === 'csv') {
      return generateCombinedCSV(
        menuWithFreshData.menu_name,
        menuData,
        matrixData,
        recipeCardsData,
        includeMenu,
        includeMatrix,
        includeRecipes,
      );
    }
    if (format === 'pdf') {
      return generateCombinedHTML(
        menuWithFreshData.menu_name,
        menuData,
        matrixData,
        recipeCardsData,
        includeMenu,
        includeMatrix,
        includeRecipes,
        true,
      );
    }
    return generateCombinedHTML(
      menuWithFreshData.menu_name,
      menuData,
      matrixData,
      recipeCardsData,
      includeMenu,
      includeMatrix,
      includeRecipes,
      false,
    );
  } catch (err) {
    logger.error('[Combined Export API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
