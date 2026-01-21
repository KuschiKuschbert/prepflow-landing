import { logger } from '@/lib/logger';
import { triggerEmployeeSync } from '@/lib/square/sync/hooks';
import { NextRequest } from 'next/server';

export function triggerEmployeeSyncHook(request: NextRequest, employeeId: string) {
  (async () => {
    try {
      await triggerEmployeeSync(request, employeeId, 'update');
    } catch (err) {
      logger.error('[Staff Employees API] Error triggering Square sync:', {
        error: err instanceof Error ? err.message : String(err),
        employeeId,
      });
    }
  })();
}
