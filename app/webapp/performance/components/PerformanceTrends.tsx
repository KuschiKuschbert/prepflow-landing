'use client';

import { useMemo, useState } from 'react';
import { PerformanceItem } from '../types';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);

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
      return <Icon icon={TrendingUp} size="sm" className="text-[var(--color-success)]" />;
    } else if (change < 0) {
      return <Icon icon={TrendingDown} size="sm" className="text-[var(--color-error)]" />;
    }
    return <Icon icon={Minus} size="sm" className="text-[var(--foreground-muted)]" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-[var(--color-success)]';
    if (change < 0) return 'text-[var(--color-error)]';
    return 'text-[var(--foreground-muted)]';
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
    <div className="tablet:mb-3 tablet:p-2 desktop:mb-4 desktop:p-3 mb-2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2">
      {/* Always visible header */}
      <div className="tablet:p-2 desktop:p-3 p-1.5">
        <div className="tablet:mb-1.5 mb-1 flex items-center justify-between">
          <div>
            <h3 className="mb-0.5 text-sm font-semibold text-[var(--foreground)]">
              Trend Analysis
            </h3>
            <p className="text-xs text-[var(--foreground-muted)]">
              Comparing current period to {getPreviousPeriodLabel()}
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--foreground-secondary)] transition-colors hover:border-[var(--primary)]/50 hover:text-[var(--primary)]"
          >
            <span>{isExpanded ? 'Hide' : 'Show'} Trends</span>
            <Icon icon={isExpanded ? ChevronUp : ChevronDown} size="xs" />
          </button>
        </div>
      </div>

      {/* Expandable content */}
      {isExpanded && (
        <div className="tablet:p-2 desktop:p-3 border-t border-[var(--border)] bg-[var(--muted)]/30 p-1.5">
          <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-2">
            {/* Profit Trend */}
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-[var(--foreground-muted)]">Total Profit</span>
                {getTrendIcon(trends.profitChange)}
              </div>
              <div className="mb-0.5 text-base font-bold text-[var(--foreground)]">
                {formatCurrency(trends.currentTotalProfit)}
              </div>
              <div className={`text-xs font-semibold ${getTrendColor(trends.profitChange)}`}>
                {trends.profitChange > 0 ? '+' : ''}
                {trends.profitChange.toFixed(1)}% vs previous
              </div>
              <div className="mt-0.5 text-xs text-[var(--foreground-subtle)]">
                Previous: {formatCurrency(trends.previousTotalProfit)}
              </div>
            </div>

            {/* Revenue Trend */}
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-[var(--foreground-muted)]">Total Revenue</span>
                {getTrendIcon(trends.revenueChange)}
              </div>
              <div className="mb-0.5 text-base font-bold text-[var(--foreground)]">
                {formatCurrency(trends.currentTotalRevenue)}
              </div>
              <div className={`text-xs font-semibold ${getTrendColor(trends.revenueChange)}`}>
                {trends.revenueChange > 0 ? '+' : ''}
                {trends.revenueChange.toFixed(1)}% vs previous
              </div>
              <div className="mt-0.5 text-xs text-[var(--foreground-subtle)]">
                Previous: {formatCurrency(trends.previousTotalRevenue)}
              </div>
            </div>

            {/* Units Sold Trend */}
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-[var(--foreground-muted)]">Units Sold</span>
                {getTrendIcon(trends.soldChange)}
              </div>
              <div className="mb-0.5 text-base font-bold text-[var(--foreground)]">
                {formatNumber(trends.currentTotalSold)}
              </div>
              <div className={`text-xs font-semibold ${getTrendColor(trends.soldChange)}`}>
                {trends.soldChange > 0 ? '+' : ''}
                {trends.soldChange.toFixed(1)}% vs previous
              </div>
              <div className="mt-0.5 text-xs text-[var(--foreground-subtle)]">
                Previous: {formatNumber(trends.previousTotalSold)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
