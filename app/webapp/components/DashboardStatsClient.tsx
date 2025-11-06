'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTemperatureWarnings } from '@/hooks/useTemperatureWarnings';
import { cacheData, getCachedData, prefetchApis } from '@/lib/cache/data-cache';
import { startLoadingGate, stopLoadingGate } from '@/lib/loading-gate';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import DashboardStats from './DashboardStats';
import RecentActivity from './RecentActivity';
import type {
  DashboardStatsData,
  TemperatureLog,
  TemperatureEquipment,
} from './types/dashboard-stats';

export default function DashboardStatsClient() {
  // Initialize with cached data for instant display
  const [stats, setStats] = useState<DashboardStatsData>(
    () =>
      getCachedData<DashboardStatsData>('dashboard_stats') || {
        totalIngredients: 0,
        totalRecipes: 0,
        averageDishPrice: 0,
      },
  );
  // Check if we have cached data to determine initial loading state
  const cachedStats = getCachedData<DashboardStatsData>('dashboard_stats');
  const cachedLogs = getCachedData<TemperatureLog[]>('dashboard_temperature_logs');
  const cachedEquipment = getCachedData<TemperatureEquipment[]>('dashboard_temperature_equipment');
  const hasCachedData =
    Boolean(cachedStats) ||
    (cachedLogs && cachedLogs.length > 0) ||
    (cachedEquipment && cachedEquipment.length > 0);
  const [loading, setLoading] = useState(!hasCachedData);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [temperatureLogsError, setTemperatureLogsError] = useState<string | null>(null);
  const [temperatureEquipmentError, setTemperatureEquipmentError] = useState<string | null>(null);
  const [allLogs, setAllLogs] = useState<TemperatureLog[]>(
    () => getCachedData<TemperatureLog[]>('dashboard_temperature_logs') || [],
  );
  const [equipment, setEquipment] = useState<TemperatureEquipment[]>(
    () => getCachedData<TemperatureEquipment[]>('dashboard_temperature_equipment') || [],
  );

  // Fetch dashboard data in parallel for better performance
  const fetchDashboardData = async (showLoading = false) => {
    // Show loading if explicitly requested (retry) or if we don't have any data yet
    // Check current state to see if we have data to display
    const hasData =
      stats.totalIngredients > 0 ||
      stats.totalRecipes > 0 ||
      allLogs.length > 0 ||
      equipment.length > 0;
    const shouldShowLoading = showLoading || !hasData;
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
          const newStats = {
            totalIngredients: statsJson.totalIngredients || 0,
            totalRecipes: statsJson.totalRecipes || 0,
            averageDishPrice: statsJson.averageDishPrice || 0,
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
    // Prefetch dashboard APIs
    prefetchApis(['/api/dashboard/stats']);
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use temperature warnings hook
  useTemperatureWarnings({ allLogs, equipment });

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <>
      {/* Error Messages */}
      {statsError && (
        <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-red-400">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
            </div>
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={loading}
              className="ml-4 rounded-lg border border-red-500/50 bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Retry loading dashboard stats"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Temperature Logs Error (non-critical) */}
      {temperatureLogsError && (
        <div className="mb-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-4 py-3 text-yellow-400">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="font-medium">Temperature Logs Warning</span>
              </div>
              <p className="mt-1 text-sm">{temperatureLogsError}</p>
            </div>
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={loading}
              className="ml-4 rounded-lg border border-yellow-500/50 bg-yellow-500/20 px-3 py-1.5 text-sm font-medium text-yellow-400 transition-colors hover:bg-yellow-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Retry loading temperature logs"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Temperature Equipment Error (non-critical) */}
      {temperatureEquipmentError && (
        <div className="mb-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-4 py-3 text-yellow-400">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="font-medium">Temperature Equipment Warning</span>
              </div>
              <p className="mt-1 text-sm">{temperatureEquipmentError}</p>
            </div>
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={loading}
              className="ml-4 rounded-lg border border-yellow-500/50 bg-yellow-500/20 px-3 py-1.5 text-sm font-medium text-yellow-400 transition-colors hover:bg-yellow-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Retry loading temperature equipment"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Components */}
      <DashboardStats stats={stats} />
      <RecentActivity />
    </>
  );
}
