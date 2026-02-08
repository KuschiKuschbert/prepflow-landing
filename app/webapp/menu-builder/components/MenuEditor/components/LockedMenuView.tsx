import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { logger } from '@/lib/logger';
import { Menu, MenuItem } from '@/lib/types/menu-builder';
import { MenuLockedView } from '../../MenuLockedView';

interface LockedMenuViewProps {
  menu: Menu;
  menuLockStatus: {
    is_locked: boolean;
    locked_at?: string;
    locked_by?: string;
  };
  menuItems: MenuItem[];
  loading: boolean;
  onUnlock: () => void;
}

export function LockedMenuView({
  menu,
  menuLockStatus,
  menuItems,
  loading,
  onUnlock,
}: LockedMenuViewProps) {
  const isLocked = menuLockStatus.is_locked || menu.is_locked || false;

  if (!isLocked) return null;

  // Show loading skeleton ONLY when data is loading AND menuItems is empty
  // If we have menuItems, show them even if loading is still true (data is ready)
  if (loading && menuItems.length === 0) {
    logger.dev('[LockedMenuView] Showing loading skeleton', {
      menuId: menu.id,
      loading,
      menuItemsCount: menuItems.length,
    });
    return <PageSkeleton />;
  }

  // If we have menuItems, show them (even if loading is still true - data is ready)
  logger.dev('[LockedMenuView] Rendering content', {
    menuId: menu.id,
    loading,
    menuItemsCount: menuItems.length,
  });

  const lockedMenu: Menu = {
    ...menu,
    is_locked: true,
    locked_at: menu.locked_at || menuLockStatus.locked_at,
    locked_by: menu.locked_by || menuLockStatus.locked_by,
  };

  return (
    <div>
      <MenuLockedView menu={lockedMenu} menuItems={menuItems} onUnlock={onUnlock} />
    </div>
  );
}
