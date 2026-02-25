/**
 * Weather correlation utilities for performance charts.
 */

import type { PerformanceHistoryItem, WeatherByDateRecord } from '@/lib/types/performance';

export interface WeatherCorrelation {
  rainy: { revenue: number; itemsSold: number; count: number };
  dry: { revenue: number; itemsSold: number; count: number };
}

export interface ChartDataWithWeather {
  date: string;
  grossProfit: number;
  revenue: number;
  itemsSold: number;
  tempAvg?: number;
  precipitation_mm?: number;
  weather_status?: string;
}

/**
 * Merge weather data with performance history for area chart.
 */
export function mergeHistoryWithWeather(
  performanceHistory: PerformanceHistoryItem[],
  weatherByDate: Record<string, WeatherByDateRecord>,
): ChartDataWithWeather[] {
  return performanceHistory.map(h => {
    const w = weatherByDate[h.date];
    const tempAvg: number | undefined = w
      ? ((w.temp_celsius_max != null && w.temp_celsius_min != null
          ? (w.temp_celsius_max + w.temp_celsius_min) / 2
          : (w.temp_celsius_max ?? w.temp_celsius_min ?? undefined)) ?? undefined)
      : undefined;
    return {
      ...h,
      tempAvg,
      precipitation_mm: w?.precipitation_mm ?? undefined,
      weather_status: w?.weather_status,
    };
  });
}

/**
 * Compute rainy vs dry day correlation from history.
 */
export function computeWeatherCorrelation(
  performanceHistory: PerformanceHistoryItem[],
  weatherByDate: Record<string, WeatherByDateRecord>,
): WeatherCorrelation {
  const rainy = { revenue: 0, itemsSold: 0, count: 0 };
  const dry = { revenue: 0, itemsSold: 0, count: 0 };

  for (const h of performanceHistory) {
    const w = weatherByDate[h.date];
    const hasRain = w && (w.precipitation_mm ?? 0) > 0;
    const target = hasRain ? rainy : dry;
    target.revenue += h.revenue;
    target.itemsSold += h.itemsSold;
    target.count += 1;
  }

  return { rainy, dry };
}
