'use client';

import dynamic from 'next/dynamic';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { useEffect, useState, ErrorInfo, Component, ReactNode } from 'react';

interface PerformanceSummary {
  topSellers: Array<{
    id: string;
    name: string;
    number_sold: number;
  }>;
}

// Error boundary component for chart loading errors
class ChartErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('KitchenCharts chunk loading error:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Silently fail - charts are non-critical
      return null;
    }

    return this.props.children;
  }
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
        let performanceResponse: Response | null = null;
        try {
          performanceResponse = await fetch(
            '/api/dashboard/performance-summary?lockedMenuOnly=true',
            {
              cache: 'no-store',
            },
          );
        } catch (fetchError) {
          logger.error('Network error fetching chart data:', fetchError);
          // Keep cached data if available
          setLoading(false);
          return;
        }

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
          logs.forEach((log: any) => {
            const date = log.log_date;
            dateCounts.set(date, (dateCounts.get(date) || 0) + 1);
          });
          const checks = Array.from(dateCounts.entries()).map(([date, count]) => ({ date, count }));
          setTemperatureChecks(checks);
        }
      } catch (err) {
        logger.error('Error fetching chart data:', err);

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

  if (loading) {
    return null; // Don't show skeleton, charts are non-critical
  }

  return (
    <ChartErrorBoundary>
      <KitchenChartsContent
        performanceData={performanceData}
        temperatureChecks={temperatureChecks}
      />
    </ChartErrorBoundary>
  );
}
