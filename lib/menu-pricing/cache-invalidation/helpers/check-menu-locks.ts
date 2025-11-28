/**
 * Helpers to check menu lock status.
 */

import { isMenuLocked } from '@/lib/menu-lock/change-tracking';

/**
 * Check which menus are locked and unlocked.
 */
export async function checkMenuLocks(menuIds: string[]): Promise<{
  lockedMenuIds: Set<string>;
  unlockedMenuIds: Set<string>;
}> {
  const lockedMenuIds = new Set<string>();
  const unlockedMenuIds = new Set<string>();

  // Check lock status for each menu
  await Promise.all(
    menuIds.map(async menuId => {
      const locked = await isMenuLocked(menuId);
      if (locked) {
        lockedMenuIds.add(menuId);
      } else {
        unlockedMenuIds.add(menuId);
      }
    }),
  );

  return { lockedMenuIds, unlockedMenuIds };
}
