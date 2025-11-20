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
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuId } = await context.params;
    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401), {
        status: 401,
      });
    }
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }
    const { data: menus, error: fetchError } = await supabaseAdmin
      .from('menus')
      .select('id')
      .eq('id', menuId);
    if (fetchError || !menus || menus.length === 0) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }
    const { data: menuWithLock, error: lockStatusError } = await supabaseAdmin
      .from('menus')
      .select('id, is_locked, locked_at, locked_by')
      .eq('id', menuId)
      .single();
    const isLocked = lockStatusError?.code === '42703' ? false : menuWithLock?.is_locked || false;
    if (isLocked) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu is already locked', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }
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
    const { data: updatedMenu, error: updateError } = await supabaseAdmin
      .from('menus')
      .update({
        is_locked: true,
        locked_at: new Date().toISOString(),
      })
      .eq('id', menuId)
      .select()
      .single();
    if (updateError) {
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
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: menuId } = await context.params;
    if (!menuId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401), {
        status: 401,
      });
    }
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }
    const { data: menus, error: fetchError } = await supabaseAdmin
      .from('menus')
      .select('id')
      .eq('id', menuId);
    if (fetchError || !menus || menus.length === 0) {
      return NextResponse.json(ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }
    const { data: menuWithLock, error: lockStatusError } = await supabaseAdmin
      .from('menus')
      .select('id, is_locked')
      .eq('id', menuId)
      .single();
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
    const isLocked = lockStatusError?.code === '42703' ? false : menuWithLock?.is_locked || false;
    if (!isLocked) {
      return NextResponse.json(
        ApiErrorHandler.createError('Menu is not locked', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }
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
