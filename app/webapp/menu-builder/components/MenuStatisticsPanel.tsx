'use client';

import { Icon } from '@/components/ui/Icon';
import { DollarSign, Package, Percent, TrendingUp } from 'lucide-react';
import { MenuStatistics } from '@/lib/types/menu-builder';

interface MenuStatisticsPanelProps {
  statistics: MenuStatistics | null | undefined;
  /** Menu type (e.g. 'a_la_carte', 'function'); when function, shows price per person */
  menuType?: string | null;
  /** Optional expected guest count; when set with price_per_person, shows total for guests */
  expectedGuests?: number | null;
}

export default function MenuStatisticsPanel({
  statistics,
  menuType,
  expectedGuests,
}: MenuStatisticsPanelProps) {
  const isFunctionMenu =
    menuType === 'function' || (menuType != null && String(menuType).startsWith('function_'));
  const pricePerPerson =
    statistics?.price_per_person != null
      ? Number(statistics.price_per_person)
      : isFunctionMenu
        ? (statistics?.total_revenue ?? 0)
        : null;
  const showPricePerPerson = isFunctionMenu && pricePerPerson != null && pricePerPerson > 0;
  const totalForGuests =
    expectedGuests != null && expectedGuests > 0 && showPricePerPerson && pricePerPerson != null
      ? pricePerPerson * expectedGuests
      : null;

  // Ensure all statistics fields exist with defaults - handle null/undefined gracefully
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
    <div className="tablet:grid-cols-3 desktop:grid-cols-4 mb-4 grid grid-cols-1 gap-3">
      {/* Price per person (function menus only) */}
      {showPricePerPerson && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg transition-all duration-200 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
                Price per person
              </p>
              <p className="text-xl font-bold text-[var(--foreground)]">
                ${pricePerPerson.toFixed(2)}
              </p>
              {totalForGuests != null && (
                <p className="mt-0.5 text-[10px] text-[var(--foreground-subtle)]">
                  Total for {expectedGuests} guests: ${totalForGuests.toFixed(2)}
                </p>
              )}
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
              <Icon
                icon={DollarSign}
                size="sm"
                className="text-[var(--primary)]"
                aria-hidden={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Total Items */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Menu Items</p>
            <p className="text-xl font-bold text-[var(--foreground)]">{stats.total_items}</p>
            {(stats.total_dishes > 0 || stats.total_recipes > 0) && (
              <p className="mt-0.5 text-[10px] text-[var(--foreground-subtle)]">
                {stats.total_dishes} dishes, {stats.total_recipes} recipes
              </p>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
            <Icon icon={Package} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
          </div>
        </div>
      </div>

      {/* Average Profit Margin */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">
              Avg. Profit Margin
            </p>
            <p
              className={`text-xl font-bold ${
                stats.average_profit_margin >= 60
                  ? 'text-[var(--color-success)]'
                  : stats.average_profit_margin >= 50
                    ? 'text-[var(--color-warning)]'
                    : 'text-[var(--color-error)]'
              }`}
            >
              {stats.average_profit_margin.toFixed(1)}%
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--foreground-subtle)]">
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
                  ? 'text-[var(--color-success)]'
                  : stats.average_profit_margin >= 50
                    ? 'text-[var(--color-warning)]'
                    : 'text-[var(--color-error)]'
              }
              aria-hidden={true}
            />
          </div>
        </div>
      </div>

      {/* Food Cost % */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium text-[var(--foreground-muted)]">Food Cost %</p>
            <p
              className={`text-xl font-bold ${
                stats.food_cost_percent <= 30
                  ? 'text-[var(--color-success)]'
                  : stats.food_cost_percent <= 35
                    ? 'text-[var(--color-warning)]'
                    : 'text-[var(--color-error)]'
              }`}
            >
              {stats.food_cost_percent.toFixed(1)}%
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--foreground-subtle)]">
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
                  ? 'text-[var(--color-success)]'
                  : stats.food_cost_percent <= 35
                    ? 'text-[var(--color-warning)]'
                    : 'text-[var(--color-error)]'
              }
              aria-hidden={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
