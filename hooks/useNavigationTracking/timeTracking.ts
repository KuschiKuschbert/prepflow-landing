/**
 * Utilities for tracking time spent on pages.
 */

import type { PendingLog } from './logStorage';
import { savePendingLogs } from './logStorage';

/**
 * Update time spent for the last log entry for a given href.
 *
 * @param {PendingLog[]} pendingLogs - Pending logs array
 * @param {string} href - Navigation href
 * @param {number} timeSpent - Time spent in milliseconds
 */
export function updateTimeSpentForLastLog(
  pendingLogs: PendingLog[],
  href: string,
  timeSpent: number,
): void {
  // Find the most recent log for this href
  for (let i = pendingLogs.length - 1; i >= 0; i--) {
    if (pendingLogs[i].href === href && !pendingLogs[i].synced) {
      pendingLogs[i].timeSpent = timeSpent;
      savePendingLogs(pendingLogs);
      break;
    }
  }
}
