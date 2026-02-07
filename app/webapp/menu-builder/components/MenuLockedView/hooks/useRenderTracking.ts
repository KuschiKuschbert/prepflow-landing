import { logger } from '@/lib/logger';
import type { Menu, MenuItem } from '@/lib/types/menu-builder';
import { useEffect, useRef } from 'react';

export function useRenderTracking(menu: Menu, menuItems: MenuItem[]) {
  const prevMenuRef = useRef(menu);
  const prevMenuItemsRef = useRef(menuItems);
  const renderCountRef = useRef(0);

  renderCountRef.current += 1;
  const renderId = renderCountRef.current;

  useEffect(() => {
    const prevMenu = prevMenuRef.current;
    const prevMenuItems = prevMenuItemsRef.current;
    const changes: string[] = [];

    if (prevMenu.id !== menu.id) changes.push(`menu.id: ${prevMenu.id} → ${menu.id}`);
    if (prevMenu.is_locked !== menu.is_locked)
      changes.push(`menu.is_locked: ${prevMenu.is_locked} → ${menu.is_locked}`);
    if (prevMenu.locked_at !== menu.locked_at) changes.push(`menu.locked_at changed`);
    if (prevMenu.menu_name !== menu.menu_name) changes.push(`menu.menu_name changed`);
    if (prevMenuItems.length !== menuItems.length)
      changes.push(`menuItems.length: ${prevMenuItems.length} → ${menuItems.length}`);
    if (prevMenuItems !== menuItems) {
      const itemIdsChanged =
        prevMenuItems.map(i => i.id).join(',') !== menuItems.map(i => i.id).join(',');
      if (itemIdsChanged) changes.push(`menuItems IDs changed`);
      else changes.push(`menuItems reference changed (same content)`);
    }

    if (changes.length > 0) {
      logger.dev(`[MenuLockedView] Render #${renderId} - Props changed:`, {
        changes,
        menuId: menu.id,
        menuItemsLength: menuItems.length,
        prevMenuItemsLength: prevMenuItems.length,
        menuItemsRefChanged: prevMenuItems !== menuItems,
      });
    } else {
      logger.dev(`[MenuLockedView] Render #${renderId} - No prop changes detected`, {
        menuId: menu.id,
        menuItemsLength: menuItems.length,
      });
    }

    prevMenuRef.current = menu;
    prevMenuItemsRef.current = menuItems;
  }, [menu, menuItems]);

  return renderId;
}
