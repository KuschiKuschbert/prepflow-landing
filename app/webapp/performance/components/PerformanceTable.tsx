'use client';

import { PerformanceItem } from '../types';
import { HelpTooltip } from '@/components/ui/HelpTooltip';

interface PerformanceTableProps {
  performanceItems: PerformanceItem[];
}

export default function PerformanceTable({ performanceItems }: PerformanceTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
      {/* Classification Legend */}
      <div className="border-b border-[#2a2a2a] bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 p-4">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Menu Item Classifications</h3>
          <HelpTooltip
            content="Dishes are categorized based on profit and popularity. Chef's Kiss: High profit AND high sales - your stars. Hidden Gem: High profit but low sales - market these better. Bargain Bucket: Popular but low profit - consider raising price. Burnt Toast: Low profit AND low sales - consider removing."
            title="Understanding Classifications"
          />
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full border border-green-500/30 bg-green-500/20"></span>
            <span className="text-gray-300">Chef&apos;s Kiss: High profit & high popularity</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full border border-blue-500/30 bg-blue-500/20"></span>
            <span className="text-gray-300">Hidden Gem: High profit, low sales</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full border border-yellow-500/30 bg-yellow-500/20"></span>
            <span className="text-gray-300">Bargain Bucket: Popular, low profit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full border border-red-500/30 bg-red-500/20"></span>
            <span className="text-gray-300">Burnt Toast: Low profit & low sales</span>
          </div>
        </div>
      </div>
      {/* Mobile Card Layout */}
      <div className="block lg:hidden">
        <div className="space-y-4 p-4">
          {performanceItems.map((item, index) => (
            <div
              key={item.id}
              className="space-y-3 rounded-xl border border-[#3a3a3a] bg-[#2a2a2a]/30 p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.menu_item_class === "Chef's Kiss"
                      ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                      : item.menu_item_class === 'Hidden Gem'
                        ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                        : item.menu_item_class === 'Bargain Bucket'
                          ? 'border border-yellow-500/30 bg-yellow-500/20 text-yellow-400'
                          : 'border border-red-500/30 bg-red-500/20 text-red-400'
                  }`}
                >
                  {item.menu_item_class}
                </span>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-[#1f1f1f] p-3">
                  <div className="mb-1 text-xs text-gray-400">Number Sold</div>
                  <div className="text-lg font-bold text-white">{item.number_sold}</div>
                </div>
                <div className="rounded-lg bg-[#1f1f1f] p-3">
                  <div className="mb-1 text-xs text-gray-400">Popularity</div>
                  <div className="text-lg font-bold text-[#3B82F6]">
                    {item.popularity_percentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Financial Data */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Gross Profit %</span>
                  <span className="text-lg font-bold text-[#29E7CD]">
                    {formatPercentage(item.gross_profit_percentage)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Revenue</span>
                  <span className="text-sm text-gray-300">
                    {formatCurrency((item.selling_price * item.number_sold) / 1.1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Cost</span>
                  <span className="text-sm text-gray-300">
                    {formatCurrency(item.food_cost * item.number_sold)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Profit</span>
                  <span className="text-sm font-medium text-white">
                    {formatCurrency(item.gross_profit * item.number_sold)}
                  </span>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    item.profit_category === 'High'
                      ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                      : 'border border-red-500/30 bg-red-500/20 text-red-400'
                  }`}
                >
                  Profit: {item.profit_category}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    item.popularity_category === 'High'
                      ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                      : 'border border-orange-500/30 bg-orange-500/20 text-orange-400'
                  }`}
                >
                  Popularity: {item.popularity_category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-[#2a2a2a]">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">Dish</th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">Number Sold</th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Popularity %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Total Revenue ex GST
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">Total Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Total Profit ex GST
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Gross Profit %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">Profit Cat</th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Popularity Cat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Menu Item Class
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
            {performanceItems.map((item, index) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-[#2a2a2a]/20"
              >
                <td className="px-6 py-4 text-sm font-medium text-white">{item.name}</td>
                <td className="px-6 py-4 text-sm text-center text-gray-300">{item.number_sold}</td>
                <td className="px-6 py-4 text-sm text-center text-gray-300">
                  {item.popularity_percentage.toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-300">
                  {formatCurrency((item.selling_price * item.number_sold) / 1.1)}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-300">
                  {formatCurrency(item.food_cost * item.number_sold)}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-300">
                  {formatCurrency(item.gross_profit * item.number_sold)}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-300">
                  {formatPercentage(item.gross_profit_percentage)}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      item.profit_category === 'High'
                        ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                        : 'border border-red-500/30 bg-red-500/20 text-red-400'
                    }`}
                  >
                    {item.profit_category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      item.popularity_category === 'High'
                        ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                        : 'border border-orange-500/30 bg-orange-500/20 text-orange-400'
                    }`}
                  >
                    {item.popularity_category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.menu_item_class === "Chef's Kiss"
                        ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                        : item.menu_item_class === 'Hidden Gem'
                          ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                          : item.menu_item_class === 'Bargain Bucket'
                            ? 'border border-yellow-500/30 bg-yellow-500/20 text-yellow-400'
                            : 'border border-red-500/30 bg-red-500/20 text-red-400'
                    }`}
                  >
                    {item.menu_item_class}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
