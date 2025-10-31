'use client';

import { useEffect, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  Pie,
  BarChart as ReBarChart,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PerformanceItem } from '../types';

interface PerformanceChartsProps {
  performanceItems: PerformanceItem[];
}

export default function PerformanceCharts({ performanceItems }: PerformanceChartsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  const chartData = [
    {
      name: "Chef's Kiss",
      value:
        performanceItems
          .filter(item => item.menu_item_class === "Chef's Kiss")
          .reduce((acc, item) => acc + item.gross_profit_percentage, 0) /
        Math.max(1, performanceItems.filter(item => item.menu_item_class === "Chef's Kiss").length),
      color: '#22c55e',
    },
    {
      name: 'Hidden Gem',
      value:
        performanceItems
          .filter(item => item.menu_item_class === 'Hidden Gem')
          .reduce((acc, item) => acc + item.gross_profit_percentage, 0) /
        Math.max(1, performanceItems.filter(item => item.menu_item_class === 'Hidden Gem').length),
      color: '#3b82f6',
    },
    {
      name: 'Bargain Bucket',
      value:
        performanceItems
          .filter(item => item.menu_item_class === 'Bargain Bucket')
          .reduce((acc, item) => acc + item.gross_profit_percentage, 0) /
        Math.max(
          1,
          performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket').length,
        ),
      color: '#f97316',
    },
    {
      name: 'Burnt Toast',
      value:
        performanceItems
          .filter(item => item.menu_item_class === 'Burnt Toast')
          .reduce((acc, item) => acc + item.gross_profit_percentage, 0) /
        Math.max(1, performanceItems.filter(item => item.menu_item_class === 'Burnt Toast').length),
      color: '#ef4444',
    },
  ];

  const pieData = [
    {
      name: "Chef's Kiss",
      value: performanceItems.filter(item => item.menu_item_class === "Chef's Kiss").length,
      color: '#22c55e',
    },
    {
      name: 'Hidden Gem',
      value: performanceItems.filter(item => item.menu_item_class === 'Hidden Gem').length,
      color: '#3b82f6',
    },
    {
      name: 'Bargain Bucket',
      value: performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket').length,
      color: '#f97316',
    },
    {
      name: 'Burnt Toast',
      value: performanceItems.filter(item => item.menu_item_class === 'Burnt Toast').length,
      color: '#ef4444',
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Bar Chart - Profit by Category */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white md:text-xl">Profit by Category</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis
                stroke="#9ca3af"
                tickFormatter={(v: number | string) =>
                  `${typeof v === 'number' ? v.toFixed(0) : v}%`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #2a2a2a',
                  color: '#fff',
                }}
                formatter={(value: number | string, name: string) => [
                  `${(value as number).toFixed(1)}%`,
                  name,
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

      {/* Pie Chart - Category Distribution */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white md:text-xl">Category Distribution</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f1f1f',
                  border: '1px solid #2a2a2a',
                  color: '#fff',
                }}
                formatter={(value: number | string, name: string) => [String(value), name]}
              />
              <Pie dataKey="value" data={pieData} outerRadius={isMobile ? 80 : 100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`pie-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
