import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;

    if (!menuId) {
      return NextResponse.json({ error: 'Missing menu id' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Fetch menu
    const { data: menu, error: menuError } = await supabaseAdmin
      .from('menus')
      .select('*')
      .eq('id', menuId)
      .single();

    if (menuError || !menu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }

    // Fetch menu items with dishes
    const { data: menuItems, error: itemsError } = await supabaseAdmin
      .from('menu_items')
      .select(
        `
        id,
        dish_id,
        category,
        position,
        dishes (
          id,
          dish_name,
          description,
          selling_price
        )
      `,
      )
      .eq('menu_id', menuId)
      .order('category')
      .order('position');

    if (itemsError) {
      console.error('Error fetching menu items:', itemsError);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;
    const body = await request.json();
    const { menu_name, description } = body;

    if (!menuId) {
      return NextResponse.json({ error: 'Missing menu id' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
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
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      menu: updatedMenu,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
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
      return NextResponse.json({ error: 'Missing menu id' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Delete menu (cascade will handle menu_items)
    const { error } = await supabaseAdmin.from('menus').delete().eq('id', menuId);

    if (error) {
      console.error('Error deleting menu:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Menu deleted successfully',
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
