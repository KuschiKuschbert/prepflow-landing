/**
 * Filter logs by time range.
 */
import type { TemperatureLog } from '../../types';

export function createFilterLogsByTime(timeFilter: '24h' | '7d' | '30d' | 'all') {
  return (allLogs: TemperatureLog[]): TemperatureLog[] => {
    if (timeFilter === 'all') return allLogs;
    const now = new Date();
    const daysMap = { '24h': 1, '7d': 7, '30d': 30 };
    const days = daysMap[timeFilter];
    if (days === 1) {
      const cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return allLogs.filter(log => {
        const logDateTime = new Date(`${log.log_date}T${log.log_time}`);
        return logDateTime >= cutoffDate && logDateTime <= now;
      });
    }
    const cutoffDate = new Date(now);
    cutoffDate.setDate(now.getDate() - days);
    return allLogs.filter(log => new Date(log.log_date) >= cutoffDate);
  };
}
