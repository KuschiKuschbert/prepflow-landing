import { getCachedData } from '@/lib/cache/data-cache';
import { useCallback, useEffect, useState } from 'react';
import { TemperatureLog } from '../types';
import { createFilterLogsByTime } from './useEquipmentLogs/helpers/filterLogsByTime';
import { fetchEquipmentLogsHelper } from './useEquipmentLogs/helpers/fetchLogs';
import { initializeLogsHelper } from './useEquipmentLogs/helpers/initializeLogs';
interface UseEquipmentLogsOptions {
  equipmentName: string | null;
  equipmentLocation?: string | null;
  timeFilter: '24h' | '7d' | '30d' | 'all';
}
export function useEquipmentLogs({
  equipmentName,
  equipmentLocation,
  timeFilter,
}: UseEquipmentLogsOptions) {
  const [logs, setLogs] = useState<TemperatureLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filterLogsByTime = useCallback(createFilterLogsByTime(timeFilter), [timeFilter]);
  useEffect(() => {
    const initResult = initializeLogsHelper(equipmentName, filterLogsByTime, setLogs, setIsLoading);
    if (!initResult) return;
    setError(null);
    fetchEquipmentLogsHelper(equipmentName, equipmentLocation, filterLogsByTime, setLogs, setIsLoading, setError, initResult.cachedLogs);
  }, [equipmentName, equipmentLocation, filterLogsByTime]);
  useEffect(() => {
    if (!equipmentName) return;
    const cachedLogs = getCachedData<TemperatureLog[]>(`equipment_logs_${equipmentName}`);
    if (cachedLogs) setLogs(filterLogsByTime(cachedLogs));
  }, [timeFilter, equipmentName, filterLogsByTime]);
  return { logs, isLoading, error };
}
