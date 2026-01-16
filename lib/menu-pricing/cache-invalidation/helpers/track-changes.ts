/**
 * Helpers to track changes for locked menus.
 */

import { trackChangeForLockedMenus } from '@/lib/menu-lock/change-tracking';
import type { ChangeDetails, ChangeType } from '@/lib/menu-lock/change-tracking/types';

/**
 * Track changes for locked menus.
 */
export async function trackLockedMenuChanges(
  lockedMenuIds: Set<string>,
  entityType: 'recipe' | 'dish' | 'ingredient',
  entityId: string,
  entityName: string | undefined,
  changeType: ChangeType,
  changeDetails: ChangeDetails,
  changedBy: string | null,
): Promise<void> {
  if (lockedMenuIds.size > 0 && entityName) {
    await trackChangeForLockedMenus(
      entityType,
      entityId,
      entityName,
      changeType,
      changeDetails,
      changedBy,
    );
  }
}
