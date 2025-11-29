'use client';

import { Icon } from '@/components/ui/Icon';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { UtensilsCrossed, AlertTriangle, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface MenuSummary {
  activeMenus: number;
  totalDishes: number;
  dishesWithoutRecipes: number;
  dishesWithoutCosts: number;
  totalMenus: number;
}

export default function MenuOverview() {
  const [data, setData] = useState<MenuSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Check cache first (only available on client)
      const cached = getCachedData<MenuSummary>('dashboard_menu_summary');
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      try {
        const response = await fetch('/api/dashboard/menu-summary');
        if (!response.ok) {
          throw new Error('Failed to fetch menu summary');
        }

        const result = await response.json();
        if (result.success) {
          setData(result);
          cacheData('dashboard_menu_summary', result);
          setError(null);
        } else {
          throw new Error(result.message || 'Failed to load menu data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu overview');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading && !data) {
    return (
      <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-[#2a2a2a]" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[#2a2a2a]" />
            <div className="h-4 w-3/4 rounded bg-[#2a2a2a]" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const hasIssues = data.dishesWithoutRecipes > 0 || data.dishesWithoutCosts > 0;

  return (
    <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
      <div className="tablet:mb-6 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-white">
            Menu Overview
          </h2>
          <p className="text-fluid-xs tablet:text-fluid-sm mt-1 text-gray-400">
            What&apos;s available to serve
          </p>
        </div>
        <Link
          href="/webapp/recipes#menu-builder"
          className="text-fluid-xs tablet:text-fluid-sm flex items-center gap-1 text-[#29E7CD] transition-colors hover:text-[#D925C7]"
        >
          View Menus
          <Icon icon={ExternalLink} size="xs" aria-hidden={true} />
        </Link>
      </div>

      <div className="desktop:grid-cols-4 desktop:gap-4 grid grid-cols-2 gap-3">
        {/* Active Menus */}
        <div className="tablet:rounded-2xl tablet:p-4 min-w-0 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
              <Icon
                icon={UtensilsCrossed}
                size="sm"
                className="text-[#29E7CD]"
                aria-hidden={true}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-fluid-xs tablet:text-fluid-sm truncate font-medium text-gray-400">
                Active Menus
              </p>
              <p className="text-fluid-xl tablet:text-fluid-2xl font-bold text-white">
                {data.activeMenus}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs line-clamp-2 text-gray-500">
            {data.activeMenus === 0
              ? 'No active menus'
              : data.activeMenus === 1
                ? '1 menu live'
                : `${data.activeMenus} menus live`}
          </p>
        </div>

        {/* Total Dishes Available */}
        <div className="tablet:rounded-2xl tablet:p-4 min-w-0 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/10">
              <Icon
                icon={UtensilsCrossed}
                size="sm"
                className="text-[#3B82F6]"
                aria-hidden={true}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-fluid-xs tablet:text-fluid-sm truncate font-medium text-gray-400">
                Dishes Available
              </p>
              <p className="text-fluid-xl tablet:text-fluid-2xl font-bold text-white">
                {data.totalDishes}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs line-clamp-2 text-gray-500">
            {data.totalDishes === 0
              ? 'No dishes on menus'
              : data.totalDishes === 1
                ? '1 dish available'
                : `${data.totalDishes} dishes available`}
          </p>
        </div>

        {/* Dishes Without Recipes */}
        <div className="tablet:rounded-2xl tablet:p-4 min-w-0 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div
              className={`tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${
                data.dishesWithoutRecipes > 0
                  ? 'from-yellow-500/20 to-yellow-500/10'
                  : 'from-green-500/20 to-green-500/10'
              }`}
            >
              <Icon
                icon={data.dishesWithoutRecipes > 0 ? AlertTriangle : UtensilsCrossed}
                size="sm"
                className={data.dishesWithoutRecipes > 0 ? 'text-yellow-400' : 'text-green-400'}
                aria-hidden={true}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-fluid-xs tablet:text-fluid-sm truncate font-medium text-gray-400">
                Without Recipes
              </p>
              <p
                className={`text-fluid-xl tablet:text-fluid-2xl font-bold ${
                  data.dishesWithoutRecipes > 0 ? 'text-yellow-400' : 'text-green-400'
                }`}
              >
                {data.dishesWithoutRecipes}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs line-clamp-2 text-gray-500">
            {data.dishesWithoutRecipes === 0
              ? 'All dishes have recipes'
              : data.dishesWithoutRecipes === 1
                ? '1 dish needs recipe'
                : `${data.dishesWithoutRecipes} dishes need recipes`}
          </p>
        </div>

        {/* Dishes Without Costs */}
        <div className="tablet:rounded-2xl tablet:p-4 min-w-0 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div
              className={`tablet:h-10 tablet:w-10 tablet:rounded-xl flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${
                data.dishesWithoutCosts > 0
                  ? 'from-yellow-500/20 to-yellow-500/10'
                  : 'from-green-500/20 to-green-500/10'
              }`}
            >
              <Icon
                icon={data.dishesWithoutCosts > 0 ? AlertTriangle : UtensilsCrossed}
                size="sm"
                className={data.dishesWithoutCosts > 0 ? 'text-yellow-400' : 'text-green-400'}
                aria-hidden={true}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-fluid-xs tablet:text-fluid-sm truncate font-medium text-gray-400">
                Without Costs
              </p>
              <p
                className={`text-fluid-xl tablet:text-fluid-2xl font-bold ${
                  data.dishesWithoutCosts > 0 ? 'text-yellow-400' : 'text-green-400'
                }`}
              >
                {data.dishesWithoutCosts}
              </p>
            </div>
          </div>
          <p className="text-fluid-xs line-clamp-2 text-gray-500">
            {data.dishesWithoutCosts === 0
              ? 'All dishes have pricing'
              : data.dishesWithoutCosts === 1
                ? '1 dish needs pricing'
                : `${data.dishesWithoutCosts} dishes need pricing`}
          </p>
        </div>
      </div>

      {hasIssues && (
        <div className="tablet:mt-6 mt-4 flex gap-2">
          {data.dishesWithoutRecipes > 0 && (
            <Link
              href="/webapp/recipes"
              className="text-fluid-xs tablet:px-4 tablet:py-2.5 tablet:text-fluid-sm flex-1 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-3 py-2 text-center font-medium text-yellow-400 transition-colors hover:bg-yellow-500/20"
            >
              Add Recipes
            </Link>
          )}
          {data.dishesWithoutCosts > 0 && (
            <Link
              href="/webapp/recipes#menu-builder"
              className="text-fluid-xs tablet:px-4 tablet:py-2.5 tablet:text-fluid-sm flex-1 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-3 py-2 text-center font-medium text-yellow-400 transition-colors hover:bg-yellow-500/20"
            >
              Fix Pricing
            </Link>
          )}
        </div>
      )}

      <div className="tablet:mt-6 mt-4">
        <Link
          href="/webapp/recipes#menu-builder"
          className="text-fluid-xs tablet:px-6 tablet:py-3 tablet:text-fluid-sm flex items-center justify-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 font-medium text-white transition-colors hover:border-[#29E7CD]/50 hover:bg-[#2a2a2a]/50"
        >
          <Icon icon={Plus} size="sm" aria-hidden={true} />
          Add Dish to Menu
        </Link>
      </div>
    </div>
  );
}
