/**
 * Helper for menu lock/unlock operations
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Checks if menu is locked
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<{ isLocked: boolean; error: NextResponse | null }>} Lock status and error if any
 */
export async function checkLockStatus(
  menuId: string,
): Promise<{ isLocked: boolean; error: NextResponse | null }> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Data connection not available', 'DATABASE_ERROR', 500);
  }

  const migrationError = ApiErrorHandler.createError(
    'Menu lock feature requires database migration. Please run: migrations/add-menu-lock.sql',
    'MIGRATION_REQUIRED',
    503,
  );

  const { data: menuWithLock, error: lockStatusError } = await supabaseAdmin
    .from('menus')
    .select('id, is_locked, locked_at, locked_by')
    .eq('id', menuId)
    .single();

  if (lockStatusError?.code === '42703') {
    return { isLocked: false, error: NextResponse.json(migrationError, { status: 503 }) };
  }

  const isLocked = menuWithLock?.is_locked || false;
  return { isLocked, error: null };
}

/**
 * Locks a menu
 *
 * @param {string} menuId - Menu ID
 * @param {string} userEmail - User email
 * @returns {Promise<{ menu: any | null; error: NextResponse | null }>} Updated menu and error if any
 */
export async function lockMenu(
  menuId: string,
  userEmail: string,
): Promise<{ menu: any | null; error: NextResponse | null }> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Data connection not available', 'DATABASE_ERROR', 500);
  }

  const migrationError = ApiErrorHandler.createError(
    'Menu lock feature requires database migration. Please run: migrations/add-menu-lock.sql',
    'MIGRATION_REQUIRED',
    503,
  );

  const { data: updatedMenu, error: updateError } = await supabaseAdmin
    .from('menus')
    .update({
      is_locked: true,
      locked_at: new Date().toISOString(),
      locked_by: userEmail,
    })
    .eq('id', menuId)
    .select()
    .single();

  if (updateError) {
    if (updateError.code === '42703') {
      return { menu: null, error: NextResponse.json(migrationError, { status: 503 }) };
    }

    // Handle type mismatch if locked_by column is still UUID type
    if (
      updateError.message?.includes('locked_by') ||
      updateError.code === '42804' ||
      updateError.message?.includes('invalid input syntax for type uuid')
    ) {
      logger.error('[Menu Lock API] locked_by column type mismatch - migration needed:', {
        menuId,
        userEmail,
        error: updateError.message,
        code: updateError.code,
        hint: 'Run migrations/add-menu-lock.sql to update locked_by column to VARCHAR',
      });
      return {
        menu: null,
        error: NextResponse.json(
          ApiErrorHandler.createError(
            'Data structure mismatch: locked_by column needs to be VARCHAR. Please run migrations/add-menu-lock.sql',
            'MIGRATION_REQUIRED',
            503,
          ),
          { status: 503 },
        ),
      };
    }

    logger.error('[Menu Lock API] Database error:', {
      error: updateError.message,
      code: updateError.code,
      details: updateError.details,
      hint: updateError.hint,
      menuId,
    });
    return {
      menu: null,
      error: NextResponse.json(
        ApiErrorHandler.createError(
          `Failed to lock menu: ${updateError.message || 'Database error'}`,
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      ),
    };
  }

  return { menu: updatedMenu, error: null };
}

/**
 * Unlocks a menu
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<{ menu: any | null; error: NextResponse | null }>} Updated menu and error if any
 */
export async function unlockMenu(
  menuId: string,
): Promise<{ menu: any | null; error: NextResponse | null }> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Data connection not available', 'DATABASE_ERROR', 500);
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
    return {
      menu: null,
      error: NextResponse.json(
        ApiErrorHandler.createError('Failed to unlock menu', 'DATABASE_ERROR', 500),
        { status: 500 },
      ),
    };
  }

  return { menu: updatedMenu, error: null };
}




