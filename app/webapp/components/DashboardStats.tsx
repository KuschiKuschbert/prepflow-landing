'use client';

import { useTranslation } from '@/lib/useTranslation';
import { Utensils, BookOpen, DollarSign } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { SummaryCardGrid } from '@/components/ui/SummaryCardGrid';

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
    <SummaryCardGrid className="mb-6 tablet:mb-8 desktop:mb-10">
      {/* Ingredients Count */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:shadow-xl tablet:rounded-3xl tablet:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-fluid-xs font-medium text-gray-400 tablet:text-fluid-sm">Total Ingredients</p>
            <p className="text-fluid-2xl font-bold text-white tablet:text-fluid-3xl">{stats.totalIngredients}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 tablet:h-12 tablet:w-12 tablet:rounded-2xl">
            <Icon icon={Utensils} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          </div>
        </div>
        <div className="mt-3 tablet:mt-4">
          <p className="text-fluid-xs text-gray-500">Kitchen inventory items</p>
        </div>
      </div>

      {/* Recipes Count */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:shadow-xl tablet:rounded-3xl tablet:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-fluid-xs font-medium text-gray-400 tablet:text-fluid-sm">Total Recipes</p>
            <p className="text-fluid-2xl font-bold text-white tablet:text-fluid-3xl">{stats.totalRecipes}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/10 tablet:h-12 tablet:w-12 tablet:rounded-2xl">
            <Icon icon={BookOpen} size="md" className="text-[#3B82F6]" aria-hidden={true} />
          </div>
        </div>
        <div className="mt-3 tablet:mt-4">
          <p className="text-fluid-xs text-gray-500">Recipe cards created</p>
        </div>
      </div>

      {/* Average Price */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:shadow-xl tablet:rounded-3xl tablet:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-fluid-xs font-medium text-gray-400 tablet:text-fluid-sm">Avg. Dish Price</p>
            <p className="text-fluid-2xl font-bold text-white tablet:text-fluid-3xl">
              ${stats.averageDishPrice.toFixed(2)}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/10 tablet:h-12 tablet:w-12 tablet:rounded-2xl">
            <Icon icon={DollarSign} size="md" className="text-[#F59E0B]" aria-hidden={true} />
          </div>
        </div>
        <div className="mt-3 tablet:mt-4">
          <p className="text-fluid-xs text-gray-500">Average selling price</p>
        </div>
      </div>
    </SummaryCardGrid>
  );
}
