'use client';

import { MenuStatistics } from '../types';

interface MenuStatisticsPanelProps {
  statistics: MenuStatistics;
}

export default function MenuStatisticsPanel({ statistics }: MenuStatisticsPanelProps) {
  // Ensure all statistics fields exist with defaults
  const stats = {
    total_items: statistics?.total_items ?? 0,
    total_dishes: statistics?.total_dishes ?? 0,
    total_recipes: statistics?.total_recipes ?? 0,
    total_cogs: statistics?.total_cogs ?? 0,
    total_revenue: statistics?.total_revenue ?? 0,
    gross_profit: statistics?.gross_profit ?? 0,
    average_profit_margin: statistics?.average_profit_margin ?? 0,
    food_cost_percent: statistics?.food_cost_percent ?? 0,
  };

  return (
    <div className="mb-6 rounded-xl border border-[#2a2a2a] bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Menu Statistics</h3>
      <div className="desktop:grid-cols-4 grid grid-cols-2 gap-4">
        {/* Total COGS */}
        <div className="rounded-lg border border-[#2a2a2a]/50 bg-[#1f1f1f]/50 p-4">
          <div className="mb-1 text-xs text-gray-400">Total COGS</div>
          <div className="text-2xl font-bold text-red-400">${stats.total_cogs.toFixed(2)}</div>
        </div>

        {/* Total Revenue */}
        <div className="rounded-lg border border-[#2a2a2a]/50 bg-[#1f1f1f]/50 p-4">
          <div className="mb-1 text-xs text-gray-400">Total Revenue</div>
          <div className="text-2xl font-bold text-green-400">${stats.total_revenue.toFixed(2)}</div>
        </div>

        {/* Gross Profit */}
        <div className="rounded-lg border border-[#2a2a2a]/50 bg-[#1f1f1f]/50 p-4">
          <div className="mb-1 text-xs text-gray-400">Gross Profit</div>
          <div
            className={`text-2xl font-bold ${stats.gross_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            ${stats.gross_profit.toFixed(2)}
          </div>
        </div>

        {/* Food Cost % */}
        <div className="rounded-lg border border-[#2a2a2a]/50 bg-[#1f1f1f]/50 p-4">
          <div className="mb-1 text-xs text-gray-400">Food Cost %</div>
          <div
            className={`text-2xl font-bold ${
              stats.food_cost_percent <= 30
                ? 'text-green-400'
                : stats.food_cost_percent <= 35
                  ? 'text-yellow-400'
                  : 'text-red-400'
            }`}
          >
            {stats.food_cost_percent.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
