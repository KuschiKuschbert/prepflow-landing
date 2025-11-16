import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;

    if (!menuId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing menu id',
          message: 'Menu id is required',
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

    // Fetch menu
    const { data: menu, error: menuError } = await supabaseAdmin
      .from('menus')
      .select('*')
      .eq('id', menuId)
      .single();

    if (menuError || !menu) {
      return NextResponse.json(
        {
          success: false,
          error: 'Menu not found',
          message: 'The requested menu could not be found',
        },
        { status: 404 },
      );
    }

    // Fetch menu items with dishes and recipes
    const { data: menuItems, error: itemsError } = await supabaseAdmin
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
          name,
          description,
          yield
        )
      `,
      )
      .eq('menu_id', menuId)
      .order('category')
      .order('position');

    if (itemsError) {
      console.error('Error fetching menu items:', itemsError);
      return NextResponse.json(
        {
          success: false,
          error: itemsError.message,
          message: 'Failed to fetch menu items',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      menu: {
        ...menu,
        items: menuItems || [],
      },
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

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;
    const body = await request.json();
    const { menu_name, description } = body;

    if (!menuId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing menu id',
          message: 'Menu id is required',
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
      menu_name?: string;
      description?: string | null;
    } = {};

    if (menu_name !== undefined) updateData.menu_name = menu_name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;

    const { data: updatedMenu, error: updateError } = await supabaseAdmin
      .from('menus')
      .update(updateData)
      .eq('id', menuId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating menu:', updateError);
      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
          message: 'Failed to update menu',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      menu: updatedMenu,
      message: 'Menu updated successfully',
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

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;

    if (!menuId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing menu id',
          message: 'Menu id is required',
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

    // Delete menu (cascade will handle menu_items)
    const { error } = await supabaseAdmin.from('menus').delete().eq('id', menuId);

    if (error) {
      console.error('Error deleting menu:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          message: 'Failed to delete menu',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu deleted successfully',
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
