'use client';

import { DashboardCard } from '@/components/ui/DashboardCard';
import { useTranslation } from '@/lib/useTranslation';
import {
  AlertTriangle,
  BookOpen,
  DollarSign,
  LayoutDashboard,
  Utensils,
  UtensilsCrossed,
} from 'lucide-react';
import { DashboardWidget } from './DashboardWidget';

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
    <DashboardWidget title="Overview" icon={LayoutDashboard} className="h-full">
      <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-6">
        <DashboardCard
          title="Total Ingredients"
          value={stats.totalIngredients}
          subtitle="Kitchen inventory items"
          icon={Utensils}
          iconColor="text-[var(--primary)]"
        />

        <DashboardCard
          title="Total Recipes"
          value={stats.totalRecipes}
          subtitle="Recipe cards created"
          icon={BookOpen}
          iconColor="text-[var(--color-info)]"
        />

        <DashboardCard
          title="Avg. Dish Price"
          value={`$${stats.averageDishPrice.toFixed(2)}`}
          subtitle="Average selling price"
          icon={DollarSign}
          iconColor="text-[var(--color-warning)]"
        />

        {stats.totalMenuDishes !== undefined && (
          <DashboardCard
            title="Active Menu Dishes"
            value={stats.totalMenuDishes}
            subtitle="Dishes available to serve"
            icon={UtensilsCrossed}
            iconColor="text-[var(--primary)]"
            badge={stats.totalMenuDishes > 0 ? { text: 'Ready', variant: 'success' } : undefined}
            onClick={() => (window.location.href = '/webapp/recipes#menu-builder')}
          />
        )}

        {stats.recipesReady !== undefined && (
          <DashboardCard
            title="Recipes Ready"
            value={stats.recipesReady}
            subtitle="Complete recipes ready to cook"
            icon={BookOpen}
            iconColor="text-[var(--color-info)]"
            badge={
              stats.recipesReady > 0
                ? { text: 'Ready', variant: 'success' }
                : { text: 'Needs Attention', variant: 'warning' }
            }
            onClick={() => (window.location.href = '/webapp/recipes')}
          />
        )}

        {stats.ingredientsLowStock !== undefined && (
          <DashboardCard
            title="Low Stock Alerts"
            value={stats.ingredientsLowStock}
            subtitle="Ingredients needing restock"
            icon={AlertTriangle}
            iconColor={
              stats.ingredientsLowStock > 0
                ? 'text-[var(--color-warning)]'
                : 'text-[var(--primary)]'
            }
            badge={
              stats.ingredientsLowStock > 0
                ? { text: 'Low Stock', variant: 'error' }
                : { text: 'Ready', variant: 'success' }
            }
            onClick={() => (window.location.href = '/webapp/recipes#ingredients')}
          />
        )}
      </div>
    </DashboardWidget>
  );
}
