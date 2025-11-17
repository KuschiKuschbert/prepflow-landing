import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

import { logger } from '@/lib/logger';
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;
    const body = await request.json();
    const { dish_id, recipe_id, category, position } = body;

    // Must have either dish_id or recipe_id, but not both
    if (!menuId || (!dish_id && !recipe_id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Menu id and either dish id or recipe id are required',
        },
        { status: 400 },
      );
    }

    if (dish_id && recipe_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'Cannot specify both dish_id and recipe_id',
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

    // If position not provided, get the next position in the category
    let itemPosition = position;
    if (itemPosition === undefined) {
      const { data: existingItems } = await supabaseAdmin
        .from('menu_items')
        .select('position')
        .eq('menu_id', menuId)
        .eq('category', category || 'Uncategorized')
        .order('position', { ascending: false })
        .limit(1);

      itemPosition = existingItems && existingItems.length > 0 ? existingItems[0].position + 1 : 0;
    }

    const insertData: {
      menu_id: string;
      dish_id?: string;
      recipe_id?: string;
      category: string;
      position: number;
    } = {
      menu_id: menuId,
      category: category || 'Uncategorized',
      position: itemPosition,
    };

    if (dish_id) {
      insertData.dish_id = dish_id;
    } else if (recipe_id) {
      insertData.recipe_id = recipe_id;
    }

    // Insert the menu item
    const { data: insertedItem, error: createError } = await supabaseAdmin
      .from('menu_items')
      .insert(insertData)
      .select('id')
      .single();

    if (createError) {
      logger.error('Error adding item to menu:', createError);
      return NextResponse.json(
        {
          success: false,
          error: createError.message,
          message: dish_id ? 'Failed to add dish to menu' : 'Failed to add recipe to menu',
        },
        { status: 500 },
      );
    }

    // Fetch the complete item with joined dish/recipe data
    const { data: newItem, error: fetchError } = await supabaseAdmin
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
          recipe_name,
          description,
          yield,
          selling_price
        )
      `,
      )
      .eq('id', insertedItem.id)
      .single();

    if (fetchError) {
      logger.error('Error fetching new menu item:', fetchError);
      // Return the basic item if fetch fails (shouldn't happen, but graceful fallback)
      return NextResponse.json({
        success: true,
        item: insertedItem,
        message: dish_id ? 'Dish added to menu successfully' : 'Recipe added to menu successfully',
      });
    }

    return NextResponse.json({
      success: true,
      item: newItem,
      message: dish_id ? 'Dish added to menu successfully' : 'Recipe added to menu successfully',
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
