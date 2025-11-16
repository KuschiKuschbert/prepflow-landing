'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTemperatureWarnings } from '@/hooks/useTemperatureWarnings';
import { cacheData, getCachedData, prefetchApis } from '@/lib/cache/data-cache';
import { startLoadingGate, stopLoadingGate } from '@/lib/loading-gate';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { DashboardErrorAlert } from './DashboardErrorAlert';
import DashboardStats from './DashboardStats';
import RecentActivity from './RecentActivity';
import type {
  DashboardStatsData,
  TemperatureEquipment,
  TemperatureLog,
} from './types/dashboard-stats';

export default function DashboardStatsClient() {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalIngredients: 0,
    totalRecipes: 0,
    averageDishPrice: 0,
  });
  const [allLogs, setAllLogs] = useState<TemperatureLog[]>([]);
  const [equipment, setEquipment] = useState<TemperatureEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [temperatureLogsError, setTemperatureLogsError] = useState<string | null>(null);
  const [temperatureEquipmentError, setTemperatureEquipmentError] = useState<string | null>(null);

  // Fetch dashboard data in parallel for better performance
  const fetchDashboardData = async ({
    forceLoading = false,
    hasPrefetchedData = false,
  }: {
    forceLoading?: boolean;
    hasPrefetchedData?: boolean;
  } = {}) => {
    const hasData =
      hasPrefetchedData ||
      stats.totalIngredients > 0 ||
      stats.totalRecipes > 0 ||
      allLogs.length > 0 ||
      equipment.length > 0;
    const shouldShowLoading = forceLoading || !hasData;
    if (shouldShowLoading) {
      setLoading(true);
    }
    setStatsError(null);
    setTemperatureLogsError(null);
    setTemperatureEquipmentError(null);

    try {
      // Fetch stats and temperature data in parallel
      // Limit temperature logs to recent entries only (last 20) for better performance
      let statsResponse: Response;
      try {
        statsResponse = await fetch('/api/dashboard/stats', { cache: 'no-store' });
      } catch (err) {
        console.error('Network error fetching stats:', err);
        setStatsError(
          'Network error: Unable to fetch dashboard stats. Please check your connection.',
        );
        setLoading(false);
        return;
      }

      // Supabase queries return { data, error } objects, not promises that can be caught
      const [logsResult, equipmentResult] = await Promise.all([
        supabase
          .from('temperature_logs')
          .select(
            'id, log_date, log_time, temperature_type, temperature_celsius, location, notes, photo_url, logged_by, created_at, updated_at',
          )
          .order('log_date', { ascending: false })
          .order('log_time', { ascending: false })
          .limit(20),
        supabase
          .from('temperature_equipment')
          .select(
            'id, name, equipment_type, location, min_temp_celsius, max_temp_celsius, is_active, created_at, updated_at',
          )
          .eq('is_active', true),
      ]);

      // Process stats response
      try {
        const statsJson = await statsResponse.json();
        if (!statsResponse.ok || !statsJson?.success) {
          setStatsError(statsJson?.error || 'Failed to load dashboard statistics');
        } else {
          const newStats: DashboardStatsData = {
            totalIngredients: statsJson.totalIngredients || 0,
            totalRecipes: statsJson.totalRecipes || 0,
            averageDishPrice: statsJson.averageDishPrice || 0,
            totalMenuDishes: statsJson.totalMenuDishes,
            recipesReady: statsJson.recipesReady,
            recipesWithoutCost: statsJson.recipesWithoutCost,
            ingredientsLowStock: statsJson.ingredientsLowStock,
            temperatureChecksToday: statsJson.temperatureChecksToday,
            cleaningTasksPending: statsJson.cleaningTasksPending,
          };
          setStats(newStats);
          cacheData('dashboard_stats', newStats);
        }
      } catch (err) {
        console.error('Error parsing stats response:', err);
        setStatsError('Failed to parse dashboard statistics. Please try again.');
      }

      // Process temperature logs data
      if (logsResult.error) {
        const errorMessage =
          logsResult.error.message ||
          'Failed to load temperature logs. The dashboard will still work without this data.';
        setTemperatureLogsError(errorMessage);
        console.error('Error fetching temperature logs:', logsResult.error);
        // Keep existing logs from cache if available, don't clear them
      } else if (logsResult.data) {
        const logs = logsResult.data || [];
        setAllLogs(logs);
        cacheData('dashboard_temperature_logs', logs);
      }

      // Process temperature equipment data
      if (equipmentResult.error) {
        const errorMessage =
          equipmentResult.error.message ||
          'Failed to load temperature equipment. The dashboard will still work without this data.';
        setTemperatureEquipmentError(errorMessage);
        console.error('Error fetching temperature equipment:', equipmentResult.error);
        // Keep existing equipment from cache if available, don't clear them
      } else if (equipmentResult.data) {
        const equip = equipmentResult.data || [];
        setEquipment(equip);
        cacheData('dashboard_temperature_equipment', equip);
      }
    } catch (error) {
      console.error('Unexpected error fetching dashboard data:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while loading the dashboard. Please try again.';
      setStatsError(errorMessage);

      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setStatsError(
          'Network error: Unable to connect to the server. Please check your internet connection.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading gate integration - trigger docket catch game on slow loads
  useEffect(() => {
    if (loading) startLoadingGate('dashboard');
    else stopLoadingGate('dashboard');
    return () => stopLoadingGate('dashboard');
  }, [loading]);

  useEffect(() => {
    let hasCache = false;
    if (typeof window !== 'undefined') {
      const cachedStats = getCachedData<DashboardStatsData>('dashboard_stats');
      const cachedLogs = getCachedData<TemperatureLog[]>('dashboard_temperature_logs');
      const cachedEquipment = getCachedData<TemperatureEquipment[]>(
        'dashboard_temperature_equipment',
      );

      if (cachedStats) {
        setStats(cachedStats);
        hasCache = true;
      }

      if (cachedLogs && cachedLogs.length > 0) {
        setAllLogs(cachedLogs);
        hasCache = true;
      }

      if (cachedEquipment && cachedEquipment.length > 0) {
        setEquipment(cachedEquipment);
        hasCache = true;
      }

      if (hasCache) {
        setLoading(false);
      }
    }

    // Prefetch dashboard APIs
    prefetchApis([
      '/api/dashboard/stats',
      '/api/dashboard/performance-summary',
      '/api/dashboard/menu-summary',
      '/api/dashboard/recipe-readiness',
    ]);
    fetchDashboardData({ hasPrefetchedData: hasCache });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => fetchDashboardData({ forceLoading: true });

  interface ErrorAlertConfig {
    key: string;
    error: string | null;
    title: string;
    variant: 'critical' | 'warning';
    retryLabel: string;
    className?: string;
  }

  const alertConfigs: ErrorAlertConfig[] = [
    {
      key: 'stats',
      error: statsError,
      title: 'Dashboard Stats Error',
      variant: 'critical',
      className: 'mb-6',
      retryLabel: 'Retry loading dashboard stats',
    },
    {
      key: 'logs',
      error: temperatureLogsError,
      title: 'Temperature Logs Warning',
      variant: 'warning',
      retryLabel: 'Retry loading temperature logs',
    },
    {
      key: 'equipment',
      error: temperatureEquipmentError,
      title: 'Temperature Equipment Warning',
      variant: 'warning',
      retryLabel: 'Retry loading temperature equipment',
    },
  ];

  const errorAlerts = alertConfigs.filter((alert): alert is ErrorAlertConfig & { error: string } =>
    Boolean(alert.error),
  );

  // Use temperature warnings hook
  useTemperatureWarnings({ allLogs, equipment });

  // Calculate out of range temperature alerts
  const today = new Date().toISOString().split('T')[0];
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
