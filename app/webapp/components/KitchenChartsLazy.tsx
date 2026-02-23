'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { DashboardTemperatureCheck, PerformanceData } from '../../../lib/types/dashboard';

// Dynamic imports for granular code splitting
const TopSellersChart = dynamic(() => import('./charts/TopSellersChart'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full animate-pulse rounded-xl bg-[var(--muted)]" />,
});

const TemperatureChart = dynamic(() => import('./charts/TemperatureChart'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full animate-pulse rounded-xl bg-[var(--muted)]" />,
});

interface KitchenChartsLazyProps {
  performanceData: PerformanceData | null;
  temperatureChecks: DashboardTemperatureCheck[];
}

const COLORS = {
  primary: '#f97316', // Orange-500
  secondary: '#3b82f6', // Blue-500
  accent: '#10b981', // Emerald-500
};

export default function KitchenChartsLazy({
  performanceData,
  temperatureChecks,
}: KitchenChartsLazyProps) {
  // Prepare chart data
  const topDishesData = useMemo(
    () =>
      performanceData?.topSellers.slice(0, 5).map((item, index) => ({
        name: item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name,
        fullName: item.name,
        value: item.number_sold,
        color: index === 0 ? COLORS.primary : index === 1 ? COLORS.secondary : COLORS.accent,
      })) || [],
    [performanceData],
  );

  const temperatureData = useMemo(
    () =>
      temperatureChecks.length > 0
        ? temperatureChecks.map(item => ({
            date: new Date(item.date).toLocaleDateString('en-AU', {
              month: 'short',
              day: 'numeric',
            }),
            count: item.count,
          }))
        : [],
    [temperatureChecks],
  );

  const hasData = topDishesData.length > 0 || temperatureData.length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <div className="desktop:grid-cols-2 grid grid-cols-1 gap-6">
      {/* Top Sellers Chart */}
      {topDishesData.length > 0 && (
        <div className="glass-surface rounded-2xl border border-[var(--border)]/30 p-6 shadow-sm transition-all duration-300 hover:border-[var(--primary)]/30 hover:shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Top Selling Dishes</h3>
              <p className="text-sm text-[var(--foreground-muted)]">Most popular items this week</p>
            </div>
          </div>
          <TopSellersChart data={topDishesData} />
        </div>
      )}

      {/* Temperature Checks Chart */}
      {temperatureData.length > 0 && (
        <div className="glass-surface rounded-2xl border border-[var(--border)]/30 p-6 shadow-sm transition-all duration-300 hover:border-[var(--primary)]/30 hover:shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Temperature Checks</h3>
              <p className="text-sm text-[var(--foreground-muted)]">Daily compliance activity</p>
            </div>
          </div>
          <TemperatureChart data={temperatureData} />
        </div>
      )}
    </div>
  );
}
