import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { Menu } from '../../../types';
import { useCallback, useState } from 'react';

/**
 * Hook for managing menu data fetching and caching
 */
export function useMenuData() {
  const cachedMenus = getCachedData<Menu[]>('menu_builder_menus');
  const [menus, setMenus] = useState<Menu[]>(cachedMenus || []);
  const [loading, setLoading] = useState(!cachedMenus);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = useCallback(async (updateSelected?: boolean, showLoading = true) => {
    logger.dev(
      `[MenuBuilderClient] fetchMenus CALLED - updateSelected=${updateSelected}, showLoading=${showLoading}`,
    );
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await fetch('/api/menus', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) {
        if (result.error?.includes('relation') || result.error?.includes('does not exist')) {
          throw new Error('DB_ERROR');
        } else {
          setError(result.error || result.message || 'Failed to fetch menus');
        }
        if (showLoading) {
          setLoading(false);
        }
      } else {
        const updatedMenus = result.menus || [];
        logger.dev(`[MenuBuilderClient] fetchMenus SUCCESS - Got ${updatedMenus.length} menus`, {
          menuIds: updatedMenus.map((m: Menu) => m.id),
        });

        setMenus(updatedMenus);
        cacheData('menu_builder_menus', updatedMenus);

        if (showLoading) {
          setLoading(false);
        }

        return { menus: updatedMenus, updateSelected: updateSelected || false };
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'DB_ERROR') {
        throw err;
      }
      setError('Failed to fetch menus. Please check your connection and try again.');
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  return {
    menus,
    setMenus,
    loading,
    error,
    setError,
    fetchMenus,
    cachedMenus,
  };
}
