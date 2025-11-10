'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { TemperatureLog, TemperatureEquipment } from '../types';
import SimpleTemperatureChart from './SimpleTemperatureChart';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { EquipmentStatusCard } from './EquipmentStatusCard';
import { useTemperatureFilters } from './useTemperatureFilters';
import './temperature-charts.css';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface TemperatureAnalyticsTabProps {
  allLogs: TemperatureLog[];
  equipment: TemperatureEquipment[];
}

export default function TemperatureAnalyticsTab({
  allLogs,
  equipment,
}: TemperatureAnalyticsTabProps) {
  const { t } = useTranslation();
  const { formatDate } = useCountryFormatting();
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [dateOffset, setDateOffset] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
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
    // Only initialize once when data becomes available
    if (equipment.length > 0 && allLogs.length > 0 && !hasInitialized.current) {
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
        if (!hasManuallyChangedFilter) {
          const bestTimeFilter = findBestTimeFilter();
          if (bestTimeFilter !== timeFilter) {
            setTimeFilter(bestTimeFilter);
          }
        }

        hasInitialized.current = true;
      }, 0);
    }
  }, [
    equipment.length, // Only length, not full array
    allLogs.length, // Only length, not full array
    selectedEquipmentId,
    hasManuallyChangedFilter,
    timeFilter,
    // Removed: equipment, findOutOfRangeEquipment, findBestTimeFilter, dateOffset
  ]);

  const getSelectedEquipment = () => {
    return equipment.find(eq => eq.id === selectedEquipmentId) || null;
  };

  // Show loading skeleton if data isn't ready
  if (!isLoaded) {
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

        {/* Charts Skeleton */}
        <div className="space-y-6">
          <LoadingSkeleton variant="chart" count={3} height="320px" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Period Filter */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
        {isLoaded ? (
          ['24h', '7d', '30d', 'all'].map(filter => (
            <button
              key={filter}
              onClick={() => {
                setTimeFilter(filter as '24h' | '7d' | '30d' | 'all');
                setHasManuallyChangedFilter(true);
              }}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                timeFilter === filter
                  ? 'bg-[#29E7CD] text-black'
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
            </button>
          ))
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
                onSelect={() => setSelectedEquipmentId(item.id)}
              />
            );
          })
        ) : (
          // Loading skeleton for equipment cards
          <LoadingSkeleton variant="card" count={6} height="80px" />
        )}
      </div>

      {/* Selected Equipment Chart */}
      {!isLoaded ? (
        // Loading skeleton for chart
        <LoadingSkeleton variant="chart" height="320px" />
      ) : equipment.length === 0 ? (
        <div className="flex h-64 w-full items-center justify-center rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
          <p className="text-gray-400">No equipment found to display analytics.</p>
        </div>
      ) : selectedEquipmentId ? (
        <div className="chart-container">
          {(() => {
            const selectedEquipment = getSelectedEquipment();
            if (!selectedEquipment) return null;

            return (
              <SimpleTemperatureChart
                key={selectedEquipment.id}
                logs={getFilteredLogs(selectedEquipment)}
                equipment={selectedEquipment}
                timeFilter={timeFilter}
              />
            );
          })()}
        </div>
      ) : (
        <div className="flex h-64 w-full items-center justify-center rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
          <div className="text-center">
            <div className="mb-4 text-4xl">📊</div>
            <p className="mb-2 text-gray-400">Select an equipment to view its temperature chart</p>
            <p className="text-sm text-gray-500">
              Click on any equipment card above to see detailed analytics
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
