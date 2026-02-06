/**
 * Recipe Cards API Endpoint
 * GET /api/menus/[id]/recipe-cards - Fetch recipe cards for a menu
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { fetchMenuItemNames } from './helpers/fetchMenuItemNames';
import { fetchMenuItems } from './helpers/fetchMenuItems';
import { fetchRecipeCardLinks } from './helpers/fetchRecipeCardLinks';
import { processCardsNewMethod, processCardsOldMethod } from './helpers/processCards';
import { groupSubRecipeCards, sortMainCards } from './helpers/sortAndGroupCards';
import { transformCards } from './helpers/transformCards';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawMenuId } = await context.params;
    // Defensive coding: Clean menu ID if it has trailing comma or other garbage
    // This fixes the "can't find menu,L" error where ",L" is appended to the ID
    const menuId = rawMenuId?.split(',')[0]?.trim();

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdmin();

    // Fetch menu items for this menu to get ordering
    const { items: menuItems, itemOrderMap } = await fetchMenuItems(supabase, menuId);

    if (menuItems.length === 0) {
      return NextResponse.json({
        success: true,
        cards: [],
      });
    }

    const menuItemIds = menuItems.map(item => item.id);

    // Fetch recipe card links (with fallback to old method)
    const { links, cards, useOldMethod } = await fetchRecipeCardLinks(supabase, menuItemIds);

    // Fetch menu item names for display
    const menuItemNameMap = await fetchMenuItemNames(supabase, menuItemIds);

    // Process cards (old vs new method)
    const cardMap = useOldMethod
      ? processCardsOldMethod(cards!, menuItemNameMap)
      : processCardsNewMethod(links!, menuItemNameMap);

    // Transform cards for response
    const { mainCards, subRecipeCards } = transformCards(cardMap, itemOrderMap, menuItemNameMap);

    // Sort main cards and group sub-recipe cards
    const sortedMainCards = sortMainCards(mainCards);
    const groupedSubRecipeCards = groupSubRecipeCards(subRecipeCards);

    return NextResponse.json({
      success: true,
      cards: sortedMainCards,
      subRecipeCards: groupedSubRecipeCards,
    });
  } catch (err: unknown) {
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
