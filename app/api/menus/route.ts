import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const {
      data: menus,
      error,
      count,
    } = await supabaseAdmin
      .from('menus')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching menus:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          message: 'Failed to fetch menus',
        },
        { status: 500 },
      );
    }

    // Fetch menu items count for each menu
    const menusWithCounts = await Promise.all(
      (menus || []).map(async menu => {
        const { count: itemsCount } = await supabaseAdmin!
          .from('menu_items')
          .select('*', { count: 'exact', head: true })
          .eq('menu_id', menu.id);

        return {
          ...menu,
          items_count: itemsCount || 0,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      menus: menusWithCounts,
      count: count || 0,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { menu_name, description } = body;

    if (!menu_name) {
      return NextResponse.json(
        { error: 'Missing required field', message: 'Menu name is required' },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const { data: newMenu, error: createError } = await supabaseAdmin
      .from('menus')
      .insert({
        menu_name: menu_name.trim(),
        description: description?.trim() || null,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating menu:', createError);
      return NextResponse.json(
        {
          success: false,
          error: createError.message,
          message: 'Failed to create menu',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      menu: newMenu,
      message: 'Menu created successfully',
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
