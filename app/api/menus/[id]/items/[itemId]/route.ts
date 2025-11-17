import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

import { logger } from '@/lib/logger';
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const { id, itemId } = await context.params;
    const menuId = id;
    const menuItemId = itemId;
    const body = await request.json();
    const { category, position, actual_selling_price } = body;

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

    // Fetch menu item first to get dish_id or recipe_id
    const { data: menuItem, error: fetchError } = await supabaseAdmin
      .from('menu_items')
      .select('dish_id, recipe_id')
      .eq('id', menuItemId)
      .eq('menu_id', menuId)
      .single();

    if (fetchError || !menuItem) {
      logger.error('Error fetching menu item:', fetchError);
      return NextResponse.json(
        {
          success: false,
          error: fetchError?.message || 'Menu item not found',
          message: 'Failed to fetch menu item',
        },
        { status: 404 },
      );
    }

    const updateData: {
      category?: string;
      position?: number;
      actual_selling_price?: number | null;
    } = {};

    if (category !== undefined) updateData.category = category;
    if (position !== undefined) updateData.position = position;
    if (actual_selling_price !== undefined) {
      // Allow null to clear actual price (use recommended instead)
      updateData.actual_selling_price = actual_selling_price === null ? null : actual_selling_price;
    }

    // Update menu_items table
    const { data: updatedItem, error: updateError } = await supabaseAdmin
      .from('menu_items')
      .update(updateData)
      .eq('id', menuItemId)
      .eq('menu_id', menuId)
      .select()
      .single();

    if (updateError) {
      logger.error('Error updating menu item:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
          message: 'Failed to update menu item',
        },
        { status: 500 },
      );
    }

    // Sync actual_selling_price to dish or recipe table
    if (actual_selling_price !== undefined) {
      const priceToSync = actual_selling_price === null ? null : actual_selling_price;

      if (menuItem.dish_id) {
        // Update dish.selling_price
        const { error: dishUpdateError } = await supabaseAdmin
          .from('dishes')
          .update({ selling_price: priceToSync })
          .eq('id', menuItem.dish_id);

        if (dishUpdateError) {
          logger.error('Error syncing price to dish:', dishUpdateError);
          // Don't fail the request, but log the error
        }
      } else if (menuItem.recipe_id) {
        // Update recipe.selling_price (per serving)
        const { error: recipeUpdateError } = await supabaseAdmin
          .from('recipes')
          .update({ selling_price: priceToSync })
          .eq('id', menuItem.recipe_id);

        if (recipeUpdateError) {
          logger.error('Error syncing price to recipe:', recipeUpdateError);
          // Don't fail the request, but log the error
        }
      }
    }

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: 'Menu item updated successfully',
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

export async function DELETE(
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

    const { error } = await supabaseAdmin
      .from('menu_items')
      .delete()
      .eq('id', menuItemId)
      .eq('menu_id', menuId);

    if (error) {
      logger.error('Error deleting menu item:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          message: 'Failed to delete menu item',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully',
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
