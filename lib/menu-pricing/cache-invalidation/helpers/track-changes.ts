/**
 * Helpers to track changes for locked menus.
 */

import { trackChangeForLockedMenus } from '@/lib/menu-lock/change-tracking';

/**
 * Track changes for locked menus.
 */
export async function trackLockedMenuChanges(
  lockedMenuIds: Set<string>,
  entityType: 'recipe' | 'dish' | 'ingredient',
  entityId: string,
  entityName: string | undefined,
  changeType: string,
  changeDetails: any,
  changedBy: string | null,
): Promise<void> {
  if (lockedMenuIds.size > 0 && entityName) {
    await trackChangeForLockedMenus(
      entityType,
      entityId,
      entityName,
      changeType as any,
      changeDetails,
      changedBy,
    );
  }
}
