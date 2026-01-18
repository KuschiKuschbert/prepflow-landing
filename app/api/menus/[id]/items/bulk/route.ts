import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;
    const body = await request.json();
    const { items } = body;

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu id is required', 'MISSING_REQUIRED_FIELD', 400),
        { status: 400 },
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Items array is required and must not be empty',
          'MISSING_REQUIRED_FIELD',
          400,
        ),
        { status: 400 },
      );
    }
    for (const item of items) {
      if (!item.dish_id && !item.recipe_id) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Each item must have either dish_id or recipe_id',
            'INVALID_REQUEST',
            400,
          ),
          { status: 400 },
        );
      }
      if (item.dish_id && item.recipe_id) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Cannot specify both dish_id and recipe_id for the same item',
            'INVALID_REQUEST',
            400,
          ),
          { status: 400 },
        );
      }
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Database connection could not be established',
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    // Verify menu exists
    const { data: menu, error: menuError } = await supabaseAdmin
      .from('menus')
      .select('id')
      .eq('id', menuId)
      .single();

    if (menuError || !menu) {
      logger.error('Error fetching menu:', menuError);
      return NextResponse.json(
        { success: false, error: 'Menu not found', message: 'The specified menu does not exist' },
        { status: 404 },
      );
    }

    const insertItems: Array<{
      menu_id: string;
      dish_id?: string;
      recipe_id?: string;
      category: string;
      position: number;
    }> = [];
    const categoryGroups: Record<string, typeof items> = {};
    for (const item of items) {
      const category = item.category || 'Uncategorized';
      if (!categoryGroups[category]) categoryGroups[category] = [];
      categoryGroups[category].push(item);
    }
    for (const [category, categoryItems] of Object.entries(categoryGroups)) {
      const { data: existingItems } = await supabaseAdmin
        .from('menu_items')
        .select('position')
        .eq('menu_id', menuId)
        .eq('category', category)
        .order('position', { ascending: false })
        .limit(1);
      let nextPosition =
        existingItems && existingItems.length > 0 ? existingItems[0].position + 1 : 0;
      for (const item of categoryItems) {
        const insertItem: {
          menu_id: string;
          dish_id?: string;
          recipe_id?: string;
          category: string;
          position: number;
        } = {
          menu_id: menuId,
          category,
          position: nextPosition++,
        };
        if (item.dish_id) insertItem.dish_id = item.dish_id;
        else if (item.recipe_id) insertItem.recipe_id = item.recipe_id;
        insertItems.push(insertItem);
      }
    }

    // Insert all items in a single batch
    const { data: insertedItems, error: insertError } = await supabaseAdmin
      .from('menu_items')
      .insert(insertItems)
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
          recipe_name,
          description,
          yield,
          selling_price
        )
      `,
      );

    if (insertError) {
      logger.error('Error adding items to menu:', insertError);
      return NextResponse.json(
        { success: false, error: insertError.message, message: 'Failed to add items to menu' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      items: insertedItems || [],
      message: `${insertItems.length} item${insertItems.length > 1 ? 's' : ''} added to menu successfully`,
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
