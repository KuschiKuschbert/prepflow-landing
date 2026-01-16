import { getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';
import type { TemperatureEquipment, TemperatureLog } from '../../temperature/types';
import { fetchKitchenAlertsStats } from './useKitchenAlertsData/fetchStats';
import { fetchTemperatureAlerts } from './useKitchenAlertsData/fetchTemperature';
import { calculateTemperatureAlerts } from './useKitchenAlertsHelpers';

/**
 * Hook for fetching kitchen alerts data
 *
 * @returns {Object} Stats, temperature alerts, and loading state
 */
export function useKitchenAlertsData() {
  const [stats, setStats] = useState<{
    ingredientsLowStock?: number;
    recipesWithoutCost?: number;
    temperatureChecksToday?: number;
    cleaningTasksPending?: number;
  }>({});
  const [temperatureAlerts, setTemperatureAlerts] = useState<
    Array<{
      id: string;
      message: string;
      severity: 'critical' | 'warning';
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split('T')[0];
      const cachedStats = getCachedData<Record<string, any>>('dashboard_stats');
      const cachedLogs = getCachedData<TemperatureLog[]>('dashboard_temperature_logs');
      const cachedEquipment = getCachedData<TemperatureEquipment[]>(
        'dashboard_temperature_equipment',
      );

      if (cachedStats) {
        setStats({
          ingredientsLowStock: cachedStats.ingredientsLowStock,
          recipesWithoutCost: cachedStats.recipesWithoutCost,
          temperatureChecksToday: cachedStats.temperatureChecksToday,
          cleaningTasksPending: cachedStats.cleaningTasksPending,
        });
      }

      if (cachedLogs && cachedEquipment) {
        const todayLogs = (cachedLogs || []).filter(
          (log: TemperatureLog) => log.log_date === today,
        );
        setTemperatureAlerts(calculateTemperatureAlerts(todayLogs, cachedEquipment));
        setLoading(false);
      }

      try {
        const freshStats = await fetchKitchenAlertsStats();
        if (freshStats) setStats(freshStats);

        const alerts = await fetchTemperatureAlerts(
          today,
          cachedLogs || undefined,
          cachedEquipment || undefined,
        );
        setTemperatureAlerts(alerts);
      } catch (err) {
        logger.error('Error fetching kitchen alerts:', err);
        if (err instanceof TypeError && err.message.includes('fetch')) {
          logger.error(
            'Network error: Unable to connect to server. Using cached data if available.',
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, temperatureAlerts, loading };
}
