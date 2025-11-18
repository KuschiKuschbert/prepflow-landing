/**
 * Utilities for managing navigation log storage.
 */

import type { NavigationUsageLog } from '@/lib/navigation-optimization/schema';

const STORAGE_KEY = 'prepflow-nav-pending-logs';
const MAX_LOCAL_LOGS = 1000;

export interface PendingLog extends NavigationUsageLog {
  synced?: boolean;
}

/**
 * Save pending logs to localStorage.
 *
 * @param {PendingLog[]} logs - Logs to save
 */
export function savePendingLogs(logs: PendingLog[]): void {
  if (typeof window === 'undefined') return;
  try {
    const logsToSave = logs.slice(-MAX_LOCAL_LOGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logsToSave));
  } catch {
    // Storage quota exceeded, ignore
  }
}

/**
 * Load pending logs from localStorage.
 *
 * @returns {PendingLog[]} Loaded logs
 */
export function loadPendingLogs(): PendingLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const logs = JSON.parse(stored) as PendingLog[];
      return logs.filter(log => !log.synced).slice(-MAX_LOCAL_LOGS);
    }
  } catch {
    // Invalid stored data, start fresh
  }
  return [];
}
