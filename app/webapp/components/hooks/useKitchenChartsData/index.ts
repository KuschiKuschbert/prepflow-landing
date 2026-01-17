'use client';

import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface PerformanceSummary {
  topSellers: Array<{
    id: string;
    name: string;
    number_sold: number;
  }>;
}

interface TemperatureCheck {
  date: string;
  count: number;
}

export function useKitchenChartsData() {
  const [performanceData, setPerformanceData] = useState<PerformanceSummary | null>(
    () => getCachedData<PerformanceSummary>('dashboard_performance_summary') || null,
  );
  const [temperatureChecks, setTemperatureChecks] = useState<TemperatureCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Initialize with cached data
      const cachedPerformance = getCachedData<PerformanceSummary>('dashboard_performance_summary');
      if (cachedPerformance) setPerformanceData(cachedPerformance);

      try {
        // Fetch performance data
        let performanceResponse: Response | null = null;
        try {
          performanceResponse = await fetch(
            '/api/dashboard/performance-summary?lockedMenuOnly=true',
            { cache: 'no-store' },
          );
        } catch (fetchError) {
          logger.error('Network error fetching chart data:', fetchError);
          setLoading(false);
          return;
        }

        // Fetch temperature logs
        const logsResult = await supabase
          .from('temperature_logs')
          .select('log_date')
          .gte(
            'log_date',
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          )
          .order('log_date', { ascending: true });

        // Process performance data
        if (performanceResponse.ok) {
          try {
            const result = await performanceResponse.json();
            if (result.success) {
              setPerformanceData(result);
              cacheData('dashboard_performance_summary', result);
            }
          } catch (parseError) {
            logger.error('Error parsing performance summary:', parseError);
          }
        } else {
          logger.error('Error fetching performance summary:', {
            status: performanceResponse.status,
            statusText: performanceResponse.statusText,
          });
        }

        // Process temperature checks (last 7 days)
        if (logsResult.error) {
          logger.error('Error fetching temperature logs for charts:', logsResult.error);
        } else if (logsResult.data) {
          const logs = logsResult.data || [];
          const dateCounts = new Map<string, number>();
          logs.forEach((log: { log_date: string }) => {
            const date = log.log_date;
            dateCounts.set(date, (dateCounts.get(date) || 0) + 1);
          });
          const checks = Array.from(dateCounts.entries()).map(([date, count]) => ({ date, count }));
          setTemperatureChecks(checks);
        }
      } catch (err) {
        logger.error('Error fetching chart data:', err);
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

  return { performanceData, temperatureChecks, loading };
}
