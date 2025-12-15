/**
 * Update logs from query data.
 */
import { logger } from '@/lib/logger';
import type { TemperatureLog } from '../../types';

export function updateLogsFromQueryHelper(
  logsData: any,
  setLogs: (logs: TemperatureLog[]) => void,
): void {
  if (logsData) {
    const items = Array.isArray(logsData) ? logsData : logsData?.items || [];
    setLogs(items);
    logger.dev('[TemperaturePageData] Updated logs:', {
      count: items.length,
      hasData: !!logsData,
      logsDataType: typeof logsData,
      logsDataKeys: logsData ? Object.keys(logsData) : [],
    });
  } else {
    logger.dev('[TemperaturePageData] logsData is undefined');
    setLogs([]);
  }
}
