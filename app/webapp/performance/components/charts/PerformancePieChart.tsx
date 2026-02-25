'use client';

import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { ChartDataItem } from '../../utils/chartDataTransformers';

interface PerformancePieChartProps {
  pieData: ChartDataItem[];
  isMobile: boolean;
  onCategoryFilter?: (className: string) => void;
}

export default function PerformancePieChart({
  pieData,
  isMobile,
  onCategoryFilter,
}: PerformancePieChartProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h3 className="desktop:text-xl mb-4 text-lg font-semibold text-[var(--foreground)]">
        Category Distribution
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
              }}
              formatter={(value: number | string, name: string) => [String(value), name]}
            />
            <Pie dataKey="value" data={pieData} outerRadius={isMobile ? 80 : 100} label>
              {pieData.map((entry, index) => (
                <Cell
                  key={`pie-cell-${index}`}
                  fill={entry.color}
                  onClick={onCategoryFilter ? () => onCategoryFilter(entry.name) : undefined}
                  style={onCategoryFilter ? { cursor: 'pointer' } : undefined}
                />
              ))}
            </Pie>
          </RePieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
