import { useNotification } from '@/contexts/NotificationContext';
import { MenuChangeTracking } from '@/lib/menu-lock/change-tracking';
import { Menu } from '@/lib/types/menu-builder';
import { useCallback, useMemo, useRef, useState } from 'react';
import { handleLockToggle as performLockToggle } from './useMenuLockManagement/helpers/handleLockToggle';
import { useLockStatusSync } from './useMenuLockManagement/helpers/useLockStatusSync';

interface MenuLockStatus {
  is_locked: boolean;
  locked_at?: string;
  locked_by?: string;
}

export function useMenuLockManagement(
  menu: Menu,
  onMenuUpdated: () => void,
): {
  menuLockStatus: MenuLockStatus;
  lockLoading: boolean;
  unlockChanges: MenuChangeTracking[] | null;
  showUnlockDialog: boolean;
  handleLockMenu: () => void;
  handleUnlockMenu: () => void;
  handleDismissChanges: () => void;
  handleCloseUnlockDialog: () => void;
  setUnlockChanges: React.Dispatch<React.SetStateAction<MenuChangeTracking[] | null>>;
  setShowUnlockDialog: React.Dispatch<React.SetStateAction<boolean>>;
} {
  const { showError, showSuccess } = useNotification();
  const [menuLockStatus, setMenuLockStatus] = useState<MenuLockStatus>({
    is_locked: menu.is_locked || false,
    locked_at: menu.locked_at,
    locked_by: menu.locked_by,
  });
  const [lockLoading, setLockLoading] = useState(false);
  const [unlockChanges, setUnlockChanges] = useState<MenuChangeTracking[] | null>(null);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const justUpdatedLockRef = useRef(false);
  const menuIdRef = useRef(menu.id);

  useLockStatusSync(menu, menuLockStatus, justUpdatedLockRef, menuIdRef, setMenuLockStatus);

  const handleLockToggle = useCallback(
    async (lock: boolean) => {
      setLockLoading(true);
      try {
        await performLockToggle({
          menuId: menu.id,
          lock,
          showError,
          showSuccess,
          onMenuUpdated,
          setMenuLockStatus,
          setUnlockChanges,
          setShowUnlockDialog,
          justUpdatedLockRef,
        });
      } finally {
        setLockLoading(false);
      }
    },
    [menu.id, showSuccess, showError, onMenuUpdated],
  );

  const handleLockMenu = useCallback(() => handleLockToggle(true), [handleLockToggle]);
  const handleUnlockMenu = useCallback(() => handleLockToggle(false), [handleLockToggle]);

  const handleDismissChanges = useCallback(() => {
    setUnlockChanges(null);
    setShowUnlockDialog(false);
  }, []);

  const handleCloseUnlockDialog = useCallback(() => {
    setShowUnlockDialog(false);
  }, []);

  return useMemo(
    () => ({
      menuLockStatus,
      lockLoading,
      unlockChanges,
      showUnlockDialog,
      handleLockMenu,
      handleUnlockMenu,
      handleDismissChanges,
      handleCloseUnlockDialog,
      setUnlockChanges,
      setShowUnlockDialog,
    }),
    [
      menuLockStatus,
      lockLoading,
      unlockChanges,
      showUnlockDialog,
      handleLockMenu,
      handleUnlockMenu,
      handleDismissChanges,
      handleCloseUnlockDialog,
    ],
  );
}
