'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartDataWithWeather } from '../../utils/chartDataTransformers';

interface PerformanceAreaChartProps {
  chartDataWithWeather: ChartDataWithWeather[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PerformanceAreaChart({ chartDataWithWeather }: PerformanceAreaChartProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h3 className="desktop:text-xl mb-4 text-lg font-semibold text-[var(--foreground)]">
        Profit Over Time
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartDataWithWeather}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="var(--foreground-muted)"
              tick={{ fontSize: 12 }}
              tickFormatter={(value: number | string) => {
                const d = new Date(value);
                return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
              }}
            />
            <YAxis
              stroke="var(--foreground-muted)"
              tick={{ fontSize: 12 }}
              tickFormatter={(value: number) =>
                new Intl.NumberFormat('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                  notation: 'compact',
                }).format(value)
              }
            />
            <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
              }}
              content={({
                active,
                payload,
                label,
              }: {
                active?: boolean;
                payload?: Array<{ payload?: ChartDataWithWeather }>;
                label?: string;
              }) => {
                if (!active || !payload?.length || !label) return null;
                const p = payload[0]?.payload;
                const d = new Date(label);
                return (
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm">
                    <div className="font-medium text-[var(--foreground)]">
                      {d.toLocaleDateString('en-AU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="mt-1 space-y-0.5 text-[var(--foreground-muted)]">
                      <div>Gross profit: {formatCurrency(p?.grossProfit ?? 0)}</div>
                      <div>Revenue: {formatCurrency(p?.revenue ?? 0)}</div>
                      <div>Items sold: {p?.itemsSold ?? 0}</div>
                      {p?.weather_status && <div>Weather: {p.weather_status}</div>}
                      {p?.tempAvg != null && <div>Avg temp: {Math.round(p.tempAvg)}°C</div>}
                      {p?.precipitation_mm != null && p.precipitation_mm > 0 && (
                        <div>Precipitation: {p.precipitation_mm} mm</div>
                      )}
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="grossProfit"
              stroke="var(--primary)"
              fillOpacity={1}
              fill="url(#colorProfit)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
