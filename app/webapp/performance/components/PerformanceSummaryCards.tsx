'use client';

import { useMemo } from 'react';
import { PerformanceItem } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  DollarSign,
  Package,
  BarChart3,
} from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { SummaryCardGrid } from '@/components/ui/SummaryCardGrid';

interface PerformanceSummaryCardsProps {
  performanceItems: PerformanceItem[];
}

export default function PerformanceSummaryCards({
  performanceItems,
}: PerformanceSummaryCardsProps) {
  const summary = useMemo(() => {
    if (performanceItems.length === 0) {
      return {
        totalProfit: 0,
        averageProfitMargin: 0,
        categoryCounts: {
          "Chef's Kiss": 0,
          'Hidden Gem': 0,
          'Bargain Bucket': 0,
          'Burnt Toast': 0,
        },
        topPerformer: null as PerformanceItem | null,
      };
    }

    // Calculate totals
    const totalProfit = performanceItems.reduce(
      (sum, item) => sum + item.gross_profit * item.number_sold,
      0,
    );

    // Calculate average profit margin
    const averageProfitMargin =
      performanceItems.reduce((sum, item) => sum + item.gross_profit_percentage, 0) /
      performanceItems.length;

    // Count by category
    const categoryCounts = {
      "Chef's Kiss": performanceItems.filter(item => item.menu_item_class === "Chef's Kiss").length,
      'Hidden Gem': performanceItems.filter(item => item.menu_item_class === 'Hidden Gem').length,
      'Bargain Bucket': performanceItems.filter(item => item.menu_item_class === 'Bargain Bucket')
        .length,
      'Burnt Toast': performanceItems.filter(item => item.menu_item_class === 'Burnt Toast').length,
    };

    // Find top performer (highest total profit)
    const topPerformer = performanceItems.reduce(
      (top, item) => {
        const itemProfit = item.gross_profit * item.number_sold;
        const topProfit = top ? top.gross_profit * top.number_sold : 0;
        return itemProfit > topProfit ? item : top;
      },
      null as PerformanceItem | null,
    );

    return {
      totalProfit,
      averageProfitMargin,
      categoryCounts,
      topPerformer,
    };
  }, [performanceItems]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) {
      return <Icon icon={TrendingUp} size="sm" className="text-green-400" />;
    } else if (value < threshold) {
      return <Icon icon={TrendingDown} size="sm" className="text-red-400" />;
    }
    return <Icon icon={Minus} size="sm" className="text-gray-400" />;
  };

  if (performanceItems.length === 0) {
    return null;
  }

  return (
    <SummaryCardGrid className="tablet:mb-3 desktop:mb-4 mb-2" gap="sm">
      {/* Total Profit Card */}
      <div className="tablet:p-3 desktop:p-4 rounded-xl border border-[#2a2a2a] bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a]/50 p-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Icon icon={DollarSign} size="sm" className="text-[#29E7CD]" />
            <span className="text-fluid-xs text-gray-400">Total Profit</span>
          </div>
          {getTrendIcon(summary.totalProfit, 0)}
        </div>
        <div className="text-fluid-lg font-bold text-white">
          {formatCurrency(summary.totalProfit)}
        </div>
        <div className="text-fluid-xs mt-0.5 text-gray-500">ex GST</div>
      </div>

      {/* Average Profit Margin Card */}
      <div className="tablet:p-3 desktop:p-4 rounded-xl border border-[#2a2a2a] bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a]/50 p-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Icon icon={BarChart3} size="sm" className="text-[#3B82F6]" />
            <span className="text-fluid-xs text-gray-400">Avg Margin</span>
          </div>
          {getTrendIcon(summary.averageProfitMargin, 70)}
        </div>
        <div className="text-fluid-lg font-bold text-white">
          {formatPercentage(summary.averageProfitMargin)}
        </div>
        <div className="text-fluid-xs mt-0.5 text-gray-500">across all items</div>
      </div>

      {/* Category Breakdown Card */}
      <div className="tablet:p-3 desktop:p-4 rounded-xl border border-[#2a2a2a] bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a]/50 p-2.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Icon icon={Package} size="sm" className="text-[#D925C7]" />
          <span className="text-fluid-xs text-gray-400">Categories</span>
        </div>
        <div className="space-y-0.5">
          <div className="text-fluid-xs flex items-center justify-between">
            <span className="text-green-400">Chef&apos;s Kiss</span>
            <span className="font-semibold text-white">
              {summary.categoryCounts["Chef's Kiss"]}
            </span>
          </div>
          <div className="text-fluid-xs flex items-center justify-between">
            <span className="text-blue-400">Hidden Gem</span>
            <span className="font-semibold text-white">{summary.categoryCounts['Hidden Gem']}</span>
          </div>
          <div className="text-fluid-xs flex items-center justify-between">
            <span className="text-yellow-400">Bargain</span>
            <span className="font-semibold text-white">
              {summary.categoryCounts['Bargain Bucket']}
            </span>
          </div>
          <div className="text-fluid-xs flex items-center justify-between">
            <span className="text-red-400">Burnt Toast</span>
            <span className="font-semibold text-white">
              {summary.categoryCounts['Burnt Toast']}
            </span>
          </div>
        </div>
      </div>

      {/* Top Performer Card */}
      <div className="tablet:p-3 desktop:p-4 rounded-xl border border-[#2a2a2a] bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a]/50 p-2.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Icon icon={Award} size="sm" className="text-yellow-400" />
          <span className="text-fluid-xs text-gray-400">Top Performer</span>
        </div>
        {summary.topPerformer ? (
          <>
            <div className="text-fluid-sm truncate font-semibold text-white">
              {summary.topPerformer.name}
            </div>
            <div className="text-fluid-xs mt-0.5 text-gray-500">
              {formatCurrency(summary.topPerformer.gross_profit * summary.topPerformer.number_sold)}{' '}
              profit
            </div>
          </>
        ) : (
          <div className="text-fluid-xs text-gray-500">No data</div>
        )}
      </div>
    </SummaryCardGrid>
  );
}
