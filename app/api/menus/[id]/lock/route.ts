/**
 * Menu Lock API Endpoint
 * POST /api/menus/[id]/lock - Lock menu
 * DELETE /api/menus/[id]/lock - Unlock menu
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

/**
 * Lock a menu to prevent modifications.
 *
 * @param {NextRequest} request - The incoming request
 * @param {Object} context - Route context containing params
 * @param {Promise<{id: string}>} context.params - Route parameters containing menu ID
 * @returns {Promise<NextResponse>} Response with locked menu data or error
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  // Early logging to confirm route is being called
  logger.dev('[Menu Lock API] POST route handler called', {
    path: request.nextUrl.pathname,
    method: request.method,
    url: request.url,
  });

  try {
    const params = await context.params;
    const menuId = params?.id;

    logger.dev('[Menu Lock API] POST request received', {
      menuId,
      menuIdType: typeof menuId,
      menuIdLength: menuId?.length,
      params,
      pathname: request.nextUrl.pathname,
      url: request.url,
    });

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if menu exists - first check if menu exists (without is_locked column)
    // The is_locked column may not exist if migration hasn't been run
    logger.dev('[Menu Lock API] Checking menu existence:', { menuId });

    // First, check if menu exists (just by ID)
    const { data: menus, error: fetchError } = await supabaseAdmin
      .from('menus')
      .select('id')
      .eq('id', menuId);

    if (fetchError) {
      logger.error('[Menu Lock API] Error fetching menu:', {
        error: fetchError.message,
        code: fetchError.code,
        details: fetchError.details,
        hint: fetchError.hint,
        menuId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    if (!menus || menus.length === 0) {
      logger.error('[Menu Lock API] Menu not found in database:', {
        menuId,
        menuIdType: typeof menuId,
        menusFound: menus?.length || 0,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    // Menu exists! Now check lock status (handle missing column gracefully)
    const { data: menuWithLock, error: lockStatusError } = await supabaseAdmin
      .from('menus')
      .select('id, is_locked, locked_at, locked_by')
      .eq('id', menuId)
      .single();

    // If is_locked column doesn't exist, treat menu as unlocked
    const isLocked = lockStatusError?.code === '42703'
      ? false
      : (menuWithLock?.is_locked || false);

    const menu = {
      id: menus[0].id,
      is_locked: isLocked,
      locked_at: lockStatusError?.code === '42703' ? null : menuWithLock?.locked_at,
      locked_by: lockStatusError?.code === '42703' ? null : menuWithLock?.locked_by,
    };

    if (lockStatusError && lockStatusError.code !== '42703') {
      // Some other error occurred
      logger.error('[Menu Lock API] Error fetching menu lock status:', {
        error: lockStatusError.message,
        code: lockStatusError.code,
        menuId,
      });
      // Continue anyway - we know menu exists
    }

    logger.dev('[Menu Lock API] Menu lock status:', {
      menuId: menu.id,
      isLocked: menu.is_locked,
      columnExists: lockStatusError?.code !== '42703',
    });

    if (menu.is_locked) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu is already locked', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Lock menu
    // Check if lock columns exist first
    if (lockStatusError?.code === '42703') {
      // Columns don't exist - need to run migration
      logger.error('[Menu Lock API] Lock columns do not exist - migration required:', {
        menuId,
        error: lockStatusError.message,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Menu lock feature requires database migration. Please run the migration: migrations/add-menu-lock.sql',
          'MIGRATION_REQUIRED',
          503,
        ),
        { status: 503 },
      );
    }

    // Columns exist - proceed with lock
    const { data: updatedMenu, error: updateError } = await supabaseAdmin
      .from('menus')
      .update({
        is_locked: true,
        locked_at: new Date().toISOString(),
        // Note: locked_by is UUID type in schema, but we're storing email as text
        // This may need schema update: ALTER TABLE menus ALTER COLUMN locked_by TYPE TEXT;
        // For now, omitting to avoid type errors
      })
      .eq('id', menuId)
      .select()
      .single();

    if (updateError) {
      logger.error('[Menu Lock API] Database error locking menu:', {
        error: updateError.message,
        code: updateError.code,
        menuId,
      });

      // Check if it's a column error
      if (updateError.code === '42703') {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Menu lock feature requires database migration. Please run: migrations/add-menu-lock.sql',
            'MIGRATION_REQUIRED',
            503,
          ),
          { status: 503 },
        );
      }

      return NextResponse.json(
        ApiErrorHandler.createError('Failed to lock menu', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      menu: updatedMenu,
      message: 'Menu locked successfully',
    });
  } catch (err) {
    logger.error('[Menu Lock API] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to lock menu',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}

/**
 * Unlock a menu to allow modifications.
 *
 * @param {NextRequest} request - The incoming request
 * @param {Object} context - Route context containing params
 * @param {Promise<{id: string}>} context.params - Route parameters containing menu ID
 * @returns {Promise<NextResponse>} Response with unlocked menu data or error
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  // Early logging to confirm route is being called
  logger.dev('[Menu Lock API] DELETE route handler called', {
    path: request.nextUrl.pathname,
    method: request.method,
    url: request.url,
  });

  try {
    const params = await context.params;
    const menuId = params?.id;

    logger.dev('[Menu Lock API] DELETE request received', {
      menuId,
      menuIdType: typeof menuId,
      menuIdLength: menuId?.length,
      params,
      pathname: request.nextUrl.pathname,
      url: request.url,
    });

    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if menu exists first (without is_locked column)
    const { data: menus, error: fetchError } = await supabaseAdmin
      .from('menus')
      .select('id')
      .eq('id', menuId);

    if (fetchError) {
      logger.error('[Menu Lock API] Error fetching menu for unlock:', {
        error: fetchError.message,
        code: fetchError.code,
        details: fetchError.details,
        hint: fetchError.hint,
        menuId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    if (!menus || menus.length === 0) {
      logger.error('[Menu Lock API] Menu not found in database for unlock:', {
        menuId,
        menuIdType: typeof menuId,
        menusFound: menus?.length || 0,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    // Menu exists! Now check lock status (handle missing column gracefully)
    const { data: menuWithLock, error: lockStatusError } = await supabaseAdmin
      .from('menus')
      .select('id, is_locked')
      .eq('id', menuId)
      .single();

    // If is_locked column doesn't exist, treat menu as unlocked
    const isLocked = lockStatusError?.code === '42703'
      ? false
      : (menuWithLock?.is_locked || false);

    const menu = {
      id: menus[0].id,
      is_locked: isLocked,
    };

    // Check if columns exist
    if (lockStatusError?.code === '42703') {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Menu lock feature requires database migration. Please run: migrations/add-menu-lock.sql',
          'MIGRATION_REQUIRED',
          503,
        ),
        { status: 503 },
      );
    }

    if (!menu.is_locked) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu is not locked', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Unlock menu
    const { data: updatedMenu, error: updateError } = await supabaseAdmin
      .from('menus')
      .update({
        is_locked: false,
        locked_at: null,
        locked_by: null,
      })
      .eq('id', menuId)
      .select()
      .single();

    if (updateError) {
      logger.error('[Menu Lock API] Database error unlocking menu:', {
        error: updateError.message,
        menuId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to unlock menu', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      menu: updatedMenu,
      message: 'Menu unlocked successfully',
    });
  } catch (err) {
    logger.error('[Menu Lock API] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to unlock menu',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
