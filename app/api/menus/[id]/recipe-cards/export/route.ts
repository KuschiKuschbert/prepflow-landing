/**
 * Recipe Cards Export API Endpoint
 * GET /api/menus/[id]/recipe-cards/export - Export recipe cards in various formats
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { generateHTML } from './helpers/generateHTML';
import { generateCSV } from './helpers/generateCSV';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuId } = await context.params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'html';

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

    const supabase = createSupabaseAdmin();

    // Fetch recipe cards with menu item and dish/recipe names
    const { data: cards, error } = await supabase
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
        parsed_at,
        menu_items!inner (
          id,
          dish_id,
          recipe_id,
          dishes (
            dish_name
          ),
          recipes (
            name
          )
        )
      `,
      )
      .eq('menu_items.menu_id', menuId);

    if (error) {
      logger.error('[Recipe Cards Export] Failed to fetch recipe cards:', error);
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Failed to fetch recipe cards',
          'DATABASE_ERROR',
          500,
          error.message || String(error),
        ),
        { status: 500 },
      );
    }

    // Fetch menu items separately to get ordering
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('id, category, position')
      .eq('menu_id', menuId)
      .order('category', { ascending: true })
      .order('position', { ascending: true });

    // Create a map for ordering
    const itemOrderMap = new Map<string, { category: string; position: number }>();
    if (menuItems) {
      menuItems.forEach((item: any) => {
        itemOrderMap.set(item.id, {
          category: item.category || '',
          position: item.position || 0,
        });
      });
    }

    // Fetch menu name
    const { data: menu } = await supabase
      .from('menus')
      .select('menu_name')
      .eq('id', menuId)
      .single();

    const menuName = menu?.menu_name || 'Menu';

    // Transform data for export
    const transformedCards = (cards || [])
      .map((card: any) => {
        const menuItem = card.menu_items;
        const recipeName = menuItem?.recipes?.recipe_name || menuItem?.recipes?.name || null;
        const menuItemName = menuItem?.dishes?.dish_name || recipeName || 'Unknown Item';
        const title = card.title || menuItemName;

        return {
          id: card.id,
          menuItemId: card.menu_item_id,
          menuItemName,
          title,
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
        };
      })
      .sort((a, b) => {
        const categoryCompare = a.category.localeCompare(b.category);
        if (categoryCompare !== 0) return categoryCompare;
        return a.position - b.position;
      });

    // Generate export based on format
    if (format === 'csv') {
      return generateCSV(menuName, transformedCards);
    }
    if (format === 'pdf') {
      return generateHTML(menuName, transformedCards, true);
    }
    return generateHTML(menuName, transformedCards, false);
  } catch (err) {
    logger.error('[Recipe Cards Export API] Unexpected error:', {
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

