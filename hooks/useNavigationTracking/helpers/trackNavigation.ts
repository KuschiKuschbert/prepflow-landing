/**
 * Track navigation click logic.
 */
import { saveUsageLog } from '@/lib/navigation-optimization/localStorage';
import { getAdaptiveNavSettings } from '@/lib/navigation-optimization/store';
import type { PendingLog } from '../logStorage';
import { savePendingLogs } from '../logStorage';
import { calculateReturnFrequency, saveVisitCounts } from '../visitCounts';

const MAX_LOCAL_LOGS = 1000;

export function createTrackNavigationHandler(
  pendingLogsRef: React.MutableRefObject<PendingLog[]>,
  visitCountsRef: React.MutableRefObject<Map<string, number>>,
  previousPathRef: React.MutableRefObject<string | null>,
  pageStartTimeRef: React.MutableRefObject<number>,
  syncPendingLogsWrapper: (isUnload?: boolean) => Promise<void>,
) {
  return (href: string) => {
    const settings = getAdaptiveNavSettings();
    if (!settings.enabled) return;
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hourOfDay = now.getHours();
    const currentCount = visitCountsRef.current.get(href) || 0;
    visitCountsRef.current.set(href, currentCount + 1);
    saveVisitCounts(visitCountsRef.current);
    const returnFrequency = calculateReturnFrequency(href, visitCountsRef.current);
    const logEntry: PendingLog = {
      href,
      timestamp: now.getTime(),
      dayOfWeek,
      hourOfDay,
      returnFrequency,
      synced: false,
    };
    pendingLogsRef.current.push(logEntry);
    if (pendingLogsRef.current.length > MAX_LOCAL_LOGS) {
      pendingLogsRef.current = pendingLogsRef.current.slice(-MAX_LOCAL_LOGS);
    }
    savePendingLogs(pendingLogsRef.current);
    saveUsageLog(logEntry);
    previousPathRef.current = href;
    pageStartTimeRef.current = Date.now();
    syncPendingLogsWrapper(false).catch(() => {});
  };
}
