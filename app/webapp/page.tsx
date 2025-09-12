'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import TestWarningButton from '@/components/TestWarningButton';
import { useTemperatureWarnings } from '@/hooks/useTemperatureWarnings';
import DashboardStats from './components/DashboardStats';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';

interface DashboardStats {
  totalIngredients: number;
  totalRecipes: number;
  totalMenuDishes: number;
  averageDishPrice: number;
}

interface TemperatureLog {
  id: string;
  log_date: string;
  log_time: string;
  temperature_type: string;
  temperature_celsius: number;
  location: string | null;
  notes: string | null;
  photo_url: string | null;
  logged_by: string | null;
  created_at: string;
  updated_at: string;
}

interface TemperatureEquipment {
  id: string;
  name: string;
  equipment_type: string;
  location: string | null;
  min_temp_celsius: number | null;
  max_temp_celsius: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

function WebAppDashboardContent() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalIngredients: 0,
    totalRecipes: 0,
    totalMenuDishes: 0,
    averageDishPrice: 0,
  });
  const [loading, setLoading] = useState(false); // Completely disabled to prevent skeleton flashes
  const [allLogs, setAllLogs] = useState<TemperatureLog[]>([]);
  const [equipment, setEquipment] = useState<TemperatureEquipment[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      // Completely disabled loading state to prevent skeleton flashes
      // setLoading(true);
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
        // Completely disabled loading state to prevent skeleton flashes
        // setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch temperature data for warnings
  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        // Fetch temperature logs
        const { data: logs } = await supabase
          .from('temperature_logs')
          .select('*')
          .order('log_date', { ascending: false })
          .order('log_time', { ascending: false });

        // Fetch temperature equipment
        const { data: equipmentData } = await supabase
          .from('temperature_equipment')
          .select('*')
          .eq('is_active', true);

        setAllLogs(logs || []);
        setEquipment(equipmentData || []);
      } catch (error) {
        console.error('Error fetching temperature data:', error);
      }
    };

    fetchTemperatureData();
  }, []);

  // Use temperature warnings hook
  useTemperatureWarnings({ allLogs, equipment });

  if (loading) {
    return <PageSkeleton />;
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

export default function WebAppDashboard() {
  return (
    <ErrorBoundary>
      <WebAppDashboardContent />
    </ErrorBoundary>
  );
}