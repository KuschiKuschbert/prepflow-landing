import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { calculateTemperatureAlerts } from './useKitchenAlertsHelpers';

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
      const cachedStats = getCachedData<any>('dashboard_stats');
      const cachedLogs = getCachedData<any[]>('dashboard_temperature_logs');
      const cachedEquipment = getCachedData<any[]>('dashboard_temperature_equipment');

      if (cachedStats) {
        setStats({
          ingredientsLowStock: cachedStats.ingredientsLowStock,
          recipesWithoutCost: cachedStats.recipesWithoutCost,
          temperatureChecksToday: cachedStats.temperatureChecksToday,
          cleaningTasksPending: cachedStats.cleaningTasksPending,
        });
      }

      if (cachedLogs && cachedEquipment) {
        const todayLogs = (cachedLogs || []).filter((log: any) => log.log_date === today);
        setTemperatureAlerts(calculateTemperatureAlerts(todayLogs, cachedEquipment));
        setLoading(false);
      }

      try {
        const [statsResponse, logsResult, equipmentResult] = await Promise.all([
          fetch('/api/dashboard/stats'),
          supabase
            .from('temperature_logs')
            .select('id, log_date, log_time, temperature_celsius, location')
            .eq('log_date', today)
            .order('log_time', { ascending: false }),
          supabase
            .from('temperature_equipment')
            .select('id, name, location, min_temp_celsius, max_temp_celsius')
            .eq('is_active', true),
        ]);

        if (statsResponse.ok) {
          const statsJson = await statsResponse.json();
          if (statsJson.success) {
            setStats({
              ingredientsLowStock: statsJson.ingredientsLowStock,
              recipesWithoutCost: statsJson.recipesWithoutCost,
              temperatureChecksToday: statsJson.temperatureChecksToday,
              cleaningTasksPending: statsJson.cleaningTasksPending,
            });
          }
        }

        if (
          !logsResult.error &&
          logsResult.data &&
          !equipmentResult.error &&
          equipmentResult.data
        ) {
          setTemperatureAlerts(
            calculateTemperatureAlerts(logsResult.data || [], equipmentResult.data || []),
          );
        }
      } catch (err) {
        console.error('Error fetching kitchen alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, temperatureAlerts, loading };
}
