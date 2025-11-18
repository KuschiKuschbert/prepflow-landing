/**
 * Utilities for syncing navigation logs to server.
 */

import { getAdaptiveNavSettings } from '@/lib/navigation-optimization/store';
import { logger } from '@/lib/logger';
import type { PendingLog } from './logStorage';
import { savePendingLogs } from './logStorage';

/**
 * Sync pending logs to server.
 *
 * @param {PendingLog[]} pendingLogs - Pending logs array (will be modified)
 * @param {boolean} isUnload - Whether this is an unload sync
 * @returns {Promise<void>}
 */
export async function syncPendingLogs(
  pendingLogs: PendingLog[],
  isUnload = false,
): Promise<void> {
  const settings = getAdaptiveNavSettings();
  if (!settings.enabled) {
    return; // Don't sync if feature is disabled
  }

  const logsToSync = pendingLogs.filter(log => !log.synced);
  if (logsToSync.length === 0) {
    return;
  }

  // Sync logs one at a time (to avoid overwhelming the server)
  for (const log of logsToSync) {
    try {
      const response = await fetch('/api/navigation-optimization/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });

      if (response.ok) {
        log.synced = true;
      } else if (!isUnload) {
        // Don't log errors on unload
        logger.error('[Navigation Tracking] Failed to sync log:', {
          status: response.status,
          href: log.href,
        });
        // Stop syncing on error to avoid spam
        break;
      }
    } catch (error) {
      if (!isUnload) {
        logger.error('[Navigation Tracking] Error syncing log:', {
          error: error instanceof Error ? error.message : String(error),
          href: log.href,
        });
      }
      // Stop syncing on error to avoid spam
      break;
    }
  }

  // Remove synced logs and save
  const unsyncedLogs = pendingLogs.filter(log => !log.synced);
  pendingLogs.length = 0;
  pendingLogs.push(...unsyncedLogs);
  savePendingLogs(pendingLogs);
}
