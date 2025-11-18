'use client';

import { useMemo } from 'react';
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
  Legend,
} from 'recharts';
import { PerformanceItem } from '../types';

interface PerformanceChartsLazyProps {
  performanceItems: PerformanceItem[];
  dateRange?: {
    startDate: Date | null;
    endDate: Date | null;
  };
  isMobile: boolean;
}

export default function PerformanceChartsLazy({
  performanceItems,
  dateRange,
  isMobile,
}: PerformanceChartsLazyProps) {
  const chartData = useMemo(
    () => [
      {
        name: "Chef's Kiss",
        value:
          performanceItems
            .filter(item => item.menu_item_class === "Chef's Kiss")
            .reduce((acc, item) => acc + item.gross_profit_percentage, 0) /
          Math.max(
            1,
            performanceItems.filter(item => item.menu_item_class === "Chef's Kiss").length,
          ),
        color: '#22c55e',
      },
      {
        name: 'Hidden Gem',
        value:
          performanceItems
            .filter(item => item.menu_item_class === 'Hidden Gem')
            .reduce((acc, item) => acc + item.gross_profit_percentage, 0) /
          Math.max(
            1,
            performanceItems.filter(item => item.menu_item_class === 'Hidden Gem').length,
          ),
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
          Math.max(
            1,
            performanceItems.filter(item => item.menu_item_class === 'Burnt Toast').length,
          ),
        color: '#ef4444',
      },
    ],
    [performanceItems],
  );

  const pieData = useMemo(
    () => [
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
    ],
    [performanceItems],
  );

  // Top 3 profit generators
  const topProfitItems = useMemo(() => {
    return [...performanceItems]
      .sort((a, b) => b.gross_profit * b.number_sold - a.gross_profit * a.number_sold)
      .slice(0, 3);
  }, [performanceItems]);

  const totalProfit = useMemo(() => {
    return performanceItems.reduce((sum, item) => sum + item.gross_profit * item.number_sold, 0);
  }, [performanceItems]);

  const top3ProfitPercentage = useMemo(() => {
    if (totalProfit === 0) return 0;
    const top3Profit = topProfitItems.reduce(
      (sum, item) => sum + item.gross_profit * item.number_sold,
      0,
    );
    return (top3Profit / totalProfit) * 100;
  }, [topProfitItems, totalProfit]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Chart Insights */}
      {topProfitItems.length > 0 && (
        <div className="rounded-2xl border border-[#2a2a2a] bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/10 p-4">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-white">Insight:</span> Your top 3 items (
            {topProfitItems.map(item => item.name).join(', ')}) generate{' '}
            <span className="font-semibold text-[#29E7CD]">{top3ProfitPercentage.toFixed(1)}%</span>{' '}
            of total profit (
            {formatCurrency(
              topProfitItems.reduce((sum, item) => sum + item.gross_profit * item.number_sold, 0),
            )}
            )
          </p>
        </div>
      )}

      {/* Charts Grid */}
      <div className="large-desktop:grid-cols-2 grid grid-cols-1 gap-6">
        {/* Bar Chart - Profit by Category */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <h3 className="desktop:text-xl mb-4 text-lg font-semibold text-white">
            Average Profit Margin by Category
          </h3>
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

        {/* Pie Chart - Category Distribution */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <h3 className="desktop:text-xl mb-4 text-lg font-semibold text-white">
            Category Distribution
          </h3>
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

      {/* Time Series Chart - Show if date range is selected */}
      {dateRange?.startDate && dateRange?.endDate && (
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <h3 className="desktop:text-xl mb-4 text-lg font-semibold text-white">
            Performance Over Time
          </h3>
          <p className="mb-4 text-sm text-gray-400">
            Note: Time-series visualization requires daily sales data. Currently showing aggregated
            data for the selected period.
          </p>
          <div className="flex h-64 w-full items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
            <p className="text-sm text-gray-500">
              Time-series chart coming soon. Select a date range to see trends over time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
