import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Get locked menu IDs from menu items
 */
export async function getLockedMenusByMenuItems(menuIds: string[]): Promise<string[]> {
  if (!supabaseAdmin || menuIds.length === 0) return [];

  const { data: lockedMenus, error } = await supabaseAdmin
    .from('menus')
    .select('id')
    .in('id', menuIds)
    .eq('is_locked', true);

  if (error) {
    logger.warn('[Menu Change Tracking] Error fetching locked menus:', {
      error: error.message,
      context: { menuIds },
    });
    return [];
  }

  return lockedMenus ? lockedMenus.map(m => m.id) : [];
}
