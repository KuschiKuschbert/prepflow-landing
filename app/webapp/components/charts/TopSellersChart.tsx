'use client';

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export const COLORS = {
  primary: '#f97316', // Orange-500
  secondary: '#3b82f6', // Blue-500
  accent: '#10b981', // Emerald-500
  background: '#ffffff',
  text: '#1f2937', // Gray-800
  grid: '#e5e7eb', // Gray-200
  tooltipBg: '#ffffff',
};

interface TopSellersChartProps {
  data: {
    name: string;
    value: number;
    color: string;
    fullName: string;
  }[];
}

export default function TopSellersChart({ data }: TopSellersChartProps) {
  if (data.length === 0) return null;

  return (
    <div className="h-[300px] w-full" data-testid="top-sellers-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={true} vertical={false} />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: COLORS.text, fontSize: 12 }}
            width={100}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              backgroundColor: COLORS.tooltipBg,
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
