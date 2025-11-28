import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { calculateTemperatureAlerts } from './useKitchenAlertsHelpers';

import { logger } from '@/lib/logger';
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
        let statsResponse: Response | null = null;
        try {
          statsResponse = await fetch('/api/dashboard/stats', { cache: 'no-store' });
        } catch (fetchError) {
          logger.error('Network error fetching kitchen alerts:', fetchError);
          // Keep cached data if available
          setLoading(false);
          return;
        }

        const [logsResult, equipmentResult] = await Promise.all([
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
          try {
            const statsJson = await statsResponse.json();
            if (statsJson.success) {
              setStats({
                ingredientsLowStock: statsJson.ingredientsLowStock,
                recipesWithoutCost: statsJson.recipesWithoutCost,
                temperatureChecksToday: statsJson.temperatureChecksToday,
                cleaningTasksPending: statsJson.cleaningTasksPending,
              });
            }
          } catch (parseError) {
            logger.error('Error parsing kitchen alerts stats:', parseError);
          }
        } else {
          logger.error('Error fetching kitchen alerts stats:', {
            status: statsResponse.status,
            statusText: statsResponse.statusText,
          });
        }

        // Log Supabase errors but still try to use data if available
        if (logsResult.error) {
          logger.error('Error fetching temperature logs for alerts:', logsResult.error);
        }
        if (equipmentResult.error) {
          logger.error('Error fetching temperature equipment for alerts:', equipmentResult.error);
        }

        // Use data if available (even if there were errors)
        if (
          !logsResult.error &&
          logsResult.data &&
          !equipmentResult.error &&
          equipmentResult.data
        ) {
          setTemperatureAlerts(
            calculateTemperatureAlerts(logsResult.data || [], equipmentResult.data || []),
          );
        } else if (cachedLogs && cachedEquipment) {
          // Fallback to cached data if fresh fetch failed
          const todayLogs = (cachedLogs || []).filter((log: any) => log.log_date === today);
          setTemperatureAlerts(calculateTemperatureAlerts(todayLogs, cachedEquipment));
        }
      } catch (err) {
        logger.error('Error fetching kitchen alerts:', err);

        // Check if it's a network error
        if (err instanceof TypeError && err.message.includes('fetch')) {
          logger.error(
            'Network error: Unable to connect to server. Using cached data if available.',
          );
          // Keep cached data if available
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, temperatureAlerts, loading };
}
