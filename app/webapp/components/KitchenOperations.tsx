'use client';

import { AlertTriangle, BookOpen, Sparkles, Thermometer, UtensilsCrossed } from 'lucide-react';
import { useKitchenStats } from './hooks/useKitchenStats';
import { KitchenOperation, KitchenOperationCard } from './KitchenOperationCard';

export default function KitchenOperations() {
  const { stats, loading } = useKitchenStats();

  if (loading) {
    return (
      <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-[var(--surface)]" />
          <div className="tablet:grid-cols-2 tablet:gap-4 desktop:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] grid grid-cols-1 gap-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 rounded-xl bg-[var(--surface)]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const operations: KitchenOperation[] = [
    {
      title: 'Menu Items Ready',
      value: stats.totalMenuDishes,
      description: 'Dishes available on active menus',
      icon: UtensilsCrossed,
      color: 'var(--primary)',
      href: '/webapp/recipes#menu-builder',
      status: 'good',
    },
    {
      title: 'Recipes Ready',
      value: stats.recipesReady,
      description: 'Recipes with complete ingredient lists',
      icon: BookOpen,
      color: 'var(--color-info)',
      href: '/webapp/recipes',
      status: stats.recipesReady > 0 ? 'good' : 'warning',
    },
    {
      title: 'Low Stock Alerts',
      value: stats.ingredientsLowStock,
      description: 'Ingredients needing restock',
      icon: AlertTriangle,
      color: stats.ingredientsLowStock > 0 ? 'var(--color-warning)' : 'var(--primary)',
      href: '/webapp/recipes#ingredients',
      status: stats.ingredientsLowStock > 0 ? 'warning' : 'good',
    },
    {
      title: 'Temperature Checks Today',
      value: stats.temperatureChecksToday,
      description: 'Food safety compliance tracking',
      icon: Thermometer,
      color: stats.temperatureChecksToday > 0 ? 'var(--primary)' : 'var(--color-warning)',
      href: '/webapp/temperature',
      status: stats.temperatureChecksToday > 0 ? 'good' : 'warning',
    },
    {
      title: 'Cleaning Tasks Pending',
      value: stats.cleaningTasksPending,
      description: 'Operational tasks awaiting completion',
      icon: Sparkles,
      color: stats.cleaningTasksPending > 0 ? 'var(--color-warning)' : 'var(--primary)',
      href: '/webapp/cleaning',
      status: stats.cleaningTasksPending > 0 ? 'warning' : 'good',
    },
  ];

  return (
    <div className="tablet:mb-8 tablet:rounded-3xl tablet:p-6 mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
      <div className="tablet:mb-6 mb-4">
        <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-[var(--foreground)]">
          Kitchen Operations
        </h2>
        <p className="text-fluid-xs tablet:text-fluid-sm mt-1 text-[var(--foreground-muted)]">
          Current operational status and readiness
        </p>
      </div>
      <div className="tablet:grid-cols-2 tablet:gap-4 desktop:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] grid grid-cols-1 gap-3">
        {operations.map(op => (
          <KitchenOperationCard key={op.title} operation={op} />
        ))}
      </div>
    </div>
  );
}
