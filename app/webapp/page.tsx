'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import dynamic from 'next/dynamic';
import TestWarningButton from '@/components/TestWarningButton';

// Dynamic imports for heavy components
const DashboardStats = dynamic(() => import('./components/DashboardStats'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-32 bg-[#2a2a2a] rounded-3xl mb-6"></div>
    </div>
  ),
  ssr: false
});

const QuickActions = dynamic(() => import('./components/QuickActions'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-48 bg-[#2a2a2a] rounded-3xl mb-6"></div>
    </div>
  ),
  ssr: false
});

const RecentActivity = dynamic(() => import('./components/RecentActivity'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-64 bg-[#2a2a2a] rounded-3xl"></div>
    </div>
  ),
  ssr: false
});

interface DashboardStats {
  totalIngredients: number;
  totalRecipes: number;
  totalMenuDishes: number;
  averageDishPrice: number;
}

export default function WebAppDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalIngredients: 0,
    totalRecipes: 0,
    totalMenuDishes: 0,
    averageDishPrice: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch ingredients count
        const { count: ingredientsCount } = await supabase
          .from('ingredients')
          .select('*', { count: 'exact', head: true });

        // Fetch recipes count
        const { count: recipesCount } = await supabase
          .from('recipes')
          .select('*', { count: 'exact', head: true });

        // Fetch menu dishes count and average price
        const { data: menuDishes } = await supabase
          .from('menu_dishes')
          .select('selling_price');

        const totalDishes = menuDishes?.length || 0;
        const averagePrice = totalDishes > 0 && menuDishes
          ? menuDishes.reduce((sum, dish) => sum + (dish.selling_price || 0), 0) / totalDishes
          : 0;

        setStats({
          totalIngredients: ingredientsCount || 0,
          totalRecipes: recipesCount || 0,
          totalMenuDishes: totalDishes,
          averageDishPrice: averagePrice,
        });
      } catch (error) {
        // Handle error gracefully
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#2a2a2a] rounded-3xl w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                  <div className="h-4 bg-[#2a2a2a] rounded-xl w-3/4 mb-3"></div>
                  <div className="h-8 bg-[#2a2a2a] rounded-xl w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
              <div className="h-6 bg-[#2a2a2a] rounded-xl w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-[#2a2a2a] rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🏠 {t('dashboard.title', 'Kitchen Management Dashboard')}
          </h1>
          <p className="text-gray-400">{t('dashboard.subtitle', 'Welcome back! Here\'s your kitchen overview')}</p>
          
          {/* Test Warning Button - Remove in production */}
          <div className="mt-4">
            <TestWarningButton />
          </div>
        </div>
        
        {/* Dashboard Components */}
        <DashboardStats stats={stats} />
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  );
}