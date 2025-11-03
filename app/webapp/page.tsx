'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useTemperatureWarnings } from '@/hooks/useTemperatureWarnings';
import DashboardStats from './components/DashboardStats';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';

interface DashboardStats {
  totalIngredients: number;
  totalRecipes: number;
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
    averageDishPrice: 0,
  });
  const [loading, setLoading] = useState(false); // Completely disabled to prevent skeleton flashes
  const [statsError, setStatsError] = useState<string | null>(null);
  const [allLogs, setAllLogs] = useState<TemperatureLog[]>([]);
  const [equipment, setEquipment] = useState<TemperatureEquipment[]>([]);

  // Fetch dashboard data in parallel for better performance
  useEffect(() => {
    const fetchDashboardData = async () => {
      setStatsError(null);
      try {
        // Fetch stats and temperature data in parallel
        const [statsResponse, logsResult, equipmentResult] = await Promise.all([
          fetch('/api/dashboard/stats', { cache: 'no-store' }),
          supabase
            .from('temperature_logs')
            .select('*')
            .order('log_date', { ascending: false })
            .order('log_time', { ascending: false }),
          supabase.from('temperature_equipment').select('*').eq('is_active', true),
        ]);

        // Process stats response
        const statsJson = await statsResponse.json();
        if (!statsResponse.ok || !statsJson?.success) {
          setStatsError(statsJson?.error || 'Failed to load stats');
        } else {
          setStats({
            totalIngredients: statsJson.totalIngredients || 0,
            totalRecipes: statsJson.totalRecipes || 0,
            averageDishPrice: statsJson.averageDishPrice || 0,
          });
        }

        // Process temperature data
        if (logsResult.error) {
          console.error('Error fetching temperature logs:', logsResult.error);
        } else {
          setAllLogs(logsResult.data || []);
        }

        if (equipmentResult.error) {
          console.error('Error fetching temperature equipment:', equipmentResult.error);
        } else {
          setEquipment(equipmentResult.data || []);
        }
      } catch (error) {
        console.error('Unexpected error fetching dashboard data:', error);
        setStatsError(
          `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    };

    fetchDashboardData();
  }, []);

  // Use temperature warnings hook
  useTemperatureWarnings({ allLogs, equipment });

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">
            🏠 {t('dashboard.title', 'Kitchen Management Dashboard')}
          </h1>
          <p className="text-gray-400">
            {t('dashboard.subtitle', "Welcome back! Here's your kitchen overview")}
          </p>
        </div>

        {/* Error Message */}
        {statsError && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-red-400">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">Dashboard Stats Error</span>
            </div>
            <p className="mt-1 text-sm">{statsError}</p>
            <p className="mt-2 text-xs text-red-400/70">
              Check browser console for detailed error messages. This may be due to database
              permissions or table access issues.
            </p>
          </div>
        )}

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
