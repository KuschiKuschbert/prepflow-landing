import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { z } from 'zod';

const addMenuItemSchema = z.object({
  dish_id: z.string().optional(),
  recipe_id: z.string().optional(),
  category: z.string().optional(),
  position: z.number().int().nonnegative().optional(),
}).refine(data => data.dish_id || data.recipe_id, {
  message: 'Either dish_id or recipe_id must be provided',
  path: ['dish_id'],
}).refine(data => !(data.dish_id && data.recipe_id), {
  message: 'Cannot specify both dish_id and recipe_id',
  path: ['dish_id'],
});
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Menu Items API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = addMenuItemSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { dish_id, recipe_id, category, position } = validationResult.data;

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

    // If position not provided, get the next position in the category
    let itemPosition = position;
    if (itemPosition === undefined) {
      const { data: existingItems, error: positionError } = await supabaseAdmin
        .from('menu_items')
        .select('position')
        .eq('menu_id', menuId)
        .eq('category', category || 'Uncategorized')
        .order('position', { ascending: false })
        .limit(1);

      if (positionError) {
        logger.warn('[Menu Items API] Error fetching existing items for position:', {
          error: positionError.message,
          menuId,
          category,
        });
        // Default to 0 if we can't fetch existing items
        itemPosition = 0;
      } else {
        itemPosition = existingItems && existingItems.length > 0 ? existingItems[0].position + 1 : 0;
      }
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
