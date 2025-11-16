import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
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
      logger.error('[Menus API] Database error fetching menus:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/menus', operation: 'GET', table: 'menus' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
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
    logger.error('[Menus API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/menus', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
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
        ApiErrorHandler.createError('Menu name is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
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
      logger.error('[Menus API] Database error creating menu:', {
        error: createError.message,
        code: (createError as any).code,
        context: { endpoint: '/api/menus', operation: 'POST', table: 'menus' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(createError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      menu: newMenu,
      message: 'Menu created successfully',
    });
  } catch (err) {
    logger.error('[Menus API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/menus', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
