'use client';

import { Icon } from '@/components/ui/Icon';
import { Package, Percent, TrendingUp } from 'lucide-react';
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
    <div className="tablet:grid-cols-3 desktop:grid-cols-3 mb-4 grid grid-cols-1 gap-3">
      {/* Total Items */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-3 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium text-gray-400">Menu Items</p>
            <p className="text-xl font-bold text-white">{stats.total_items}</p>
            {(stats.total_dishes > 0 || stats.total_recipes > 0) && (
              <p className="mt-0.5 text-[10px] text-gray-500">
                {stats.total_dishes} dishes, {stats.total_recipes} recipes
              </p>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
            <Icon icon={Package} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
          </div>
        </div>
      </div>

      {/* Average Profit Margin */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-3 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium text-gray-400">Avg. Profit Margin</p>
            <p
              className={`text-xl font-bold ${
                stats.average_profit_margin >= 60
                  ? 'text-green-400'
                  : stats.average_profit_margin >= 50
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }`}
            >
              {stats.average_profit_margin.toFixed(1)}%
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500">
              {stats.average_profit_margin >= 60
                ? 'Excellent'
                : stats.average_profit_margin >= 50
                  ? 'Good'
                  : 'Needs improvement'}
            </p>
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${
              stats.average_profit_margin >= 60
                ? 'from-green-500/20 to-green-500/10'
                : stats.average_profit_margin >= 50
                  ? 'from-yellow-500/20 to-yellow-500/10'
                  : 'from-red-500/20 to-red-500/10'
            }`}
          >
            <Icon
              icon={TrendingUp}
              size="sm"
              className={
                stats.average_profit_margin >= 60
                  ? 'text-green-400'
                  : stats.average_profit_margin >= 50
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }
              aria-hidden={true}
            />
          </div>
        </div>
      </div>

      {/* Food Cost % */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-3 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium text-gray-400">Food Cost %</p>
            <p
              className={`text-xl font-bold ${
                stats.food_cost_percent <= 30
                  ? 'text-green-400'
                  : stats.food_cost_percent <= 35
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }`}
            >
              {stats.food_cost_percent.toFixed(1)}%
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500">
              {stats.food_cost_percent <= 30
                ? 'Ideal range'
                : stats.food_cost_percent <= 35
                  ? 'Acceptable'
                  : 'Too high'}
            </p>
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${
              stats.food_cost_percent <= 30
                ? 'from-green-500/20 to-green-500/10'
                : stats.food_cost_percent <= 35
                  ? 'from-yellow-500/20 to-yellow-500/10'
                  : 'from-red-500/20 to-red-500/10'
            }`}
          >
            <Icon
              icon={Percent}
              size="sm"
              className={
                stats.food_cost_percent <= 30
                  ? 'text-green-400'
                  : stats.food_cost_percent <= 35
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }
              aria-hidden={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
