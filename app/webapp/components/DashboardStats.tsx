'use client';

import { useTranslation } from '@/lib/useTranslation';

interface DashboardStatsProps {
  stats: {
    totalIngredients: number;
    totalRecipes: number;
    totalMenuDishes: number;
    averageDishPrice: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Ingredients Count */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-400">Total Ingredients</p>
            <p className="text-3xl font-bold text-white">{stats.totalIngredients}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
            <span className="text-2xl">🥘</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs text-gray-500">Kitchen inventory items</p>
        </div>
      </div>

      {/* Recipes Count */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-400">Total Recipes</p>
            <p className="text-3xl font-bold text-white">{stats.totalRecipes}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/10">
            <span className="text-2xl">📖</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs text-gray-500">Recipe cards created</p>
        </div>
      </div>

      {/* Menu Dishes Count */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-400">Menu Dishes</p>
            <p className="text-3xl font-bold text-white">{stats.totalMenuDishes}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D925C7]/20 to-[#D925C7]/10">
            <span className="text-2xl">🍽️</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs text-gray-500">Items on your menu</p>
        </div>
      </div>

      {/* Average Price */}
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-400">Avg. Dish Price</p>
            <p className="text-3xl font-bold text-white">${stats.averageDishPrice.toFixed(2)}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/10">
            <span className="text-2xl">💰</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs text-gray-500">Average selling price</p>
        </div>
      </div>
    </div>
  );
}
