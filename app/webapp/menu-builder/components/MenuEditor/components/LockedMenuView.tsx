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
  onUnlock: () => void;
}

export function LockedMenuView({ menu, menuLockStatus, menuItems, onUnlock }: LockedMenuViewProps) {
  const isLocked = menuLockStatus.is_locked || menu.is_locked || false;

  if (!isLocked) return null;

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
