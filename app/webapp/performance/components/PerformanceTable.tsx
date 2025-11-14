'use client';

import { PerformanceItem } from '../types';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { usePerformanceTableSort } from '../hooks/usePerformanceTableSort';

interface PerformanceTableProps {
  performanceItems: PerformanceItem[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string, order: 'asc' | 'desc') => void;
}

export default function PerformanceTable({
  performanceItems,
  sortBy,
  sortOrder,
  onSortChange,
}: PerformanceTableProps) {
  const { handleColumnSort, getSortIcon } = usePerformanceTableSort({
    sortBy,
    sortOrder,
    onSortChange,
  });

  // Enhanced number formatting utilities
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-AU').format(value);
  };

  const formatCompactNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
      {/* Classification Legend */}
      <div className="border-b border-[#2a2a2a] bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 p-3 tablet:p-4 desktop:p-6">
        <div className="mb-1.5 flex items-center gap-2 tablet:mb-2">
          <h3 className="text-xs font-semibold text-white tablet:text-sm">Menu Item Classifications</h3>
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
      <div className="block desktop:hidden">
        <div className="space-y-3 p-3 tablet:space-y-4 tablet:p-4">
          {performanceItems.map((item, index) => (
            <div
              key={item.id}
              className="space-y-4 rounded-xl border border-[#3a3a3a] bg-[#2a2a2a]/30 p-4"
            >
              {/* Header with Menu Item Class Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
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
              </div>

              {/* Key Metrics - Prominent Display */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] p-4 border border-[#29E7CD]/20">
                  <div className="mb-1 text-xs text-gray-400">Gross Profit %</div>
                  <div className="text-2xl font-bold text-[#29E7CD]">
                    {formatPercentage(item.gross_profit_percentage)}
                  </div>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] p-4 border border-[#3B82F6]/20">
                  <div className="mb-1 text-xs text-gray-400">Popularity %</div>
                  <div className="text-2xl font-bold text-[#3B82F6]">
                    {formatPercentage(item.popularity_percentage)}
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    item.profit_category === 'High'
                      ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                      : 'border border-red-500/30 bg-red-500/20 text-red-400'
                  }`}
                >
                  {item.profit_category} Profit
                </span>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    item.popularity_category === 'High'
                      ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                      : 'border border-orange-500/30 bg-orange-500/20 text-orange-400'
                  }`}
                >
                  {item.popularity_category} Popularity
                </span>
              </div>

              {/* Sales & Financial Summary */}
              <div className="rounded-lg bg-[#1f1f1f] p-3 space-y-2 border border-[#2a2a2a]">
                <div className="flex items-center justify-between pb-2 border-b border-[#2a2a2a]">
                  <span className="text-sm text-gray-400">Number Sold</span>
                  <span className="text-base font-semibold text-white">{formatNumber(item.number_sold)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Profit ex GST</span>
                  <span className="text-base font-semibold text-white">
                    {formatCurrency(item.gross_profit * item.number_sold)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Revenue ex GST</span>
                  <span className="text-gray-300">
                    {formatCurrency((item.selling_price * item.number_sold) / 1.1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Cost</span>
                  <span className="text-gray-300">
                    {formatCurrency(item.food_cost * item.number_sold)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden overflow-x-auto desktop:block">
        <table className="min-w-full divide-y divide-[#2a2a2a]">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
            <tr>
              {/* Menu Item Class - Sticky, Most Important */}
              <th className="sticky left-0 z-30 bg-[#2a2a2a] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase min-w-[160px] border-r border-[#2a2a2a] shadow-[2px_0_4px_rgba(0,0,0,0.3)]">
                <button
                  onClick={() => handleColumnSort('menu_item_class')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by menu item class"
                >
                  Class
                  {getSortIcon('menu_item_class')}
                </button>
              </th>
              {/* Dish Name - Sticky */}
              <th className="sticky left-[160px] z-30 bg-[#2a2a2a] px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase min-w-[200px] border-r border-[#2a2a2a] shadow-[2px_0_4px_rgba(0,0,0,0.3)]">
                <button
                  onClick={() => handleColumnSort('name')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by dish name"
                >
                  Dish
                  {getSortIcon('name')}
                </button>
              </th>
              {/* Gross Profit % - Key Metric */}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => handleColumnSort('gross_profit_percentage')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by gross profit percentage"
                >
                  <span className="flex items-center gap-1">
                    Gross Profit %
                    <HelpTooltip
                      content="Gross profit margin percentage. Calculated as (Selling Price - Food Cost) / Selling Price × 100. Excludes GST."
                      title="Gross Profit %"
                    />
                  </span>
                  {getSortIcon('gross_profit_percentage')}
                </button>
              </th>
              {/* Popularity % - Key Metric */}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => handleColumnSort('popularity_percentage')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by popularity percentage"
                >
                  <span className="flex items-center gap-1">
                    Popularity %
                    <HelpTooltip
                      content="Percentage of total sales this dish represents. Calculated as (Number Sold / Total Items Sold) × 100."
                      title="Popularity %"
                    />
                  </span>
                  {getSortIcon('popularity_percentage')}
                </button>
              </th>
              {/* Profit & Popularity Categories - Combined Visual */}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <span className="flex items-center gap-1">
                  Status
                  <HelpTooltip
                    content="Combined profit and popularity categories. High/High = Chef's Kiss, High/Low = Hidden Gem, Low/High = Bargain Bucket, Low/Low = Burnt Toast."
                    title="Status"
                  />
                </span>
              </th>
              {/* Number Sold */}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => handleColumnSort('number_sold')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by number sold"
                >
                  Sold
                  {getSortIcon('number_sold')}
                </button>
              </th>
              {/* Total Profit ex GST */}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => handleColumnSort('total_profit')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by total profit"
                >
                  <span className="flex items-center gap-1">
                    Profit ex GST
                    <HelpTooltip
                      content="Total profit excluding GST. Calculated as (Revenue - Cost - GST)."
                      title="Total Profit ex GST"
                    />
                  </span>
                  {getSortIcon('total_profit')}
                </button>
              </th>
              {/* Total Revenue ex GST */}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => handleColumnSort('total_revenue')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by total revenue"
                >
                  <span className="flex items-center gap-1">
                    Revenue ex GST
                    <HelpTooltip
                      content="Total revenue excluding GST. Calculated as (Selling Price × Number Sold) / 1.1."
                      title="Total Revenue ex GST"
                    />
                  </span>
                  {getSortIcon('total_revenue')}
                </button>
              </th>
              {/* Total Cost */}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                <button
                  onClick={() => handleColumnSort('total_cost')}
                  className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
                  aria-label="Sort by total cost"
                >
                  <span className="flex items-center gap-1">
                    Cost
                    <HelpTooltip
                      content="Total food cost. Calculated as Food Cost per Serving × Number Sold."
                      title="Total Cost"
                    />
                  </span>
                  {getSortIcon('total_cost')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
            {performanceItems.map((item, index) => (
              <tr
                key={item.id}
                className="group transition-colors hover:bg-[#2a2a2a]/20"
              >
                {/* Menu Item Class - Sticky with 2-Row Chip Layout */}
                <td className="sticky left-0 z-20 px-6 py-4 text-sm min-w-[160px] border-r border-[#2a2a2a] shadow-[2px_0_4px_rgba(0,0,0,0.3)] bg-[#1f1f1f] group-hover:bg-[#2a2a2a]/20 transition-colors">
                  <div className="flex flex-col gap-1.5">
                    {/* Row 1: Menu Item Class Chip */}
                    <span
                      className={`inline-block w-fit rounded-full px-3 py-1.5 text-xs font-medium ${
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
                    {/* Row 2: Profit & Popularity Categories */}
                    <div className="flex flex-wrap gap-1">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.profit_category === 'High'
                            ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                            : 'border border-red-500/30 bg-red-500/20 text-red-400'
                        }`}
                      >
                        {item.profit_category}
                      </span>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.popularity_category === 'High'
                            ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                            : 'border border-orange-500/30 bg-orange-500/20 text-orange-400'
                        }`}
                      >
                        {item.popularity_category}
                      </span>
                    </div>
                  </div>
                </td>
                {/* Dish Name - Sticky */}
                <td className="sticky left-[160px] z-20 px-6 py-4 text-sm font-medium text-white min-w-[200px] border-r border-[#2a2a2a] shadow-[2px_0_4px_rgba(0,0,0,0.3)] bg-[#1f1f1f] group-hover:bg-[#2a2a2a]/20 transition-colors">
                  {item.name}
                </td>
                {/* Gross Profit % */}
                <td className="px-6 py-4 text-sm">
                  <span className="font-semibold text-[#29E7CD]">
                    {formatPercentage(item.gross_profit_percentage)}
                  </span>
                </td>
                {/* Popularity % */}
                <td className="px-6 py-4 text-sm">
                  <span className="font-semibold text-[#3B82F6]">
                    {formatPercentage(item.popularity_percentage)}
                  </span>
                </td>
                {/* Combined Status */}
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`inline-block w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.profit_category === 'High'
                          ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                          : 'border border-red-500/30 bg-red-500/20 text-red-400'
                      }`}
                    >
                      {item.profit_category} Profit
                    </span>
                    <span
                      className={`inline-block w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.popularity_category === 'High'
                          ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                          : 'border border-orange-500/30 bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {item.popularity_category} Popularity
                    </span>
                  </div>
                </td>
                {/* Number Sold */}
                <td className="px-6 py-4 text-sm text-gray-300">
                  {formatNumber(item.number_sold)}
                </td>
                {/* Total Profit ex GST */}
                <td className="px-6 py-4 text-sm font-semibold text-white">
                  {formatCurrency(item.gross_profit * item.number_sold)}
                </td>
                {/* Total Revenue ex GST */}
                <td className="px-6 py-4 text-sm text-gray-300">
                  {formatCurrency((item.selling_price * item.number_sold) / 1.1)}
                </td>
                {/* Total Cost */}
                <td className="px-6 py-4 text-sm text-gray-300">
                  {formatCurrency(item.food_cost * item.number_sold)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
