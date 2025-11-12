import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;
    const body = await request.json();
    const { dish_id, category, position } = body;

    if (!menuId || !dish_id) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'Menu id and dish id are required' },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
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

    const { data: newItem, error: createError } = await supabaseAdmin
      .from('menu_items')
      .insert({
        menu_id: menuId,
        dish_id,
        category: category || 'Uncategorized',
        position: itemPosition,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error adding dish to menu:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      item: newItem,
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
