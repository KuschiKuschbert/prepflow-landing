import { useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import type { Menu } from '@/app/webapp/menu-builder/types';
import { fetchMenuLockStatus } from './fetchLockStatus';

interface MenuLockStatus {
  is_locked: boolean;
  locked_at?: string;
  locked_by?: string;
}

export function useLockStatusSync(
  menu: Menu,
  menuLockStatus: MenuLockStatus,
  justUpdatedLockRef: React.MutableRefObject<boolean>,
  menuIdRef: React.MutableRefObject<string>,
  setMenuLockStatus: React.Dispatch<React.SetStateAction<MenuLockStatus>>,
) {
  const prevMenuIsLockedRef = useRef(menu.is_locked);

  useEffect(() => {
    if (menuIdRef.current !== menu.id) {
      logger.dev(`[MenuEditor] menuIdRef updated: ${menuIdRef.current} → ${menu.id}`);
      menuIdRef.current = menu.id;
    }
  }, [menu.id, menuIdRef]);

  useEffect(() => {
    logger.dev(`[MenuEditor] useEffect [menu.id, menu.is_locked] triggered`, {
      menuId: menu.id,
      menuIsLocked: menu.is_locked,
      prevMenuIsLocked: prevMenuIsLockedRef.current,
      currentLockStatus: menuLockStatus.is_locked,
      justUpdatedLock: justUpdatedLockRef.current,
    });

    if (justUpdatedLockRef.current) {
      logger.dev('[MenuEditor] useEffect SKIPPED - justUpdatedLockRef is true');
      prevMenuIsLockedRef.current = menu.is_locked;
      return;
    }

    if (prevMenuIsLockedRef.current !== menu.is_locked) {
      logger.dev('[MenuEditor] useEffect - Menu lock status prop changed, fetching...', {
        prevMenuIsLocked: prevMenuIsLockedRef.current,
        newMenuIsLocked: menu.is_locked,
        currentLockStatus: menuLockStatus.is_locked,
      });
      prevMenuIsLockedRef.current = menu.is_locked;
      fetchMenuLockStatus(menuIdRef.current, justUpdatedLockRef).then(newStatus => {
        if (newStatus) {
          logger.dev(`[MenuEditor] fetchMenuLockStatus SUCCESS - Setting lock status:`, newStatus);
          setMenuLockStatus(prevStatus => {
            if (
              prevStatus.is_locked !== newStatus.is_locked ||
              prevStatus.locked_at !== newStatus.locked_at ||
              prevStatus.locked_by !== newStatus.locked_by
            ) {
              logger.dev('[MenuEditor] fetchMenuLockStatus - Status changed, updating');
              return newStatus;
            }
            logger.dev('[MenuEditor] fetchMenuLockStatus - Status unchanged, keeping previous');
            return prevStatus;
          });
        }
      });
    } else {
      logger.dev('[MenuEditor] useEffect - Menu lock status prop unchanged, skipping fetch');
    }
  }, [
    menu.id,
    menu.is_locked,
    menuLockStatus.is_locked,
    menuIdRef,
    justUpdatedLockRef,
    setMenuLockStatus,
  ]);
}
