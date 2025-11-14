'use client';

import { MenuStatistics } from '../types';

interface MenuStatisticsPanelProps {
  statistics: MenuStatistics;
}

export default function MenuStatisticsPanel({ statistics }: MenuStatisticsPanelProps) {
  return (
    <div className="mb-6 rounded-xl bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Menu Statistics</h3>
      <div className="grid grid-cols-2 gap-4 desktop:grid-cols-5">
        <div>
          <div className="text-xs text-gray-400">Total Dishes</div>
          <div className="text-2xl font-bold text-white">{statistics.total_dishes}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Total COGS</div>
          <div className="text-2xl font-bold text-white">${statistics.total_cogs.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Total Revenue</div>
          <div className="text-2xl font-bold text-green-400">
            ${statistics.total_revenue.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Avg Profit Margin</div>
          <div
            className={`text-2xl font-bold ${
              statistics.average_profit_margin >= 30 ? 'text-green-400' : 'text-yellow-400'
            }`}
          >
            {statistics.average_profit_margin.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Food Cost %</div>
          <div className="text-2xl font-bold text-white">
            {statistics.food_cost_percent.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
