import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const { id, itemId } = await context.params;
    const menuId = id;
    const menuItemId = itemId;
    const body = await request.json();
    const { category, position } = body;

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

    const updateData: {
      category?: string;
      position?: number;
    } = {};

    if (category !== undefined) updateData.category = category;
    if (position !== undefined) updateData.position = position;

    const { data: updatedItem, error: updateError } = await supabaseAdmin
      .from('menu_items')
      .update(updateData)
      .eq('id', menuItemId)
      .eq('menu_id', menuId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating menu item:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
          message: 'Failed to update menu item',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: 'Menu item updated successfully',
    });
  } catch (err) {
    console.error('Unexpected error:', err);
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
      console.error('Error deleting menu item:', error);
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
    console.error('Unexpected error:', err);
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
