'use client';

import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { PerformanceSortField } from '../hooks/usePerformanceTableSort';

interface PerformanceTableHeaderProps {
  handleColumnSort: (field: PerformanceSortField) => void;
  getSortIcon: (field: PerformanceSortField) => React.ReactNode;
}

export function PerformanceTableHeader({
  handleColumnSort,
  getSortIcon,
}: PerformanceTableHeaderProps) {
  return (
    <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
          <span className="flex items-center gap-1">
            Class
            <HelpTooltip
              content="Menu item classification based on profit and popularity categories."
              title="Menu Item Class"
            />
          </span>
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
          <button
            onClick={() => handleColumnSort('name')}
            className="flex items-center gap-1 transition-colors hover:text-[#29E7CD]"
            aria-label="Sort by dish name"
          >
            Dish
            {getSortIcon('name')}
          </button>
        </th>
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
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
          <span className="flex items-center gap-1">
            Status
            <HelpTooltip
              content="Combined profit and popularity categories. High/High = Chef's Kiss, High/Low = Hidden Gem, Low/High = Bargain Bucket, Low/Low = Burnt Toast."
              title="Status"
            />
          </span>
        </th>
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
  );
}
