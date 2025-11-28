import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { fetchMenuItem } from './helpers/fetchMenuItem';
import { syncPrice } from './helpers/syncPrice';
import { validateMenuItemRequest } from './helpers/validateMenuItemRequest';

/**
 * PUT /api/menus/[id]/items/[itemId]
 * Update menu item (category, position, or price)
 *
 * @param {NextRequest} request - Request object
 * @param {Object} context - Route context
 * @param {Promise<{id: string, itemId: string}>} context.params - Route parameters
 * @param {Object} request.body - Request body
 * @param {string} [request.body.category] - Category name
 * @param {number} [request.body.position] - Position in category
 * @param {number} [request.body.actual_selling_price] - Actual selling price
 * @returns {Promise<NextResponse>} Update response
 */
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

    // Validate request
    const validationError = validateMenuItemRequest(menuId, menuItemId);
    if (validationError) {
      return validationError;
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
    const { menuItem, error: fetchError } = await fetchMenuItem(menuId, menuItemId);
    if (fetchError) {
      return fetchError;
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

    logger.dev('[Menu Item API] Updating menu item', {
      menuId,
      menuItemId,
      updateData,
      actual_selling_price,
    });

    // Update menu_items table
    const { data: updatedItem, error: updateError } = await supabaseAdmin
      .from('menu_items')
      .update(updateData)
      .eq('id', menuItemId)
      .eq('menu_id', menuId)
      .select()
      .single();

    if (updateError) {
      logger.error('[Menu Item API] Error updating menu item:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
          message: 'Failed to update menu item',
        },
        { status: 500 },
      );
    }

    logger.dev('[Menu Item API] Menu item updated successfully', {
      menuItemId,
      updatedItem,
      actual_selling_price: updatedItem?.actual_selling_price,
    });

    // Sync actual_selling_price to dish or recipe table
    if (actual_selling_price !== undefined) {
      logger.dev('[Menu Item API] Syncing price to dish/recipe', {
        menuItemId,
        dish_id: menuItem?.dish_id,
        recipe_id: menuItem?.recipe_id,
        actual_selling_price,
      });
      await syncPrice(menuItem!, actual_selling_price);
      logger.dev('[Menu Item API] Price sync completed', {
        menuItemId,
      });
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

    // Validate request
    const validationError = validateMenuItemRequest(menuId, menuItemId);
    if (validationError) {
      return validationError;
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
