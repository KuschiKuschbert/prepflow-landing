'use client';

import { useMemo } from 'react';
import { PerformanceItem } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface PerformanceTrendsProps {
  currentItems: PerformanceItem[];
  previousItems?: PerformanceItem[];
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

export default function PerformanceTrends({
  currentItems,
  previousItems,
  dateRange,
}: PerformanceTrendsProps) {
  const trends = useMemo(() => {
    if (!previousItems || previousItems.length === 0) {
      return null;
    }

    // Calculate current period totals
    const currentTotalProfit = currentItems.reduce(
      (sum, item) => sum + item.gross_profit * item.number_sold,
      0,
    );
    const currentTotalRevenue = currentItems.reduce(
      (sum, item) => sum + (item.selling_price * item.number_sold) / 1.1,
      0,
    );
    const currentTotalSold = currentItems.reduce((sum, item) => sum + item.number_sold, 0);

    // Calculate previous period totals
    const previousTotalProfit = previousItems.reduce(
      (sum, item) => sum + item.gross_profit * item.number_sold,
      0,
    );
    const previousTotalRevenue = previousItems.reduce(
      (sum, item) => sum + (item.selling_price * item.number_sold) / 1.1,
      0,
    );
    const previousTotalSold = previousItems.reduce((sum, item) => sum + item.number_sold, 0);

    // Calculate changes
    const profitChange =
      previousTotalProfit > 0
        ? ((currentTotalProfit - previousTotalProfit) / previousTotalProfit) * 100
        : 0;
    const revenueChange =
      previousTotalRevenue > 0
        ? ((currentTotalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100
        : 0;
    const soldChange =
      previousTotalSold > 0
        ? ((currentTotalSold - previousTotalSold) / previousTotalSold) * 100
        : 0;

    return {
      profitChange,
      revenueChange,
      soldChange,
      currentTotalProfit,
      previousTotalProfit,
      currentTotalRevenue,
      previousTotalRevenue,
      currentTotalSold,
      previousTotalSold,
    };
  }, [currentItems, previousItems]);

  if (!trends) {
    return null;
  }

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

  const getTrendIcon = (change: number) => {
    if (change > 0) {
      return <Icon icon={TrendingUp} size="sm" className="text-green-400" />;
    } else if (change < 0) {
      return <Icon icon={TrendingDown} size="sm" className="text-red-400" />;
    }
    return <Icon icon={Minus} size="sm" className="text-gray-400" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  // Calculate previous period dates for display
  const getPreviousPeriodLabel = () => {
    if (!dateRange.startDate || !dateRange.endDate) return 'Previous Period';

    const daysDiff = Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const previousEndDate = new Date(dateRange.startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    const previousStartDate = new Date(previousEndDate);
    previousStartDate.setDate(previousStartDate.getDate() - daysDiff + 1);

    return `${previousStartDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} - ${previousEndDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}`;
  };

  return (
    <div className="tablet:mb-4 tablet:p-4 desktop:mb-6 desktop:p-6 mb-3 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-3">
      <h3 className="mb-2 text-base font-semibold text-white">Trend Analysis</h3>
      <p className="mb-3 text-xs text-gray-400">
        Comparing current period to {getPreviousPeriodLabel()}
      </p>

      <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-3">
        {/* Profit Trend */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-gray-400">Total Profit</span>
            {getTrendIcon(trends.profitChange)}
          </div>
          <div className="mb-1 text-lg font-bold text-white">
            {formatCurrency(trends.currentTotalProfit)}
          </div>
          <div className={`text-xs font-semibold ${getTrendColor(trends.profitChange)}`}>
            {trends.profitChange > 0 ? '+' : ''}
            {trends.profitChange.toFixed(1)}% vs previous
          </div>
          <div className="mt-0.5 text-xs text-gray-500">
            Previous: {formatCurrency(trends.previousTotalProfit)}
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-gray-400">Total Revenue</span>
            {getTrendIcon(trends.revenueChange)}
          </div>
          <div className="mb-1 text-lg font-bold text-white">
            {formatCurrency(trends.currentTotalRevenue)}
          </div>
          <div className={`text-xs font-semibold ${getTrendColor(trends.revenueChange)}`}>
            {trends.revenueChange > 0 ? '+' : ''}
            {trends.revenueChange.toFixed(1)}% vs previous
          </div>
          <div className="mt-0.5 text-xs text-gray-500">
            Previous: {formatCurrency(trends.previousTotalRevenue)}
          </div>
        </div>

        {/* Units Sold Trend */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-gray-400">Units Sold</span>
            {getTrendIcon(trends.soldChange)}
          </div>
          <div className="mb-1 text-lg font-bold text-white">
            {formatNumber(trends.currentTotalSold)}
          </div>
          <div className={`text-xs font-semibold ${getTrendColor(trends.soldChange)}`}>
            {trends.soldChange > 0 ? '+' : ''}
            {trends.soldChange.toFixed(1)}% vs previous
          </div>
          <div className="mt-0.5 text-xs text-gray-500">
            Previous: {formatNumber(trends.previousTotalSold)}
          </div>
        </div>
      </div>
    </div>
  );
}
