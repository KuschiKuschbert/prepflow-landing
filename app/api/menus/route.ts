import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Menu } from './types';

const createMenuSchema = z.object({
  menu_name: z.string().min(1, 'Menu name is required'),
  description: z.string().optional(),
});

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
      const pgError = error as PostgrestError;
      logger.error('[Menus API] Database error fetching menus:', {
        error: pgError.message,
        code: pgError.code,
        context: { endpoint: '/api/menus', operation: 'GET', table: 'menus' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(pgError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Fetch menu items count for each menu
    const menusWithCounts: Menu[] = await Promise.all(
      (menus || []).map(async (menu) => {
        const { count: itemsCount, error: itemsError } = await supabaseAdmin!
          .from('menu_items')
          .select('*', { count: 'exact', head: true })
          .eq('menu_id', menu.id);

        if (itemsError) {
          const pgItemsError = itemsError as PostgrestError;
          logger.warn('[Menus API] Error fetching menu items count:', {
            error: pgItemsError.message,
            menuId: menu.id,
          });
        }

        return {
          ...menu,
          items_count: itemsCount || 0,
        } as Menu;
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
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Menus API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createMenuSchema.safeParse(body);
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

    const { menu_name, description } = validationResult.data;

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
      const pgError = createError as PostgrestError;
      logger.error('[Menus API] Database error creating menu:', {
        error: pgError.message,
        code: pgError.code,
        context: { endpoint: '/api/menus', operation: 'POST', table: 'menus' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(pgError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      menu: newMenu as Menu,
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
