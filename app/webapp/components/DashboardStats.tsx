'use client';

import { useTranslation } from '@/lib/useTranslation';

interface DashboardStatsProps {
  stats: {
    totalIngredients: number;
    totalRecipes: number;
    averageDishPrice: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {/* Ingredients Count */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:shadow-xl md:rounded-3xl md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-medium text-gray-400 md:text-sm">Total Ingredients</p>
            <p className="text-2xl font-bold text-white md:text-3xl">{stats.totalIngredients}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 md:h-12 md:w-12 md:rounded-2xl">
            <span className="text-xl md:text-2xl">🥘</span>
          </div>
        </div>
        <div className="mt-3 md:mt-4">
          <p className="text-xs text-gray-500">Kitchen inventory items</p>
        </div>
      </div>

      {/* Recipes Count */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:shadow-xl md:rounded-3xl md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-medium text-gray-400 md:text-sm">Total Recipes</p>
            <p className="text-2xl font-bold text-white md:text-3xl">{stats.totalRecipes}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/10 md:h-12 md:w-12 md:rounded-2xl">
            <span className="text-xl md:text-2xl">📖</span>
          </div>
        </div>
        <div className="mt-3 md:mt-4">
          <p className="text-xs text-gray-500">Recipe cards created</p>
        </div>
      </div>

      {/* Average Price */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:shadow-xl md:rounded-3xl md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-medium text-gray-400 md:text-sm">Avg. Dish Price</p>
            <p className="text-2xl font-bold text-white md:text-3xl">
              ${stats.averageDishPrice.toFixed(2)}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/10 md:h-12 md:w-12 md:rounded-2xl">
            <span className="text-xl md:text-2xl">💰</span>
          </div>
        </div>
        <div className="mt-3 md:mt-4">
          <p className="text-xs text-gray-500">Average selling price</p>
        </div>
      </div>
    </div>
  );
}
