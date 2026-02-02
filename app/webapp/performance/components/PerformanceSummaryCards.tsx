'use client';

import { useMemo } from 'react';
import { PerformanceItem } from '@/lib/types/performance';
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
      return <Icon icon={TrendingUp} size="sm" className="text-[var(--color-success)]" />;
    } else if (value < threshold) {
      return <Icon icon={TrendingDown} size="sm" className="text-[var(--color-error)]" />;
    }
    return <Icon icon={Minus} size="sm" className="text-[var(--foreground-muted)]" />;
  };

  if (performanceItems.length === 0) {
    return null;
  }

  return (
    <SummaryCardGrid className="tablet:mb-3 desktop:mb-4 mb-2" gap="sm">
      {/* Total Profit Card */}
      <div className="tablet:p-3 desktop:p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Icon icon={DollarSign} size="sm" className="text-[var(--primary)]" />
            <span className="text-fluid-xs text-[var(--foreground-muted)]">Total Profit</span>
          </div>
          {getTrendIcon(summary.totalProfit, 0)}
        </div>
        <div className="text-fluid-lg font-bold text-[var(--foreground)]">
          {formatCurrency(summary.totalProfit)}
        </div>
        <div className="text-fluid-xs mt-0.5 text-[var(--foreground-muted)]">ex GST</div>
      </div>

      {/* Average Profit Margin Card */}
      <div className="tablet:p-3 desktop:p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Icon icon={BarChart3} size="sm" className="text-[var(--color-info)]" />
            <span className="text-fluid-xs text-[var(--foreground-muted)]">Avg Margin</span>
          </div>
          {getTrendIcon(summary.averageProfitMargin, 70)}
        </div>
        <div className="text-fluid-lg font-bold text-[var(--foreground)]">
          {formatPercentage(summary.averageProfitMargin)}
        </div>
        <div className="text-fluid-xs mt-0.5 text-[var(--foreground-muted)]">across all items</div>
      </div>

      {/* Category Breakdown Card */}
      <div className="tablet:p-3 desktop:p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Icon icon={Package} size="sm" className="text-[var(--accent)]" />
          <span className="text-fluid-xs text-[var(--foreground-muted)]">Categories</span>
        </div>
        <div className="space-y-0.5">
          <div className="text-fluid-xs flex items-center justify-between">
            <span className="text-[var(--color-success)]">Chef&apos;s Kiss</span>
            <span className="font-semibold text-[var(--foreground)]">
              {summary.categoryCounts["Chef's Kiss"]}
            </span>
          </div>
          <div className="text-fluid-xs flex items-center justify-between">
            <span className="text-[var(--color-info)]">Hidden Gem</span>
            <span className="font-semibold text-[var(--foreground)]">
              {summary.categoryCounts['Hidden Gem']}
            </span>
          </div>
          <div className="text-fluid-xs flex items-center justify-between">
            <span className="text-[var(--color-warning)]">Bargain</span>
            <span className="font-semibold text-[var(--foreground)]">
              {summary.categoryCounts['Bargain Bucket']}
            </span>
          </div>
          <div className="text-fluid-xs flex items-center justify-between">
            <span className="text-[var(--color-error)]">Burnt Toast</span>
            <span className="font-semibold text-[var(--foreground)]">
              {summary.categoryCounts['Burnt Toast']}
            </span>
          </div>
        </div>
      </div>

      {/* Top Performer Card */}
      <div className="tablet:p-3 desktop:p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Icon icon={Award} size="sm" className="text-[var(--color-warning)]" />
          <span className="text-fluid-xs text-[var(--foreground-muted)]">Top Performer</span>
        </div>
        {summary.topPerformer ? (
          <>
            <div className="text-fluid-sm truncate font-semibold text-[var(--foreground)]">
              {summary.topPerformer.name}
            </div>
            <div className="text-fluid-xs mt-0.5 text-[var(--foreground-muted)]">
              {formatCurrency(summary.topPerformer.gross_profit * summary.topPerformer.number_sold)}{' '}
              profit
            </div>
          </>
        ) : (
          <div className="text-fluid-xs text-[var(--foreground-muted)]">No data</div>
        )}
      </div>
    </SummaryCardGrid>
  );
}
