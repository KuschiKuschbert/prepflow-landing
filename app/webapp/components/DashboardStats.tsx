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
  const { t: _t } = useTranslation();

  return (
    <SummaryCardGrid className="tablet:mb-8 desktop:mb-10 mb-6">
      {/* Ingredients Count */}
      <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-fluid-xs tablet:text-fluid-sm mb-1 font-medium text-[var(--foreground-muted)]">
              Total Ingredients
            </p>
            <p className="text-fluid-2xl tablet:text-fluid-3xl font-bold text-[var(--foreground)]">
              {stats.totalIngredients}
            </p>
          </div>
          <div className="tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
            <Icon icon={Utensils} size="md" className="text-[var(--primary)]" aria-hidden={true} />
          </div>
        </div>
        <div className="tablet:mt-4 mt-3">
          <p className="text-fluid-xs text-[var(--foreground-muted)]">Kitchen inventory items</p>
        </div>
      </div>

      {/* Recipes Count */}
      <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-fluid-xs tablet:text-fluid-sm mb-1 font-medium text-[var(--foreground-muted)]">
              Total Recipes
            </p>
            <p className="text-fluid-2xl tablet:text-fluid-3xl font-bold text-[var(--foreground)]">
              {stats.totalRecipes}
            </p>
          </div>
          <div className="tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-info)]/20 to-[var(--color-info)]/10">
            <Icon
              icon={BookOpen}
              size="md"
              className="text-[var(--color-info)]"
              aria-hidden={true}
            />
          </div>
        </div>
        <div className="tablet:mt-4 mt-3">
          <p className="text-fluid-xs text-[var(--foreground-muted)]">Recipe cards created</p>
        </div>
      </div>

      {/* Average Price */}
      <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-fluid-xs tablet:text-fluid-sm mb-1 font-medium text-[var(--foreground-muted)]">
              Avg. Dish Price
            </p>
            <p className="text-fluid-2xl tablet:text-fluid-3xl font-bold text-[var(--foreground)]">
              ${stats.averageDishPrice.toFixed(2)}
            </p>
          </div>
          <div className="tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-warning)]/20 to-[var(--color-warning)]/10">
            <Icon
              icon={DollarSign}
              size="md"
              className="text-[var(--color-warning)]"
              aria-hidden={true}
            />
          </div>
        </div>
        <div className="tablet:mt-4 mt-3">
          <p className="text-fluid-xs text-[var(--foreground-muted)]">Average selling price</p>
        </div>
      </div>

      {/* Active Menu Dishes */}
      {stats.totalMenuDishes !== undefined && (
        <Link
          href="/webapp/recipes#menu-builder"
          className="group tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground-muted)]">
                  Active Menu Dishes
                </p>
                {stats.totalMenuDishes > 0 && (
                  <span className="rounded-full bg-[var(--primary)]/20 px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
                    Ready
                  </span>
                )}
              </div>
              <p className="text-fluid-2xl tablet:text-fluid-3xl font-bold text-[var(--foreground)]">
                {stats.totalMenuDishes}
              </p>
            </div>
            <div className="tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
              <Icon
                icon={UtensilsCrossed}
                size="md"
                className="text-[var(--primary)]"
                aria-hidden={true}
              />
            </div>
          </div>
          <div className="tablet:mt-4 mt-3">
            <p className="text-fluid-xs text-[var(--foreground-muted)]">
              Dishes available to serve
            </p>
          </div>
        </Link>
      )}

      {/* Recipes Ready */}
      {stats.recipesReady !== undefined && (
        <Link
          href="/webapp/recipes"
          className="group tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg transition-all duration-200 hover:border-[var(--color-info)]/50 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground-muted)]">
                  Recipes Ready
                </p>
                {stats.recipesReady > 0 ? (
                  <span className="rounded-full border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--color-success)]">
                    Ready
                  </span>
                ) : (
                  <span className="rounded-full border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--color-warning)]">
                    Needs Attention
                  </span>
                )}
              </div>
              <p className="text-fluid-2xl tablet:text-fluid-3xl font-bold text-[var(--foreground)]">
                {stats.recipesReady}
              </p>
            </div>
            <div className="tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-info)]/20 to-[var(--color-info)]/10">
              <Icon
                icon={BookOpen}
                size="md"
                className="text-[var(--color-info)]"
                aria-hidden={true}
              />
            </div>
          </div>
          <div className="tablet:mt-4 mt-3">
            <p className="text-fluid-xs text-[var(--foreground-muted)]">
              Complete recipes ready to cook
            </p>
          </div>
        </Link>
      )}

      {/* Low Stock Alerts */}
      {stats.ingredientsLowStock !== undefined && (
        <Link
          href="/webapp/recipes#ingredients"
          className="group tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg transition-all duration-200 hover:border-[var(--color-warning)]/50 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-fluid-xs tablet:text-fluid-sm font-medium text-[var(--foreground-muted)]">
                  Low Stock Alerts
                </p>
                {stats.ingredientsLowStock > 0 ? (
                  <span className="rounded-full border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--color-warning)]">
                    Low Stock
                  </span>
                ) : (
                  <span className="rounded-full border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--color-success)]">
                    Ready
                  </span>
                )}
              </div>
              <p
                className={`text-fluid-2xl tablet:text-fluid-3xl font-bold ${
                  stats.ingredientsLowStock > 0
                    ? 'text-[var(--color-warning)]'
                    : 'text-[var(--primary)]'
                }`}
              >
                {stats.ingredientsLowStock}
              </p>
            </div>
            <div
              className={`tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${
                stats.ingredientsLowStock > 0
                  ? 'from-[var(--color-warning)]/20 to-[var(--color-warning)]/10'
                  : 'from-[var(--primary)]/20 to-[var(--primary)]/10'
              }`}
            >
              <Icon
                icon={AlertTriangle}
                size="md"
                className={
                  stats.ingredientsLowStock > 0
                    ? 'text-[var(--color-warning)]'
                    : 'text-[var(--primary)]'
                }
                aria-hidden={true}
              />
            </div>
          </div>
          <div className="tablet:mt-4 mt-3">
            <p className="text-fluid-xs text-[var(--foreground-muted)]">
              Ingredients needing restock
            </p>
          </div>
        </Link>
      )}
    </SummaryCardGrid>
  );
}
