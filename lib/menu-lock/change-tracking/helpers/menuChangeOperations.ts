import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { MenuChangeTracking } from '../types';

/**
 * Get all unhandled changes for a menu
 */
export async function getMenuChanges(menuId: string): Promise<MenuChangeTracking[]> {
  if (!supabaseAdmin) {
    logger.error('[Menu Change Tracking] Supabase admin client not available');
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('menu_change_tracking')
      .select('*')
      .eq('menu_id', menuId)
      .eq('handled', false)
      .order('changed_at', { ascending: false });

    if (error) {
      logger.error('[Menu Change Tracking] Failed to get menu changes:', {
        menuId,
        error: error.message,
      });
      return [];
    }

    return (data || []) as MenuChangeTracking[];
  } catch (err) {
    logger.error('[Menu Change Tracking] Error getting menu changes:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { menuId, operation: 'getMenuChanges' },
    });
    return [];
  }
}

/**
 * Mark changes as handled for a menu
 */
export async function markChangesHandled(menuId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Menu Change Tracking] Supabase admin client not available');
    return;
  }

  try {
    const { error } = await supabaseAdmin
      .from('menu_change_tracking')
      .update({
        handled: true,
        handled_at: new Date().toISOString(),
      })
      .eq('menu_id', menuId)
      .eq('handled', false);

    if (error) {
      logger.error('[Menu Change Tracking] Failed to mark changes as handled:', {
        menuId,
        error: error.message,
      });
    } else {
      logger.dev(`[Menu Change Tracking] Marked changes as handled for menu ${menuId}`);
    }
  } catch (err) {
    logger.error('[Menu Change Tracking] Error marking changes as handled:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { menuId, operation: 'markChangesHandled' },
    });
  }
}

/**
 * Clear all changes for a menu (on lock or after handling)
 */
export async function clearMenuChanges(menuId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Menu Change Tracking] Supabase admin client not available');
    return;
  }

  try {
    const { error } = await supabaseAdmin.from('menu_change_tracking').delete().eq('menu_id', menuId);

    if (error) {
      logger.error('[Menu Change Tracking] Failed to clear menu changes:', {
        menuId,
        error: error.message,
      });
    } else {
      logger.dev(`[Menu Change Tracking] Cleared all changes for menu ${menuId}`);
    }
  } catch (err) {
    logger.error('[Menu Change Tracking] Error clearing menu changes:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { menuId, operation: 'clearMenuChanges' },
    });
  }
}

/**
 * Check if a menu is locked
 */
export async function isMenuLocked(menuId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    return false;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('menus')
      .select('is_locked')
      .eq('id', menuId)
      .single();

    if (error || !data) {
      return false;
    }

    return data.is_locked === true;
  } catch (err) {
    logger.error('[Menu Change Tracking] Error checking if menu is locked:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { menuId, operation: 'isMenuLocked' },
    });
    return false;
  }
}
