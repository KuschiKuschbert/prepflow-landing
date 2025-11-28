import { useMemo, useRef } from 'react';
import { logger } from '@/lib/logger';
import type { MenuItem } from '@/app/webapp/menu-builder/types';
import { processMenuItem } from './useMenuItemsWithAllergens/helpers/processMenuItem';

export interface MenuItemWithAllergens {
  id: string;
  menuItemId: string;
  name: string;
  type: 'dish' | 'recipe';
  allergens: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  dietaryConfidence?: string;
  category?: string;
  price: number;
}

export function useMenuItemsWithAllergens(
  menuItems: MenuItem[],
  menuId: string,
): MenuItemWithAllergens[] {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  const renderId = renderCountRef.current;

  return useMemo(() => {
    logger.dev(`[MenuLockedView] useMemo RECALCULATING menuItemsWithAllergens`, {
      itemCount: menuItems.length,
      menuId,
      renderId,
    });

    return menuItems.map(item => processMenuItem(item));
  }, [menuItems, menuId, renderId]);
}
