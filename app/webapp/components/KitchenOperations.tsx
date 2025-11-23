'use client';

import { Icon } from '@/components/ui/Icon';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { UtensilsCrossed, BookOpen, AlertTriangle, Thermometer, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { logger } from '@/lib/logger';
interface KitchenOperationsStats {
  totalMenuDishes: number;
  recipesReady: number;
  ingredientsLowStock: number;
  temperatureChecksToday: number;
  cleaningTasksPending: number;
}

export default function KitchenOperations() {
  const [stats, setStats] = useState<KitchenOperationsStats>({
    totalMenuDishes: 0,
    recipesReady: 0,
    ingredientsLowStock: 0,
    temperatureChecksToday: 0,
    cleaningTasksPending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Initialize with cached data
      const cachedStats = getCachedData<KitchenOperationsStats>('dashboard_stats');
      if (cachedStats) {
        setStats({
          totalMenuDishes: cachedStats.totalMenuDishes || 0,
          recipesReady: cachedStats.recipesReady || 0,
          ingredientsLowStock: cachedStats.ingredientsLowStock || 0,
          temperatureChecksToday: cachedStats.temperatureChecksToday || 0,
          cleaningTasksPending: cachedStats.cleaningTasksPending || 0,
        });
        setLoading(false);
      }

      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');

        const result = await response.json();
        if (result.success) {
          const newStats: KitchenOperationsStats = {
            totalMenuDishes: result.totalMenuDishes || 0,
            recipesReady: result.recipesReady || 0,
            ingredientsLowStock: result.ingredientsLowStock || 0,
            temperatureChecksToday: result.temperatureChecksToday || 0,
            cleaningTasksPending: result.cleaningTasksPending || 0,
          };
          setStats(newStats);
          cacheData('dashboard_stats', result);
        }
      } catch (err) {
        logger.error('Error fetching kitchen operations stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-[#2a2a2a]" />
          <div className="tablet:grid-cols-2 tablet:gap-4 desktop:grid-cols-3 grid grid-cols-1 gap-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 rounded-xl bg-[#2a2a2a]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const operations = [
    {
      title: 'Menu Items Ready',
      value: stats.totalMenuDishes,
      description: 'Dishes available on active menus',
      icon: UtensilsCrossed,
      color: '#29E7CD',
      href: '/webapp/menu-builder',
      status: 'good',
    },
    {
      title: 'Recipes Ready',
      value: stats.recipesReady,
      description: 'Recipes with complete ingredient lists',
      icon: BookOpen,
      color: '#3B82F6',
      href: '/webapp/recipes',
      status: stats.recipesReady > 0 ? 'good' : 'warning',
    },
    {
      title: 'Low Stock Alerts',
      value: stats.ingredientsLowStock,
      description: 'Ingredients needing restock',
      icon: AlertTriangle,
      color: stats.ingredientsLowStock > 0 ? '#F59E0B' : '#29E7CD',
      href: '/webapp/recipes#ingredients',
      status: stats.ingredientsLowStock > 0 ? 'warning' : 'good',
    },
    {
      title: 'Temperature Checks Today',
      value: stats.temperatureChecksToday,
      description: 'Food safety compliance tracking',
      icon: Thermometer,
      color: stats.temperatureChecksToday > 0 ? '#29E7CD' : '#F59E0B',
      href: '/webapp/temperature',
      status: stats.temperatureChecksToday > 0 ? 'good' : 'warning',
    },
    {
      title: 'Cleaning Tasks Pending',
      value: stats.cleaningTasksPending,
      description: 'Operational tasks awaiting completion',
      icon: Sparkles,
      color: stats.cleaningTasksPending > 0 ? '#F59E0B' : '#29E7CD',
      href: '/webapp/cleaning',
      status: stats.cleaningTasksPending > 0 ? 'warning' : 'good',
    },
  ];

  return (
    <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
      <div className="tablet:mb-6 mb-4">
        <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-white">
          Kitchen Operations
        </h2>
        <p className="text-fluid-xs tablet:text-fluid-sm mt-1 text-gray-400">
          Current operational status and readiness
        </p>
      </div>

      <div className="tablet:grid-cols-2 tablet:gap-4 desktop:grid-cols-3 grid grid-cols-1 gap-3">
        {operations.map((op, index) => (
          <Link
            key={op.title}
            href={op.href}
            className="group tablet:rounded-2xl tablet:p-5 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-lg hover:shadow-[#29E7CD]/10 active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-fluid-xs tablet:text-fluid-sm truncate font-medium text-gray-400">
                    {op.title}
                  </p>
                  {op.status === 'good' && (
                    <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-xs font-medium text-green-400">
                      Ready
                    </span>
                  )}
                  {op.status === 'warning' && (
                    <span className="rounded-full bg-[#F59E0B]/20 px-1.5 py-0.5 text-xs font-medium text-[#F59E0B]">
                      Needs Attention
                    </span>
                  )}
                  {op.title === 'Low Stock Alerts' && op.value > 0 && (
                    <span className="rounded-full bg-[#F59E0B]/20 px-1.5 py-0.5 text-xs font-medium text-[#F59E0B]">
                      Low Stock
                    </span>
                  )}
                </div>
                <p
                  className={`text-fluid-2xl tablet:text-fluid-3xl font-bold ${
                    op.status === 'good'
                      ? 'text-[#29E7CD]'
                      : op.status === 'warning'
                        ? 'text-[#F59E0B]'
                        : 'text-red-400'
                  }`}
                >
                  {op.value}
                </p>
              </div>
              <div
                className={`tablet:h-12 tablet:w-12 tablet:rounded-2xl flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${
                  op.status === 'good'
                    ? 'from-[#29E7CD]/20 to-[#29E7CD]/10'
                    : op.status === 'warning'
                      ? 'from-[#F59E0B]/20 to-[#F59E0B]/10'
                      : 'from-red-500/20 to-red-500/10'
                }`}
              >
                <Icon
                  icon={op.icon}
                  size="md"
                  className={
                    op.status === 'good'
                      ? 'text-[#29E7CD]'
                      : op.status === 'warning'
                        ? 'text-[#F59E0B]'
                        : 'text-red-400'
                  }
                  aria-hidden={true}
                />
              </div>
            </div>
            <div className="tablet:mt-4 mt-3">
              <p className="text-fluid-xs line-clamp-2 text-gray-500">{op.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
