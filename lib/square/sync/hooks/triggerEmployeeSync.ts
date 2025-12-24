/**
 * Trigger Square sync for an employee after create/update.
 */
import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { getUserIdFromRequest } from './helpers/getUserIdFromRequest';
import { shouldTriggerAutoSync } from './helpers/shouldTriggerAutoSync';
import { getSquareConfig } from '../../config';
import { queueSyncOperation } from '../auto-sync-queue';

/**
 * Trigger Square sync for an employee after create/update.
 */
export async function triggerEmployeeSync(
  req: NextRequest,
  employeeId: string,
  operation: 'create' | 'update',
): Promise<void> {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      logger.dev('[Square Sync Hooks] No user ID, skipping employee sync');
      return;
    }

    const shouldSync = await shouldTriggerAutoSync(userId);
    if (!shouldSync) {
      logger.dev('[Square Sync Hooks] Auto-sync disabled, skipping employee sync');
      return;
    }

    const config = await getSquareConfig(userId);
    if (!config?.auto_sync_staff) {
      logger.dev('[Square Sync Hooks] Staff auto-sync disabled, skipping');
      return;
    }

    // Queue sync operation
    await queueSyncOperation({
      user_id: userId,
      entity_type: 'employee',
      entity_id: employeeId,
      operation,
      direction:
        config.auto_sync_direction === 'bidirectional' ? 'bidirectional' : 'prepflow_to_square',
      priority: 'normal',
    });

    logger.dev(`[Square Sync Hooks] Queued ${operation} sync for employee: ${employeeId}`);
  } catch (error) {
    // Don't throw - sync failures shouldn't break the main operation
    logger.error('[Square Sync Hooks] Error triggering employee sync:', {
      error: error instanceof Error ? error.message : String(error),
      employeeId,
    });
  }
}
