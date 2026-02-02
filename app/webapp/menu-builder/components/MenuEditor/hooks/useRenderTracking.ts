import { logger } from '@/lib/logger';
import { useEffect, useRef } from 'react';
import { Menu } from '@/lib/types/menu-builder';

export function useRenderTracking(menu: Menu) {
  const prevMenuRef = useRef(menu);
  const renderCountRef = useRef(0);

  renderCountRef.current += 1;
  const renderId = renderCountRef.current;

  useEffect(() => {
    const prevMenu = prevMenuRef.current;
    const changes: string[] = [];

    if (prevMenu.id !== menu.id) changes.push(`menu.id: ${prevMenu.id} → ${menu.id}`);
    if (prevMenu.is_locked !== menu.is_locked)
      changes.push(`menu.is_locked: ${prevMenu.is_locked} → ${menu.is_locked}`);
    if (prevMenu.locked_at !== menu.locked_at) changes.push(`menu.locked_at changed`);
    if (prevMenu.menu_name !== menu.menu_name) changes.push(`menu.menu_name changed`);
    if (prevMenu.updated_at !== menu.updated_at) changes.push(`menu.updated_at changed`);

    if (changes.length > 0) {
      logger.dev(`[MenuEditor] Render #${renderId} - Props changed:`, {
        changes,
        menuId: menu.id,
        isLocked: menu.is_locked,
      });
    } else {
      logger.dev(`[MenuEditor] Render #${renderId} - No prop changes detected`, {
        menuId: menu.id,
        isLocked: menu.is_locked,
      });
    }

    prevMenuRef.current = menu;
  }, [menu, renderId]);
}
