import { useCallback } from 'react';
import { TemperatureEquipment, TemperatureLog } from '../types';

/**
 * Custom hook for temperature filtering logic
 */
export function useTemperatureFilters(
  allLogs: TemperatureLog[],
  timeFilter: '24h' | '7d' | '30d' | 'all',
  dateOffset: number,
) {
  const getFilteredLogs = useCallback(
    (equipment: TemperatureEquipment) => {
      // Match logs by location field matching equipment name OR equipment location
      let filtered = allLogs.filter(
        log => log.location === equipment.name || log.location === equipment.location,
      );

      const today = new Date();
      today.setDate(today.getDate() - dateOffset);

      if (timeFilter === '24h') {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        filtered = filtered.filter(log => {
          const logDateTime = new Date(`${log.log_date}T${log.log_time}`);
          return logDateTime >= twentyFourHoursAgo && logDateTime <= now;
        });
      } else if (timeFilter === '7d') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        filtered = filtered.filter(log => new Date(log.log_date) >= sevenDaysAgo);
      } else if (timeFilter === '30d') {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        filtered = filtered.filter(log => new Date(log.log_date) >= thirtyDaysAgo);
      }

      return filtered;
    },
    [allLogs, timeFilter, dateOffset],
  );

  const hasDataForTimeFilter = useCallback(
    (filter: '24h' | '7d' | '30d' | 'all') => {
      const today = new Date();
      today.setDate(today.getDate() - dateOffset);

      let filteredLogs = allLogs;
      if (filter === '24h') {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        filteredLogs = allLogs.filter(log => {
          const logDateTime = new Date(`${log.log_date}T${log.log_time}`);
          return logDateTime >= twentyFourHoursAgo && logDateTime <= now;
        });
      } else if (filter === '7d') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        filteredLogs = allLogs.filter(log => new Date(log.log_date) >= sevenDaysAgo);
      } else if (filter === '30d') {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        filteredLogs = allLogs.filter(log => new Date(log.log_date) >= thirtyDaysAgo);
      }

      return filteredLogs.length > 0;
    },
    [allLogs, dateOffset],
  );

  return { getFilteredLogs, hasDataForTimeFilter };
}
