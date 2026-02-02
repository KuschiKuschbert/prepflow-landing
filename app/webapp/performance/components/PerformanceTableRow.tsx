'use client';

import { memo } from 'react';
import { PerformanceItem } from '@/lib/types/performance';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/performanceUtils';

interface PerformanceTableRowProps {
  item: PerformanceItem;
}

function PerformanceTableRowComponent({ item }: PerformanceTableRowProps) {
  return (
    <tr className="group transition-colors hover:bg-[var(--muted)]/20">
      <td className="sticky left-0 z-20 min-w-[160px] border-r border-[var(--border)] bg-[var(--surface)] px-6 py-4 text-sm shadow-[2px_0_4px_rgba(0,0,0,0.3)] transition-colors group-hover:bg-[var(--muted)]/20">
        <div className="flex flex-col gap-1.5">
          <span
            className={`inline-block w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${
              item.menu_item_class === "Chef's Kiss"
                ? 'border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success)]'
                : item.menu_item_class === 'Hidden Gem'
                  ? 'border-[var(--color-info-border)] bg-[var(--color-info-bg)] text-[var(--color-info)]'
                  : item.menu_item_class === 'Bargain Bucket'
                    ? 'border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
                    : 'border-[var(--color-error-border)] bg-[var(--color-error-bg)] text-[var(--color-error)]'
            }`}
          >
            {item.menu_item_class}
          </span>
          <div className="flex flex-wrap gap-1">
            <span
              className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${
                item.profit_category === 'High'
                  ? 'border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success)]'
                  : 'border-[var(--color-error-border)] bg-[var(--color-error-bg)] text-[var(--color-error)]'
              }`}
            >
              {item.profit_category}
            </span>
            <span
              className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${
                item.popularity_category === 'High'
                  ? 'border-[var(--color-info-border)] bg-[var(--color-info-bg)] text-[var(--color-info)]'
                  : 'border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
              }`}
            >
              {item.popularity_category}
            </span>
          </div>
        </div>
      </td>
      <td className="sticky left-[160px] z-20 min-w-[200px] border-r border-[var(--border)] bg-[var(--surface)] px-6 py-4 text-sm font-medium text-[var(--foreground)] shadow-[2px_0_4px_rgba(0,0,0,0.3)] transition-colors group-hover:bg-[var(--muted)]/20">
        {item.name}
      </td>
      <td className="px-6 py-4 text-sm">
        <span className="font-semibold text-[var(--primary)]">
          {formatPercentage(item.gross_profit_percentage)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">
        <span className="font-semibold text-[var(--color-info)]">
          {formatPercentage(item.popularity_percentage)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="flex flex-col gap-1">
          <span
            className={`inline-block w-fit rounded-full border px-2 py-0.5 text-xs font-semibold ${
              item.profit_category === 'High'
                ? 'border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success)]'
                : 'border-[var(--color-error-border)] bg-[var(--color-error-bg)] text-[var(--color-error)]'
            }`}
          >
            {item.profit_category} Profit
          </span>
          <span
            className={`inline-block w-fit rounded-full border px-2 py-0.5 text-xs font-semibold ${
              item.popularity_category === 'High'
                ? 'border-[var(--color-info-border)] bg-[var(--color-info-bg)] text-[var(--color-info)]'
                : 'border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
            }`}
          >
            {item.popularity_category} Popularity
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-[var(--foreground-secondary)]">
        {formatNumber(item.number_sold)}
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
        {formatCurrency(item.gross_profit * item.number_sold)}
      </td>
      <td className="px-6 py-4 text-sm text-[var(--foreground-secondary)]">
        {formatCurrency((item.selling_price * item.number_sold) / 1.1)}
      </td>
      <td className="px-6 py-4 text-sm text-[var(--foreground-secondary)]">
        {formatCurrency(item.food_cost * item.number_sold)}
      </td>
    </tr>
  );
}

// Memoize component to prevent unnecessary re-renders when props don't change
export const PerformanceTableRow = memo(PerformanceTableRowComponent, (prevProps, nextProps) => {
  // Only re-render if item id or item reference changed
  return prevProps.item.id === nextProps.item.id && prevProps.item === nextProps.item;
});
