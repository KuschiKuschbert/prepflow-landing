'use client';

import dynamic from 'next/dynamic';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';

interface PerformanceSummary {
  topSellers: Array<{
    id: string;
    name: string;
    number_sold: number;
  }>;
}

// Lazy load Recharts to reduce initial bundle size
const KitchenChartsContent = dynamic(() => import('./KitchenChartsLazy'), {
  ssr: false,
  loading: () => null, // Don't show loading, charts are non-critical
});

export default function KitchenCharts() {
  const [performanceData, setPerformanceData] = useState<PerformanceSummary | null>(
    () => getCachedData<PerformanceSummary>('dashboard_performance_summary') || null,
  );
  const [temperatureChecks, setTemperatureChecks] = useState<
    Array<{ date: string; count: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Initialize with cached data
      const cachedPerformance = getCachedData<PerformanceSummary>('dashboard_performance_summary');

      if (cachedPerformance) setPerformanceData(cachedPerformance);

      try {
        // Fetch fresh data in parallel
        const [performanceResponse, logsResult] = await Promise.all([
          fetch('/api/dashboard/performance-summary'),
          supabase
            .from('temperature_logs')
            .select('log_date')
            .gte(
              'log_date',
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            )
            .order('log_date', { ascending: true }),
        ]);

        // Process performance data
        if (performanceResponse.ok) {
          const result = await performanceResponse.json();
          if (result.success) {
            setPerformanceData(result);
            cacheData('dashboard_performance_summary', result);
          }
        }

        // Process temperature checks (last 7 days)
        if (!logsResult.error && logsResult.data) {
          const logs = logsResult.data || [];
          const dateCounts = new Map<string, number>();
          logs.forEach((log: any) => {
            const date = log.log_date;
            dateCounts.set(date, (dateCounts.get(date) || 0) + 1);
          });
          const checks = Array.from(dateCounts.entries()).map(([date, count]) => ({ date, count }));
          setTemperatureChecks(checks);
        }
      } catch (err) {
        logger.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return null; // Don't show skeleton, charts are non-critical
  }

  return (
    <KitchenChartsContent performanceData={performanceData} temperatureChecks={temperatureChecks} />
  );
}
