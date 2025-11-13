'use client';

import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useNotification } from '@/contexts/NotificationContext';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useTranslation } from '@/lib/useTranslation';
import { BarChart3, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { EquipmentDetailDrawer } from './EquipmentDetailDrawer';
import { EquipmentStatusCard } from './EquipmentStatusCard';
import './temperature-charts.css';
import { useTemperatureFilters } from './useTemperatureFilters';

interface TemperatureAnalyticsTabProps {
  allLogs: TemperatureLog[];
  equipment: TemperatureEquipment[];
  isLoading?: boolean;
  onRefreshLogs?: () => void;
}

export default function TemperatureAnalyticsTab({
  allLogs,
  equipment,
  isLoading: externalLoading = false,
  onRefreshLogs,
}: TemperatureAnalyticsTabProps) {
  const { t } = useTranslation();
  const { formatDate } = useCountryFormatting();
  const { showSuccess, showError } = useNotification();
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [dateOffset, setDateOffset] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [drawerEquipment, setDrawerEquipment] = useState<TemperatureEquipment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasManuallyChangedFilter, setHasManuallyChangedFilter] = useState(false);
  const hasInitialized = useRef(false);

  const { getFilteredLogs, hasDataForTimeFilter } = useTemperatureFilters(
    allLogs,
    timeFilter,
    dateOffset,
  );

  const getEquipmentStatus = useCallback(
    (equipment: TemperatureEquipment) => {
      const logs = getFilteredLogs(equipment);
      if (logs.length === 0) return { status: 'no-data', color: 'text-gray-400' };

      const latestLog = logs[logs.length - 1];
      const latestTemp = latestLog.temperature_celsius;

      if (equipment.min_temp_celsius === null || equipment.max_temp_celsius === null) {
        return { status: 'no-thresholds', color: 'text-blue-400' };
      }

      const inRange =
        latestTemp >= equipment.min_temp_celsius && latestTemp <= equipment.max_temp_celsius;
      return {
        status: inRange ? 'in-range' : 'out-of-range',
        color: inRange ? 'text-green-400' : 'text-red-400',
        temperature: latestTemp,
      };
    },
    [getFilteredLogs],
  );

  // Find the best time filter with data
  const findBestTimeFilter = useCallback(() => {
    const timeFilters: ('24h' | '7d' | '30d' | 'all')[] = ['24h', '7d', '30d', 'all'];
    for (const filter of timeFilters) {
      if (hasDataForTimeFilter(filter)) {
        return filter;
      }
    }
    return '24h'; // fallback
  }, [hasDataForTimeFilter]);

  // Find equipment that is out of range
  const findOutOfRangeEquipment = useCallback(() => {
    return equipment.find(item => {
      const status = getEquipmentStatus(item);
      return status.status === 'out-of-range';
    });
  }, [equipment, getEquipmentStatus]);

  // Handle loading state to prevent FOUC - wait for data to be ready
  useEffect(() => {
    // Don't initialize if external loading is active
    if (externalLoading) {
      setIsLoaded(false);
      return;
    }

    // Only initialize once when data becomes available
    if (equipment.length > 0 && !hasInitialized.current) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setIsLoaded(true);

        // Smart equipment selection logic (only if not already selected)
        if (!selectedEquipmentId && equipment.length > 0) {
          // 1. First try to find equipment that is out of range
          const outOfRangeEquipment = findOutOfRangeEquipment();
          if (outOfRangeEquipment) {
            setSelectedEquipmentId(outOfRangeEquipment.id);
          } else {
            // 2. Fallback to first equipment
            setSelectedEquipmentId(equipment[0].id);
          }
        }

        // Smart time filter selection - find the best filter with data (only if not manually changed)
        if (!hasManuallyChangedFilter && allLogs.length > 0) {
          const bestTimeFilter = findBestTimeFilter();
          if (bestTimeFilter !== timeFilter) {
            setTimeFilter(bestTimeFilter);
          }
        }

        hasInitialized.current = true;
      }, 0);
    } else if (equipment.length > 0 && hasInitialized.current) {
      // If already initialized but data changed, update loaded state
      setIsLoaded(true);
    }
  }, [
    equipment.length, // Only length, not full array
    allLogs.length, // Only length, not full array
    selectedEquipmentId,
    hasManuallyChangedFilter,
    timeFilter,
    externalLoading,
    // Removed: equipment, findOutOfRangeEquipment, findBestTimeFilter, dateOffset
  ]);

  const handleEquipmentCardClick = (equipment: TemperatureEquipment) => {
    setDrawerEquipment(equipment);
    setIsDrawerOpen(true);
    // Highlight selected equipment card
    setSelectedEquipmentId(equipment.id);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerEquipment(null);
  };

  const handleGenerateSampleData = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/temperature-logs/generate-sample', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(
          `Successfully generated ${data.data.totalLogs} temperature log entries (5 per equipment)`,
        );
        // Refresh logs if callback provided - wait a bit for DB to be ready
        if (onRefreshLogs) {
          setTimeout(() => {
            onRefreshLogs();
          }, 500);
        } else {
          // Reload page to refresh data
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      } else {
        showError(data.error || 'Failed to generate sample data');
      }
    } catch (error) {
      console.error('Error generating sample data:', error);
      showError('Failed to generate sample data. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Show loading skeleton if data isn't ready or external loading is active
  if (!isLoaded || externalLoading) {
    return (
      <div className="space-y-6">
        {/* Time Period Filter Skeleton */}
        <div className="flex flex-wrap gap-2 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
          {['24h', '7d', '30d', 'all'].map(filter => (
            <div key={filter} className="h-8 w-20 rounded-xl bg-gray-700 px-4 py-2"></div>
          ))}
        </div>

        {/* Equipment Cards Skeleton */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          <LoadingSkeleton variant="card" count={6} height="80px" />
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Period Filter */}
      <div className="flex flex-wrap gap-2 rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 shadow-lg">
        {isLoaded ? (
          ['24h', '7d', '30d', 'all'].map(filter => {
            const isActive = timeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => {
                  setTimeFilter(filter as '24h' | '7d' | '30d' | 'all');
                  setHasManuallyChangedFilter(true);
                }}
                className={`group relative min-h-[44px] rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none ${
                  isActive
                    ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black shadow-xl scale-[1.02]'
                    : 'bg-transparent text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                {t(
                  `timeFilter.${filter}`,
                  filter === '24h'
                    ? 'Last 24h'
                    : filter === '7d'
                      ? 'Last 7 Days'
                      : filter === '30d'
                        ? 'Last 30 Days'
                        : 'All Time',
                )}
                {isActive && (
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 blur-xl" />
                )}
              </button>
            );
          })
        ) : (
          // Loading skeleton for time filter buttons
          <LoadingSkeleton variant="button" count={4} />
        )}
      </div>

      {/* Equipment Status Overview - Smart Responsive Grid */}
      <div
        className={`grid gap-3 ${
          equipment.length <= 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : equipment.length <= 4
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : equipment.length <= 6
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
                : equipment.length <= 12
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
        }`}
      >
        {isLoaded ? (
          equipment.map(item => {
            const status = getEquipmentStatus(item);
            const logs = getFilteredLogs(item);
            const isSelected = selectedEquipmentId === item.id;
            const isCompact = equipment.length > 6;

            return (
              <EquipmentStatusCard
                key={item.id}
                equipment={item}
                status={status}
                logs={logs}
                timeFilter={timeFilter}
                isSelected={isSelected}
                isCompact={isCompact}
                onSelect={() => handleEquipmentCardClick(item)}
              />
            );
          })
        ) : (
          // Loading skeleton for equipment cards
          <LoadingSkeleton variant="card" count={6} height="80px" />
        )}
      </div>

      {/* Empty State - No Data */}
      {isLoaded && equipment.length > 0 && allLogs.length === 0 && (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-3xl border border-[#2a2a2a] bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a]/50 p-8 shadow-2xl">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 shadow-xl">
            <Icon icon={BarChart3} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-white">No Temperature Data</h3>
          <p className="mb-6 max-w-md text-center text-base text-gray-400">
            Generate sample temperature logs to see analytics, charts, and insights for your equipment
          </p>
          <button
            onClick={handleGenerateSampleData}
            disabled={isGenerating}
            className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 font-semibold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100"
          >
            <Icon
              icon={Sparkles}
              size="lg"
              className="transition-transform duration-300 group-hover:rotate-12"
              aria-hidden={true}
            />
            <span>{isGenerating ? 'Generating Sample Data...' : 'Generate Sample Data'}</span>
            {!isGenerating && (
              <span className="text-sm opacity-75">(5 entries per equipment, last 2 weeks)</span>
            )}
          </button>
        </div>
      )}

      {/* Generate Sample Data Button - Always visible when equipment exists */}
      {isLoaded && equipment.length > 0 && allLogs.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleGenerateSampleData}
            disabled={isGenerating}
            className="group flex items-center gap-2 rounded-2xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-6 py-3 text-sm font-semibold text-[#29E7CD] shadow-lg transition-all duration-300 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/20 hover:shadow-xl disabled:opacity-50"
            title="Generate 5 sample logs per equipment (last 2 weeks)"
          >
            <Icon
              icon={Sparkles}
              size="sm"
              className="transition-transform duration-300 group-hover:rotate-12"
              aria-hidden={true}
            />
            <span>{isGenerating ? 'Generating Sample Data...' : 'Generate More Sample Logs'}</span>
            {!isGenerating && (
              <span className="text-xs opacity-75">(5 per equipment, last 2 weeks)</span>
            )}
          </button>
        </div>
      )}

      {/* Equipment Detail Drawer */}
      <EquipmentDetailDrawer
        equipment={drawerEquipment}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
