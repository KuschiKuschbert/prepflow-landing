import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

import { logger } from '@/lib/logger';

function calculateOutOfRange(todayLogs: any[], equipment: any[]): number {
  return todayLogs.filter((log: any) => {
    const eq = equipment.find((e: any) => e.location === log.location);
    if (!eq || eq.min_temp_celsius === null || eq.max_temp_celsius === null) return false;
    return (
      log.temperature_celsius < eq.min_temp_celsius || log.temperature_celsius > eq.max_temp_celsius
    );
  }).length;
}

export function useTemperatureStatus() {
  const [temperatureChecksToday, setTemperatureChecksToday] = useState(0);
  const [activeEquipment, setActiveEquipment] = useState(0);
  const [outOfRangeAlerts, setOutOfRangeAlerts] = useState(0);
  const [lastCheckTime, setLastCheckTime] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split('T')[0];
      const cachedStats = getCachedData<any>('dashboard_stats');
      const cachedLogs = getCachedData<any[]>('dashboard_temperature_logs');
      const cachedEquipment = getCachedData<any[]>('dashboard_temperature_equipment');

      if (cachedStats && cachedLogs && cachedEquipment) {
        setTemperatureChecksToday(cachedStats.temperatureChecksToday || 0);
        setActiveEquipment(cachedEquipment.length || 0);
        setOutOfRangeAlerts(
          calculateOutOfRange(
            (cachedLogs || []).filter((log: any) => log.log_date === today),
            cachedEquipment,
          ),
        );
        if (cachedLogs.length > 0) {
          const lastLog = cachedLogs[0];
          setLastCheckTime(
            lastLog.log_date && lastLog.log_time
              ? `${lastLog.log_date}T${lastLog.log_time}`
              : lastLog.created_at,
          );
        }
        setLoading(false);
      }

      try {
        const [statsResponse, logsResult, equipmentResult] = await Promise.all([
          fetch('/api/dashboard/stats'),
          supabase
            .from('temperature_logs')
            .select('id, log_date, log_time, temperature_celsius, location, created_at')
            .order('log_date', { ascending: false })
            .order('log_time', { ascending: false })
            .limit(20),
          supabase
            .from('temperature_equipment')
            .select('id, location, min_temp_celsius, max_temp_celsius')
            .eq('is_active', true),
        ]);

        if (statsResponse.ok) {
          const statsJson = await statsResponse.json();
          if (statsJson.success) setTemperatureChecksToday(statsJson.temperatureChecksToday || 0);
        }
        if (!logsResult.error && logsResult.data) {
          const logs = logsResult.data || [];
          const todayLogs = logs.filter((log: any) => log.log_date === today);
          if (logs.length > 0) {
            const lastLog = logs[0];
            setLastCheckTime(
              lastLog.log_date && lastLog.log_time
                ? `${lastLog.log_date}T${lastLog.log_time}`
                : lastLog.created_at,
            );
          }
          if (!equipmentResult.error && equipmentResult.data) {
            const equip = equipmentResult.data || [];
            setActiveEquipment(equip.length);
            setOutOfRangeAlerts(calculateOutOfRange(todayLogs, equip));
            cacheData('dashboard_temperature_logs', logs);
            cacheData('dashboard_temperature_equipment', equip);
          }
        }
      } catch (err) {
        logger.error('Error fetching temperature status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    temperatureChecksToday,
    activeEquipment,
    outOfRangeAlerts,
    lastCheckTime,
    loading,
  };
}
