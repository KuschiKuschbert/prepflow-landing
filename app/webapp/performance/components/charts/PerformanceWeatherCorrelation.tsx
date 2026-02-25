'use client';

import type { WeatherCorrelation } from '../../utils/chartDataTransformers';

interface PerformanceWeatherCorrelationProps {
  weatherCorrelation: WeatherCorrelation;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PerformanceWeatherCorrelation({
  weatherCorrelation,
}: PerformanceWeatherCorrelationProps) {
  const { rainy, dry } = weatherCorrelation;
  const hasData = rainy.count > 0 || dry.count > 0;

  if (!hasData) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h3 className="desktop:text-xl mb-4 text-lg font-semibold text-[var(--foreground)]">
        Weather vs Performance
      </h3>
      <p className="mb-4 text-sm text-[var(--foreground-muted)]">
        Compare operational metrics on rainy vs dry days to identify weather-related trends.
      </p>
      <div className="tablet:grid-cols-2 grid grid-cols-1 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
          <h4 className="mb-2 text-sm font-medium text-[var(--foreground)]">Rainy days</h4>
          <div className="space-y-1 text-sm text-[var(--foreground-muted)]">
            <div>Days: {rainy.count}</div>
            <div>Avg revenue: {formatCurrency(rainy.count ? rainy.revenue / rainy.count : 0)}</div>
            <div>Avg items sold: {rainy.count ? Math.round(rainy.itemsSold / rainy.count) : 0}</div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
          <h4 className="mb-2 text-sm font-medium text-[var(--foreground)]">Dry days</h4>
          <div className="space-y-1 text-sm text-[var(--foreground-muted)]">
            <div>Days: {dry.count}</div>
            <div>Avg revenue: {formatCurrency(dry.count ? dry.revenue / dry.count : 0)}</div>
            <div>Avg items sold: {dry.count ? Math.round(dry.itemsSold / dry.count) : 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
