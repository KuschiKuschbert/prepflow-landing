'use client';

import { useMemo } from 'react';
import {
  computeCategoryAggregates,
  computeWeatherCorrelation,
  deriveChartData,
  derivePieData,
  getTopProfitItems,
  getTotalProfit,
  mergeHistoryWithWeather,
} from '../utils/chartDataTransformers';
import type { Top3Insight } from './charts/PerformanceBarChart';
import PerformanceAreaChart from './charts/PerformanceAreaChart';
import PerformanceBarChart from './charts/PerformanceBarChart';
import PerformancePieChart from './charts/PerformancePieChart';
import PerformanceWeatherCorrelation from './charts/PerformanceWeatherCorrelation';
import type {
  PerformanceHistoryItem,
  PerformanceItem,
  WeatherByDateRecord,
} from '@/lib/types/performance';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface PerformanceChartsLazyProps {
  performanceItems: PerformanceItem[];
  performanceHistory: PerformanceHistoryItem[];
  weatherByDate?: Record<string, WeatherByDateRecord>;
  dateRange?: {
    startDate: Date | null;
    endDate: Date | null;
  };
  isMobile: boolean;
  onCategoryFilter?: (className: string) => void;
}

export default function PerformanceChartsLazy({
  performanceItems,
  performanceHistory,
  weatherByDate = {},
  dateRange,
  isMobile,
  onCategoryFilter,
}: PerformanceChartsLazyProps) {
  const aggregates = useMemo(() => computeCategoryAggregates(performanceItems), [performanceItems]);
  const chartData = useMemo(() => deriveChartData(aggregates), [aggregates]);
  const pieData = useMemo(() => derivePieData(aggregates), [aggregates]);

  const topProfitItems = useMemo(() => getTopProfitItems(performanceItems, 3), [performanceItems]);
  const totalProfit = useMemo(() => getTotalProfit(performanceItems), [performanceItems]);
  const top3Insight: Top3Insight | undefined = useMemo(() => {
    if (topProfitItems.length === 0 || totalProfit === 0) return undefined;
    const top3Profit = topProfitItems.reduce(
      (sum, item) => sum + item.gross_profit * item.number_sold,
      0,
    );
    return {
      itemNames: topProfitItems.map(item => item.name),
      percentage: (top3Profit / totalProfit) * 100,
      totalAmount: formatCurrency(top3Profit),
    };
  }, [topProfitItems, totalProfit]);

  const chartDataWithWeather = useMemo(
    () => mergeHistoryWithWeather(performanceHistory, weatherByDate),
    [performanceHistory, weatherByDate],
  );
  const weatherCorrelation = useMemo(
    () => computeWeatherCorrelation(performanceHistory, weatherByDate),
    [performanceHistory, weatherByDate],
  );

  const hasHistory = performanceHistory.length > 0;
  const hasWeatherData =
    hasHistory && (weatherCorrelation.rainy.count > 0 || weatherCorrelation.dry.count > 0);
  const showEmptyTimeSeries =
    !hasHistory && dateRange?.startDate != null && dateRange?.endDate != null;

  return (
    <div className="mb-8 space-y-6">
      <div className="large-desktop:grid-cols-2 grid grid-cols-1 gap-6">
        <PerformanceBarChart chartData={chartData} insight={top3Insight} />
        <PerformancePieChart
          pieData={pieData}
          isMobile={isMobile}
          onCategoryFilter={onCategoryFilter}
        />
      </div>

      {hasHistory ? (
        <PerformanceAreaChart chartDataWithWeather={chartDataWithWeather} />
      ) : showEmptyTimeSeries ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="desktop:text-xl mb-4 text-lg font-semibold text-[var(--foreground)]">
            Performance Over Time
          </h3>
          <p className="mb-4 text-sm text-[var(--foreground-muted)]">
            Time-series data is not available for the selected period.
          </p>
          <div className="flex h-64 w-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-4">
            <p className="text-sm text-[var(--foreground-subtle)]">No sales data found.</p>
          </div>
        </div>
      ) : null}

      {hasWeatherData ? (
        <PerformanceWeatherCorrelation weatherCorrelation={weatherCorrelation} />
      ) : null}
    </div>
  );
}
