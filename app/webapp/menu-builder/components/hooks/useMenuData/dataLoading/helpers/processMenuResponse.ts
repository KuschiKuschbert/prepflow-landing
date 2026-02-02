/**
 * Process menu response and update state.
 */
import { cacheData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import type { Menu, MenuItem, MenuStatistics } from '@/lib/types/menu-builder';

interface MenuApiResponse {
  success: boolean;
  menu: Menu & { items: MenuItem[] };
  message?: string;
  error?: string;
}

interface StatsApiResponse {
  success: boolean;
  statistics: MenuStatistics;
  message?: string;
  error?: string;
}

interface ProcessMenuResponseParams {
  menuResponse: Response;
  menuData: MenuApiResponse;
  menuId: string;
  menuCacheKey: string;
  statsData: StatsApiResponse;
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  onError?: (message: string) => void;
}

export function processMenuResponse({
  menuResponse,
  menuData,
  menuId,
  menuCacheKey,
  statsData,
  setMenuItems,
  setCategories,
  onError,
}: ProcessMenuResponseParams): boolean {
  if (!menuResponse.ok) {
    logger.error('Failed to load menu:', {
      error: menuData.error || menuData.message,
      status: menuResponse.status,
      menuId,
      fullResponse: menuData,
    });
    onError?.(`Failed to load menu: ${menuData.error || menuData.message || 'Unknown error'}`);
    return false;
  }
  if (menuData.success) {
    const items = menuData.menu.items || [];
    setMenuItems(items);
    const uniqueCategories = Array.from(
      new Set(items.map((item: MenuItem) => item.category || 'Uncategorized')),
    ) as string[];
    const finalCategories = uniqueCategories.length > 0 ? uniqueCategories : ['Uncategorized'];
    setCategories(finalCategories);
    cacheData(menuCacheKey, {
      menuItems: items,
      categories: finalCategories,
      statistics: statsData.success ? statsData.statistics : null,
    });
  }
  return true;
}
