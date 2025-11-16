import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;
    const body = await request.json();
    const { items } = body; // Array of { id, category, position }

    if (!menuId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Menu id and items array are required',
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

    // Update all items in a transaction-like manner
    const updates = items.map((item: { id: string; category: string; position: number }) =>
      supabaseAdmin!
        .from('menu_items')
        .update({
          category: item.category,
          position: item.position,
        })
        .eq('id', item.id)
        .eq('menu_id', menuId),
    );

    const results = await Promise.all(updates);
    const errors = results.filter(r => r.error);

    if (errors.length > 0) {
      console.error('Error reordering menu items:', errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to reorder some items',
          message: 'Some menu items could not be reordered',
          details: errors,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu items reordered successfully',
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
