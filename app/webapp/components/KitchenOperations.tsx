'use client';

import {
  AlertTriangle,
  BookOpen,
  Settings,
  Sparkles,
  Thermometer,
  UtensilsCrossed,
} from 'lucide-react';
import { DashboardWidget } from './DashboardWidget';
import { useKitchenStats } from './hooks/useKitchenStats';
import { KitchenOperation, KitchenOperationCard } from './KitchenOperationCard';

export default function KitchenOperations() {
  const { stats, loading } = useKitchenStats();

  if (loading) {
    return (
      <DashboardWidget title="Kitchen Operations" icon={Settings} className="h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-[var(--muted)]" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-[var(--muted)]/50" />
            ))}
          </div>
        </div>
      </DashboardWidget>
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
    <DashboardWidget title="Kitchen Operations" icon={Settings} className="h-full">
      <div className="tablet:grid-cols-2 tablet:gap-4 desktop:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] grid grid-cols-1 gap-3">
        {operations.map(op => (
          <KitchenOperationCard key={op.title} operation={op} />
        ))}
      </div>
    </DashboardWidget>
  );
}
