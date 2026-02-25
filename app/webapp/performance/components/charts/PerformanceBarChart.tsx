'use client';

import {
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart as ReBarChart,
} from 'recharts';
import type { ChartDataItem } from '../../utils/chartDataTransformers';

export interface Top3Insight {
  itemNames: string[];
  percentage: number;
  totalAmount: string;
}

interface PerformanceBarChartProps {
  chartData: ChartDataItem[];
  insight?: Top3Insight;
}

export default function PerformanceBarChart({ chartData, insight }: PerformanceBarChartProps) {
  return (
    <div className="space-y-4">
      {insight && insight.itemNames.length > 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 p-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            <span className="font-semibold text-[var(--button-active-text)]">Insight:</span> Your
            top 3 items ({insight.itemNames.join(', ')}) generate{' '}
            <span className="font-semibold text-[var(--primary)]">
              {insight.percentage.toFixed(1)}%
            </span>{' '}
            of total profit ({insight.totalAmount})
          </p>
        </div>
      )}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="desktop:text-xl mb-4 text-lg font-semibold text-[var(--foreground)]">
          Average Profit Margin by Category
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <XAxis dataKey="name" stroke="var(--foreground-muted)" tick={{ fontSize: 12 }} />
              <YAxis
                stroke="var(--foreground-muted)"
                tickFormatter={(v: number | string) =>
                  `${typeof v === 'number' ? v.toFixed(0) : v}%`
                }
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
                formatter={(value: number | string) => [
                  `${(value as number).toFixed(1)}%`,
                  'Avg Profit Margin',
                ]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
