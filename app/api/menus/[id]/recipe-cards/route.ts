/**
 * Recipe Cards API Endpoint
 * GET /api/menus/[id]/recipe-cards - Fetch recipe cards for a menu
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuId } = await context.params;
    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdmin();

    // Fetch menu items for this menu to get ordering
    const { data: menuItems, error: itemsError } = await supabase
      .from('menu_items')
      .select('id, category, position, dish_id, recipe_id')
      .eq('menu_id', menuId)
      .order('category', { ascending: true })
      .order('position', { ascending: true });

    if (itemsError) {
      logger.error('Failed to fetch menu items:', itemsError);
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Failed to fetch menu items',
          'DATABASE_ERROR',
          500,
          itemsError.message,
        ),
        { status: 500 },
      );
    }

    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json({
        success: true,
        cards: [],
      });
    }

    const menuItemIds = menuItems.map(item => item.id);

    // Create a map for ordering
    const itemOrderMap = new Map<string, { category: string; position: number }>();
    menuItems.forEach((item: any) => {
      itemOrderMap.set(item.id, {
        category: item.category || '',
        position: item.position || 0,
      });
    });

    // Try to fetch recipe cards via junction table (cross-referencing)
    // Fall back to old method if migration hasn't been run yet
    let links: any[] | null = null;
    let useOldMethod = false;

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
        useOldMethod = true;
      } else {
        logger.error('Failed to fetch recipe card links:', linksError);
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Failed to fetch recipe cards',
            'DATABASE_ERROR',
            500,
            errorMessage,
          ),
          { status: 500 },
        );
      }
    } else {
      links = linksData;
    }

    // Group menu items by card (one card can have multiple menu items)
    const cardMap = new Map<
      string,
      {
        card: any;
        menuItemIds: string[];
        menuItemNames: string[];
      }
    >();

    // Also fetch menu item names for display
    const { data: menuItemsWithNames } = await supabase
      .from('menu_items')
      .select(
        `
        id,
        dish_id,
        recipe_id,
        dishes (
          dish_name
        ),
        recipes (
          name,
          recipe_name
        )
      `,
      )
      .in('id', menuItemIds);

    const menuItemNameMap = new Map<string, string>();
    if (menuItemsWithNames) {
      menuItemsWithNames.forEach((item: any) => {
        const recipeName = item.recipes?.recipe_name || item.recipes?.name || null;
        const name = item.dishes?.dish_name || recipeName || 'Unknown Item';
        menuItemNameMap.set(item.id, name);
      });
    }

    if (useOldMethod) {
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
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Failed to fetch recipe cards',
            'DATABASE_ERROR',
            500,
            cardsError.message,
          ),
          { status: 500 },
        );
      }

      // Process cards using old method (one card per menu item)
      if (cards) {
        for (const card of cards) {
          const cardId = card.id;
          const menuItemId = card.menu_item_id;
          const menuItemName = menuItemNameMap.get(menuItemId) || 'Unknown Item';

          if (!cardMap.has(cardId)) {
            cardMap.set(cardId, {
              card: {
                ...card,
                recipe_id: null,
                dish_id: null,
                recipe_signature: null,
              },
              menuItemIds: [],
              menuItemNames: [],
            });
          }

          const cardData = cardMap.get(cardId)!;
          cardData.menuItemIds.push(menuItemId);
          cardData.menuItemNames.push(menuItemName);
        }
      }
    } else {
      // Process links and group by card (new cross-referencing method)
      if (links) {
        for (const link of links) {
          const card = link.menu_recipe_cards;
          if (!card) continue;

          const cardId = card.id;
          const menuItemId = link.menu_item_id;
          const menuItemName = menuItemNameMap.get(menuItemId) || 'Unknown Item';

          if (!cardMap.has(cardId)) {
            cardMap.set(cardId, {
              card,
              menuItemIds: [],
              menuItemNames: [],
            });
          }

          const cardData = cardMap.get(cardId)!;
          cardData.menuItemIds.push(menuItemId);
          cardData.menuItemNames.push(menuItemName);
        }
      }
    }

    // Separate main cards from sub-recipe cards
    const mainCards: any[] = [];
    const subRecipeCards: any[] = [];

    // Transform cards for response
    Array.from(cardMap.values()).forEach(({ card, menuItemIds, menuItemNames }) => {
      // Use first menu item for ordering (cards appear once per unique recipe)
      const firstMenuItemId = menuItemIds[0];
      const firstMenuItemName = menuItemNames[0];

      const transformedCard = {
        id: card.id,
        menuItemId: firstMenuItemId, // Keep for backward compatibility
        menuItemIds, // New: all menu items using this card
        menuItemName: firstMenuItemName, // Keep for backward compatibility
        menuItemNames, // New: all menu item names
        title: card.title || firstMenuItemName,
        baseYield: card.base_yield || 1,
        ingredients: card.ingredients || [],
        methodSteps: card.method_steps || [],
        notes: card.notes
          ? typeof card.notes === 'string'
            ? card.notes.split('\n').filter((n: string) => n.trim().length > 0)
            : Array.isArray(card.notes)
              ? card.notes
              : []
          : [],
        parsedAt: card.parsed_at,
        recipeId: card.recipe_id || null,
        dishId: card.dish_id || null,
        recipeSignature: card.recipe_signature || null,
        _order: itemOrderMap.get(firstMenuItemId) || { category: '', position: 999 },
      };

      // Check if this is a sub-recipe card (recipe_id set, dish_id null)
      const isSubRecipe = card.recipe_id && !card.dish_id;

      if (isSubRecipe) {
        // Extract sub-recipe metadata from card_content
        const cardContent = card.card_content || {};
        const subRecipeType = cardContent.sub_recipe_type || 'other';
        const usedByMenuItems = cardContent.used_by_menu_items || [];

        subRecipeCards.push({
          ...transformedCard,
          subRecipeType,
          usedByMenuItems: usedByMenuItems.map((mi: any) => ({
            menuItemId: mi.menu_item_id,
            menuItemName:
              mi.menu_item_name || menuItemNameMap.get(mi.menu_item_id) || 'Unknown Item',
            quantity: mi.quantity || 1,
          })),
        });
      } else {
        mainCards.push(transformedCard);
      }
    });

    // Sort main cards by category and position
    const sortedMainCards = mainCards
      .sort((a, b) => {
        const categoryCompare = a._order.category.localeCompare(b._order.category);
        if (categoryCompare !== 0) return categoryCompare;
        return a._order.position - b._order.position;
      })
      .map(({ _order, ...card }) => card); // Remove _order from final output

    // Group sub-recipe cards by type
    const groupedSubRecipeCards: {
      sauces: any[];
      marinades: any[];
      brines: any[];
      slowCooked: any[];
      other: any[];
    } = {
      sauces: [],
      marinades: [],
      brines: [],
      slowCooked: [],
      other: [],
    };

    subRecipeCards.forEach(card => {
      const type = card.subRecipeType || 'other';
      if (type in groupedSubRecipeCards) {
        groupedSubRecipeCards[type as keyof typeof groupedSubRecipeCards].push(card);
      } else {
        groupedSubRecipeCards.other.push(card);
      }
    });

    return NextResponse.json({
      success: true,
      cards: sortedMainCards,
      subRecipeCards: groupedSubRecipeCards,
    });
  } catch (err) {
    logger.error('[Recipe Cards API] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to fetch recipe cards',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
