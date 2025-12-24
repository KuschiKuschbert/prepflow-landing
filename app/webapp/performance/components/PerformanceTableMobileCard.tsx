'use client';

import { memo } from 'react';
import { PerformanceItem } from '../types';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/performanceUtils';

interface PerformanceTableMobileCardProps {
  item: PerformanceItem;
}

function PerformanceTableMobileCardComponent({ item }: PerformanceTableMobileCardProps) {
  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">{item.name}</h3>
          <span
            className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${
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
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-xs text-[var(--foreground-muted)]">Gross Profit %</p>
          <p className="text-sm font-semibold text-[var(--primary)]">
            {formatPercentage(item.gross_profit_percentage)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-[var(--foreground-muted)]">Popularity %</p>
          <p className="text-sm font-semibold text-[var(--color-info)]">
            {formatPercentage(item.popularity_percentage)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-[var(--foreground-muted)]">Sold</p>
          <p className="text-sm text-[var(--foreground-secondary)]">
            {formatNumber(item.number_sold)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-[var(--foreground-muted)]">Profit ex GST</p>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {formatCurrency(item.gross_profit * item.number_sold)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-[var(--foreground-muted)]">Revenue ex GST</p>
          <p className="text-sm text-[var(--foreground-secondary)]">
            {formatCurrency((item.selling_price * item.number_sold) / 1.1)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-[var(--foreground-muted)]">Cost</p>
          <p className="text-sm text-[var(--foreground-secondary)]">
            {formatCurrency(item.food_cost * item.number_sold)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-2">
        <span
          className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${
            item.profit_category === 'High'
              ? 'border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success)]'
              : 'border-[var(--color-error-border)] bg-[var(--color-error-bg)] text-[var(--color-error)]'
          }`}
        >
          {item.profit_category} Profit
        </span>
        <span
          className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${
            item.popularity_category === 'High'
              ? 'border-[var(--color-info-border)] bg-[var(--color-info-bg)] text-[var(--color-info)]'
              : 'border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
          }`}
        >
          {item.popularity_category} Popularity
        </span>
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders when props don't change
export const PerformanceTableMobileCard = memo(
  PerformanceTableMobileCardComponent,
  (prevProps, nextProps) => {
    // Only re-render if item id or item reference changed
    return prevProps.item.id === nextProps.item.id && prevProps.item === nextProps.item;
  },
);
