import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Resolves a menu ID, supporting "magic" keywords like "latest"
 *
 * @param menuId - The provided menu ID or keyword
 * @param userId - The user ID to scope the search
 * @returns The resolved menu ID
 */
export async function resolveMenuId(menuId: string, userId: string): Promise<string> {
  if (menuId !== 'latest' && menuId !== 'latest-locked') {
    return menuId;
  }

  if (!supabaseAdmin) {
    logger.error('[resolveMenuId] Database connection not available');
    return menuId;
  }

  logger.dev(`[resolveMenuId] Resolving magic ID "${menuId}" for user: ${userId}`);

  let query = supabaseAdmin
    .from('menus')
    .select('id')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1);

  if (menuId === 'latest-locked') {
    query = query.eq('is_locked', true);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    logger.warn(`[resolveMenuId] Could not resolve magic ID "${menuId}":`, {
      error: error?.message,
      userId,
    });
    return menuId; // Fallback to original
  }

  logger.dev(`[resolveMenuId] Resolved "${menuId}" to: ${data.id}`);
  return data.id;
}
