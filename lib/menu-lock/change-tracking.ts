/**
 * Menu Lock Change Tracking Utilities
 * Tracks changes to dishes/recipes/ingredients while menus are locked
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { getLockedMenusUsingEntity } from './change-tracking/helpers/getLockedMenusUsingEntity';
import type {
  EntityType,
  ChangeType,
  ChangeDetails,
  MenuChangeTracking,
} from './change-tracking/types';

// Re-export types
export type { EntityType, ChangeType, ChangeDetails, MenuChangeTracking };

/**
 * Track a change for all locked menus using a specific entity
 */
export async function trackChangeForLockedMenus(
  entityType: EntityType,
  entityId: string,
  entityName: string,
  changeType: ChangeType,
  changeDetails: ChangeDetails,
  changedBy: string | null = null,
): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Menu Change Tracking] Supabase admin client not available');
    return;
  }

  try {
    const lockedMenuIds = await getLockedMenusUsingEntity(entityType, entityId);

    if (lockedMenuIds.length === 0) {
      return; // No locked menus using this entity
    }

    // Create change tracking records for each locked menu
    const changeRecords = lockedMenuIds.map(menuId => ({
      menu_id: menuId,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName,
      change_type: changeType,
      change_details: changeDetails,
      changed_by: changedBy,
      handled: false,
    }));

    const { error } = await supabaseAdmin.from('menu_change_tracking').insert(changeRecords);

    if (error) {
      logger.error('[Menu Change Tracking] Failed to track changes:', {
        entityType,
        entityId,
        entityName,
        changeType,
        lockedMenuIds,
        error: error.message,
      });
    } else {
      logger.dev(
        `[Menu Change Tracking] Tracked ${changeType} for ${entityName} (${entityType}) in ${lockedMenuIds.length} locked menu(s)`,
      );
    }
  } catch (err) {
    logger.error('[Menu Change Tracking] Error tracking changes:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { entityType, entityId, entityName, changeType, operation: 'trackChangeForLockedMenus' },
    });
  }
}

import {
  getMenuChanges,
  markChangesHandled,
  clearMenuChanges,
  isMenuLocked,
} from './change-tracking/helpers/menuChangeOperations';

// Re-export menu change operations
export { getMenuChanges, markChangesHandled, clearMenuChanges, isMenuLocked };
