'use client';

import { PerformanceItem } from '../types';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/performanceUtils';

interface PerformanceTableMobileCardProps {
  item: PerformanceItem;
}

export function PerformanceTableMobileCard({ item }: PerformanceTableMobileCardProps) {
  return (
    <div className="space-y-4 rounded-xl border border-[#3a3a3a] bg-[#2a2a2a]/30 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-white">{item.name}</h3>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-xs text-gray-400">Gross Profit %</p>
          <p className="text-sm font-semibold text-[#29E7CD]">
            {formatPercentage(item.gross_profit_percentage)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-400">Popularity %</p>
          <p className="text-sm font-semibold text-[#3B82F6]">
            {formatPercentage(item.popularity_percentage)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-400">Sold</p>
          <p className="text-sm text-gray-300">{formatNumber(item.number_sold)}</p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-400">Profit ex GST</p>
          <p className="text-sm font-semibold text-white">
            {formatCurrency(item.gross_profit * item.number_sold)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-400">Revenue ex GST</p>
          <p className="text-sm text-gray-300">
            {formatCurrency((item.selling_price * item.number_sold) / 1.1)}
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs text-gray-400">Cost</p>
          <p className="text-sm text-gray-300">
            {formatCurrency(item.food_cost * item.number_sold)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[#3a3a3a] pt-2">
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            item.profit_category === 'High'
              ? 'border border-green-500/30 bg-green-500/20 text-green-400'
              : 'border border-red-500/30 bg-red-500/20 text-red-400'
          }`}
        >
          {item.profit_category} Profit
        </span>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            item.popularity_category === 'High'
              ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
              : 'border border-orange-500/30 bg-orange-500/20 text-orange-400'
          }`}
        >
          {item.popularity_category} Popularity
        </span>
      </div>
    </div>
  );
}

