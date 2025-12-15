import { logger } from '@/lib/logger';

interface MenuLockStatus {
  is_locked: boolean;
  locked_at?: string;
  locked_by?: string;
}

export async function fetchMenuLockStatus(
  menuId: string,
  justUpdatedLockRef: React.MutableRefObject<boolean>,
): Promise<MenuLockStatus | null> {
  if (justUpdatedLockRef.current) {
    logger.dev('[MenuEditor] fetchMenuLockStatus SKIPPED - justUpdatedLockRef is true');
    return null;
  }

  logger.dev(`[MenuEditor] fetchMenuLockStatus CALLED for menu ${menuId}`);
  try {
    const response = await fetch(`/api/menus/${menuId}`);
    const data = await response.json();
    if (data.success && data.menu) {
      return {
        is_locked: data.menu.is_locked || false,
        locked_at: data.menu.locked_at,
        locked_by: data.menu.locked_by,
      };
    }
    return null;
  } catch (err) {
    logger.error('[MenuEditor] Error fetching menu lock status:', err);
    return null;
  }
}

