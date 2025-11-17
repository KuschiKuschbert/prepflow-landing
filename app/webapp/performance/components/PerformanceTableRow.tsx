'use client';

import { PerformanceItem } from '../types';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/performanceUtils';

interface PerformanceTableRowProps {
  item: PerformanceItem;
}

export function PerformanceTableRow({ item }: PerformanceTableRowProps) {
  return (
    <tr className="group transition-colors hover:bg-[#2a2a2a]/20">
      <td className="sticky left-0 z-20 min-w-[160px] border-r border-[#2a2a2a] bg-[#1f1f1f] px-6 py-4 text-sm shadow-[2px_0_4px_rgba(0,0,0,0.3)] transition-colors group-hover:bg-[#2a2a2a]/20">
        <div className="flex flex-col gap-1.5">
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
      <td className="sticky left-[160px] z-20 min-w-[200px] border-r border-[#2a2a2a] bg-[#1f1f1f] px-6 py-4 text-sm font-medium text-white shadow-[2px_0_4px_rgba(0,0,0,0.3)] transition-colors group-hover:bg-[#2a2a2a]/20">
        {item.name}
      </td>
      <td className="px-6 py-4 text-sm">
        <span className="font-semibold text-[#29E7CD]">
          {formatPercentage(item.gross_profit_percentage)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">
        <span className="font-semibold text-[#3B82F6]">
          {formatPercentage(item.popularity_percentage)}
        </span>
      </td>
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
      <td className="px-6 py-4 text-sm text-gray-300">{formatNumber(item.number_sold)}</td>
      <td className="px-6 py-4 text-sm font-semibold text-white">
        {formatCurrency(item.gross_profit * item.number_sold)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-300">
        {formatCurrency((item.selling_price * item.number_sold) / 1.1)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-300">
        {formatCurrency(item.food_cost * item.number_sold)}
      </td>
    </tr>
  );
}
