'use client';

import { useTranslation } from '@/lib/useTranslation';
import { Utensils, BookOpen, DollarSign, UtensilsCrossed, AlertTriangle } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { SummaryCardGrid } from '@/components/ui/SummaryCardGrid';
import Link from 'next/link';

interface DashboardStatsProps {
  stats: {
    totalIngredients: number;
    totalRecipes: number;
    averageDishPrice: number;
    totalMenuDishes?: number;
    recipesReady?: number;
    ingredientsLowStock?: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const { t } = useTranslation();

  return (
    <SummaryCardGrid className="tablet:mb-8 desktop:mb-10 mb-6">
      {/* Ingredients Count */}
      <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-fluid-xs tablet:text-fluid-sm mb-1 font-medium text-gray-400">
              Total Ingredients
            </p>
            <p className="text-fluid-2xl tablet:text-fluid-3xl font-bold text-white">
              {stats.totalIngredients}
            </p>
          </div>
          <div className="tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
            <Icon icon={Utensils} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          </div>
        </div>
        <div className="tablet:mt-4 mt-3">
          <p className="text-fluid-xs text-gray-500">Kitchen inventory items</p>
        </div>
      </div>

      {/* Recipes Count */}
      <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-fluid-xs tablet:text-fluid-sm mb-1 font-medium text-gray-400">
              Total Recipes
            </p>
            <p className="text-fluid-2xl tablet:text-fluid-3xl font-bold text-white">
              {stats.totalRecipes}
            </p>
          </div>
          <div className="tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/10">
            <Icon icon={BookOpen} size="md" className="text-[#3B82F6]" aria-hidden={true} />
          </div>
        </div>
        <div className="tablet:mt-4 mt-3">
          <p className="text-fluid-xs text-gray-500">Recipe cards created</p>
        </div>
      </div>

      {/* Average Price */}
      <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-fluid-xs tablet:text-fluid-sm mb-1 font-medium text-gray-400">
              Avg. Dish Price
            </p>
            <p className="text-fluid-2xl tablet:text-fluid-3xl font-bold text-white">
              ${stats.averageDishPrice.toFixed(2)}
            </p>
          </div>
          <div className="tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/10">
            <Icon icon={DollarSign} size="md" className="text-[#F59E0B]" aria-hidden={true} />
          </div>
        </div>
        <div className="tablet:mt-4 mt-3">
          <p className="text-fluid-xs text-gray-500">Average selling price</p>
        </div>
      </div>

      {/* Active Menu Dishes */}
      {stats.totalMenuDishes !== undefined && (
        <Link
          href="/webapp/recipes#menu-builder"
          className="group tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-gray-400">
                  Active Menu Dishes
                </p>
                {stats.totalMenuDishes > 0 && (
                  <span className="rounded-full bg-[#29E7CD]/20 px-2 py-0.5 text-xs font-medium text-[#29E7CD]">
                    Ready
                  </span>
                )}
              </div>
              <p className="text-fluid-2xl tablet:text-fluid-3xl font-bold text-white">
                {stats.totalMenuDishes}
              </p>
            </div>
            <div className="tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
              <Icon
                icon={UtensilsCrossed}
                size="md"
                className="text-[#29E7CD]"
                aria-hidden={true}
              />
            </div>
          </div>
          <div className="tablet:mt-4 mt-3">
            <p className="text-fluid-xs text-gray-500">Dishes available to serve</p>
          </div>
        </Link>
      )}

      {/* Recipes Ready */}
      {stats.recipesReady !== undefined && (
        <Link
          href="/webapp/recipes"
          className="group tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:border-[#3B82F6]/50 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-gray-400">
                  Recipes Ready
                </p>
                {stats.recipesReady > 0 ? (
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                    Ready
                  </span>
                ) : (
                  <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                    Needs Attention
                  </span>
                )}
              </div>
              <p className="text-fluid-2xl tablet:text-fluid-3xl font-bold text-white">
                {stats.recipesReady}
              </p>
            </div>
            <div className="tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/10">
              <Icon icon={BookOpen} size="md" className="text-[#3B82F6]" aria-hidden={true} />
            </div>
          </div>
          <div className="tablet:mt-4 mt-3">
            <p className="text-fluid-xs text-gray-500">Complete recipes ready to cook</p>
          </div>
        </Link>
      )}

      {/* Low Stock Alerts */}
      {stats.ingredientsLowStock !== undefined && (
        <Link
          href="/webapp/recipes#ingredients"
          className="group tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:border-[#F59E0B]/50 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-gray-400">
                  Low Stock Alerts
                </p>
                {stats.ingredientsLowStock > 0 ? (
                  <span className="rounded-full bg-[#F59E0B]/20 px-2 py-0.5 text-xs font-medium text-[#F59E0B]">
                    Low Stock
                  </span>
                ) : (
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                    Ready
                  </span>
                )}
              </div>
              <p
                className={`text-fluid-2xl tablet:text-fluid-3xl font-bold ${
                  stats.ingredientsLowStock > 0 ? 'text-[#F59E0B]' : 'text-[#29E7CD]'
                }`}
              >
                {stats.ingredientsLowStock}
              </p>
            </div>
            <div
              className={`tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${
                stats.ingredientsLowStock > 0
                  ? 'from-[#F59E0B]/20 to-[#F59E0B]/10'
                  : 'from-[#29E7CD]/20 to-[#29E7CD]/10'
              }`}
            >
              <Icon
                icon={AlertTriangle}
                size="md"
                className={stats.ingredientsLowStock > 0 ? 'text-[#F59E0B]' : 'text-[#29E7CD]'}
                aria-hidden={true}
              />
            </div>
          </div>
          <div className="tablet:mt-4 mt-3">
            <p className="text-fluid-xs text-gray-500">Ingredients needing restock</p>
          </div>
        </Link>
      )}
    </SummaryCardGrid>
  );
}
