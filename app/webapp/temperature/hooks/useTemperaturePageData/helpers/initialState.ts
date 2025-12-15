/**
 * Initial state for temperature page data.
 */
import { getCachedData } from '@/lib/cache/data-cache';
import type { TemperatureEquipment, TemperatureLog } from '../../../types';

export function createInitialState() {
  return {
    logs: [] as TemperatureLog[],
    allLogs: (getCachedData<TemperatureLog[]>('temperature_all_logs') || []) as TemperatureLog[],
    equipment: (getCachedData<TemperatureEquipment[]>('temperature_equipment') ||
      []) as TemperatureEquipment[],
    loading: false,
    analyticsLoading: false,
    lastAnalyticsFetch: 0,
    selectedDate: '',
    selectedType: 'all',
    page: 1,
    pageSize: 20,
  };
}
