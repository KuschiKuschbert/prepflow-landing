/**
 * Refresh logs handler.
 */

import { logger } from '@/lib/logger';
import type { TemperatureEquipment } from '../../types';

interface RefreshLogsProps {
  fetchAllLogs: (limit?: number, forceRefresh?: boolean) => Promise<void>;
  fetchEquipment: () => Promise<void>;
  queryClient: any;
  equipment: TemperatureEquipment[];
}

/**
 * Handle refresh logs operation.
 *
 * @param {RefreshLogsProps} props - Refresh logs props
 */
export async function handleRefreshLogs({
  fetchAllLogs,
  fetchEquipment,
  queryClient,
  equipment,
}: RefreshLogsProps): Promise<void> {
  logger.dev('🔄 Refreshing logs after generation...');
  await fetchAllLogs(1000, true);
  await fetchEquipment();
  queryClient.invalidateQueries({ queryKey: ['temperature-logs'] });
  equipment.forEach(eq => {
    const cacheKey = `equipment_logs_${eq.name}`;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(cacheKey);
    }
  });
}
