'use client';

import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTemperatureWarnings } from '@/hooks/useTemperatureWarnings';
import { startLoadingGate, stopLoadingGate } from '@/lib/loading-gate';
import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { DashboardErrorAlert } from './DashboardErrorAlert';
import DashboardStats from './DashboardStats';
import RecentActivity from './RecentActivity';
import { getErrorAlerts } from './helpers/getErrorAlerts';
import type { DashboardStatsData } from './types/dashboard-stats';

function DashboardStatsClientContent() {
  const queryClient = useQueryClient();

  // Fetch stats data
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsQueryError,
  } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats', { cache: 'no-store' });
      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to load dashboard statistics');
      }
      const json = await response.json();
      if (!json?.success) {
        throw new Error(json?.error || 'Failed to load dashboard statistics');
      }
      return {
        totalIngredients: json.totalIngredients || 0,
        totalRecipes: json.totalRecipes || 0,
        averageDishPrice: json.averageDishPrice || 0,
        totalMenuDishes: json.totalMenuDishes,
        recipesReady: json.recipesReady,
        recipesWithoutCost: json.recipesWithoutCost,
        ingredientsLowStock: json.ingredientsLowStock,
        temperatureChecksToday: json.temperatureChecksToday,
        cleaningTasksPending: json.cleaningTasksPending,
      } as DashboardStatsData;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  // Fetch temperature logs
  const {
    data: logsData,
    isLoading: logsLoading,
    error: logsQueryError,
  } = useQuery({
    queryKey: ['dashboard', 'temperature-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temperature_logs')
        .select(
          'id, log_date, log_time, temperature_type, temperature_celsius, location, notes, photo_url, logged_by, created_at, updated_at',
        )
        .order('log_date', { ascending: false })
        .order('log_time', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Fetch temperature equipment
  const {
    data: equipmentData,
    isLoading: equipmentLoading,
    error: equipmentQueryError,
  } = useQuery({
    queryKey: ['dashboard', 'temperature-equipment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temperature_equipment')
        .select(
          'id, name, equipment_type, location, min_temp_celsius, max_temp_celsius, is_active, created_at, updated_at',
        )
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const stats = statsData || {
    totalIngredients: 0,
    totalRecipes: 0,
    averageDishPrice: 0,
  };
  const allLogs = logsData || [];
  const equipment = equipmentData || [];
  const loading = statsLoading || logsLoading || equipmentLoading;

  const statsError = statsQueryError instanceof Error ? statsQueryError.message : null;
  const temperatureLogsError = logsQueryError instanceof Error ? logsQueryError.message : null;
  const temperatureEquipmentError =
    equipmentQueryError instanceof Error ? equipmentQueryError.message : null;

  // Loading gate integration
  useEffect(() => {
    if (loading) startLoadingGate('dashboard');
    else stopLoadingGate('dashboard');
    return () => stopLoadingGate('dashboard');
  }, [loading]);

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };
  const errorAlerts = getErrorAlerts(statsError, temperatureLogsError, temperatureEquipmentError);

  // Use temperature warnings hook
  useTemperatureWarnings({ allLogs, equipment });

  // Calculate out of range temperature alerts
  // Use useState to prevent hydration mismatch from Date.now() differences
  const [today] = useState(() => new Date().toISOString().split('T')[0]);
  const todayLogs = allLogs.filter(log => log.log_date === today);
  const outOfRangeAlerts = todayLogs.filter(log => {
    const eq = equipment.find(e => e.location === log.location);
    if (!eq || eq.min_temp_celsius === null || eq.max_temp_celsius === null) return false;
    return (
      log.temperature_celsius < eq.min_temp_celsius || log.temperature_celsius > eq.max_temp_celsius
    );
  }).length;

  // Get last check time
  const lastCheckTime =
    allLogs.length > 0
      ? allLogs[0].log_date && allLogs[0].log_time
        ? `${allLogs[0].log_date}T${allLogs[0].log_time}`
        : allLogs[0].created_at
      : undefined;

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <>
      {errorAlerts.map(alert => (
        <DashboardErrorAlert
          key={alert.key}
          variant={alert.variant}
          title={alert.title}
          message={alert.error}
          retryLabel={alert.retryLabel}
          onRetry={handleRetry}
          disabled={loading}
          className={alert.className}
        />
      ))}

      {/* Dashboard Components */}
      <DashboardStats stats={stats} />
      <RecentActivity />
    </>
  );
}

export default function DashboardStatsClient() {
  return (
    <ErrorBoundary>
      <DashboardStatsClientContent />
    </ErrorBoundary>
  );
}
