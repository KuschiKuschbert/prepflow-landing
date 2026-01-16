/**
 * Helper for finding target menu ID for filtering
 */

import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Finds target menu ID based on query parameters
 *
 * @param {string | null} menuIdParam - Menu ID from query params
 * @param {boolean} lockedMenuOnly - Whether to filter by locked menu only
 * @returns {Promise<string | null>} Target menu ID or null
 */
export async function findTargetMenuId(
  menuIdParam: string | null,
  lockedMenuOnly: boolean,
): Promise<string | null> {
  let targetMenuId: string | null = menuIdParam || null;

  if (lockedMenuOnly && !targetMenuId) {
    if (!supabaseAdmin) {
      logger.error('[Performance Summary API] Database connection not available');
      throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
    }

    const { data: lockedMenu, error: lockedMenuError } = await supabaseAdmin
      .from('menus')
      .select('id')
      .eq('is_locked', true)
      .single();

    if (lockedMenuError) {
      logger.warn('[Performance Summary API] Error fetching locked menu:', {
        error: lockedMenuError.message,
        code: (lockedMenuError as unknown).code,
      });
    } else if (lockedMenu) {
      targetMenuId = lockedMenu.id;
      logger.dev('[Performance Summary API] Filtering by locked menu:', { menuId: targetMenuId });
    } else {
      logger.dev('[Performance Summary API] No locked menu found, showing all dishes');
    }
  }

  return targetMenuId;
}
