import { logger } from '@/lib/logger';
import { Menu } from '@/types/menu-builder';
import { useCallback, useRef } from 'react';

interface UseMenuHandlersProps {
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  selectedMenu: Menu | null;
  setSelectedMenu: (menu: Menu | null) => void;
  fetchMenus: (updateSelected?: boolean, showLoading?: boolean) => Promise<any>;
}

/**
 * Hook for managing menu-related handlers (create, edit, select, save, update, delete)
 */
export function useMenuHandlers({
  menus,
  setMenus,
  selectedMenu,
  setSelectedMenu,
  fetchMenus,
}: UseMenuHandlersProps) {
  const selectedMenuRef = useRef<Menu | null>(selectedMenu);
  const setSelectedMenuRef = useRef(setSelectedMenu);
  selectedMenuRef.current = selectedMenu;
  setSelectedMenuRef.current = setSelectedMenu;

  const handleCreateMenu = useCallback(() => {
    return { editingMenu: null, showMenuForm: true };
  }, []);

  const handleEditMenu = useCallback((menu: Menu) => {
    return { editingMenu: menu, showMenuForm: true };
  }, []);

  const handleSelectMenu = useCallback(
    (menu: Menu) => {
      if (selectedMenuRef.current?.id !== menu.id) {
        setSelectedMenuRef.current(menu);
      }
    },
    [setSelectedMenuRef],
  );

  const handleMenuSaved = useCallback(
    (savedMenu: Menu) => {
      setMenus(prevMenus => {
        const existingIndex = prevMenus.findIndex(m => m.id === savedMenu.id);
        if (existingIndex >= 0) {
          const updated = prevMenus.map(m => (m.id === savedMenu.id ? savedMenu : m));
          if (selectedMenuRef.current?.id === savedMenu.id) {
            const currentMenu = selectedMenuRef.current;
            if (
              currentMenu.menu_name !== savedMenu.menu_name ||
              currentMenu.description !== savedMenu.description ||
              currentMenu.updated_at !== savedMenu.updated_at
            ) {
              setSelectedMenuRef.current(savedMenu);
            }
          }
          return updated;
        }
        return [...prevMenus, savedMenu];
      });
      return { showMenuForm: false, editingMenu: null };
    },
    [setMenus, setSelectedMenuRef],
  );

  const handleMenuUpdated = useCallback(() => {
    logger.dev(
      '[MenuBuilderClient] handleMenuUpdated CALLED - Calling fetchMenus with updateSelected=true',
    );
    // Update both menus list and selected menu if one is selected
    fetchMenus(true);
  }, [fetchMenus]);

  const handleDeleteMenu = useCallback(
    (deletedMenuId: string) => {
      if (selectedMenuRef.current?.id === deletedMenuId) {
        setSelectedMenuRef.current(null);
      }
    },
    [setSelectedMenuRef],
  );

  const handleBack = useCallback(() => {
    logger.dev('[MenuBuilderClient] handleBack CALLED - Refreshing menus list');
    // Refresh menus list to show updated lock status and print buttons
    fetchMenus(false);
  }, [fetchMenus]);

  return {
    handleCreateMenu,
    handleEditMenu,
    handleSelectMenu,
    handleMenuSaved,
    handleMenuUpdated,
    handleDeleteMenu,
    handleBack,
  };
}
