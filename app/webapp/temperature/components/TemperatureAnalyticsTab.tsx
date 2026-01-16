'use client';

import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { EquipmentDetailDrawer } from './EquipmentDetailDrawer';
import { EquipmentStatusCard } from './EquipmentStatusCard';
import { TemperatureTimeFilter } from './TemperatureTimeFilter';
import { TemperatureAnalyticsEmptyState } from './TemperatureAnalyticsEmptyState';
import { GenerateSampleDataButton } from './GenerateSampleDataButton';
import { useEquipmentStatus } from '../hooks/useEquipmentStatus';
import { useSampleDataGeneration } from '../hooks/useSampleDataGeneration';
import { prefetchApi, getCachedData } from '@/lib/cache/data-cache';
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

  const { getEquipmentStatus, findOutOfRangeEquipment } = useEquipmentStatus({
    getFilteredLogs,
  });

  const { isGenerating, handleGenerateSampleData } = useSampleDataGeneration({
    onRefreshLogs,
  });

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
      const timeoutId = setTimeout(() => {
        setIsLoaded(true);

        // Smart equipment selection logic (only if not already selected)
        if (!selectedEquipmentId && equipment.length > 0) {
          // 1. First try to find equipment that is out of range
          const outOfRangeEquipment = findOutOfRangeEquipment(equipment);
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
      return () => clearTimeout(timeoutId);
    } else if (equipment.length > 0 && hasInitialized.current) {
      // If already initialized but data changed, update loaded state
      setIsLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    equipment.length, // Only length, not full array
    allLogs.length, // Only length, not full array
    selectedEquipmentId,
    hasManuallyChangedFilter,
    timeFilter,
    externalLoading,
    // Intentionally excluded: equipment, findOutOfRangeEquipment, findBestTimeFilter, dateOffset
    // Using lengths prevents infinite loops while still detecting data changes
  ]);

  const handleEquipmentCardClick = (equipment: TemperatureEquipment) => {
    setDrawerEquipment(equipment);
    setIsDrawerOpen(true);
    // Highlight selected equipment card
    setSelectedEquipmentId(equipment.id);
  };

  // Prefetch equipment logs on hover for instant drawer opening
  const handleCardHover = useCallback((equipment: TemperatureEquipment) => {
    const cacheKey = `equipment_logs_${equipment.name}`;
    const cached = getCachedData<TemperatureLog[]>(cacheKey);
    if (!cached) {
      // Prefetch logs for this equipment
      const locationsToQuery = [
        ...(equipment.location ? [equipment.location] : []),
        ...(equipment.name ? [equipment.name] : []),
      ].filter(Boolean);
      const uniqueLocations = [...new Set(locationsToQuery)];
      uniqueLocations.forEach(loc => {
        prefetchApi(`/api/temperature-logs?location=${loc}&pageSize=1000`);
      });
    }
  }, []);

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerEquipment(null);
  };

  // Show loading skeleton if data isn't ready or external loading is active
  if (!isLoaded || externalLoading) {
    return (
      <div className="space-y-6">
        {/* Time Period Filter Skeleton */}
        <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
          {['24h', '7d', '30d', 'all'].map(filter => (
            <div key={filter} className="h-8 w-20 rounded-xl bg-gray-700 px-4 py-2"></div>
          ))}
        </div>

        {/* Equipment Cards Skeleton */}
        <div className="tablet:grid-cols-3 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-3 xl:grid-cols-6">
          <LoadingSkeleton variant="card" count={6} height="80px" />
        </div>
      </div>
    );
  }

  const handleTimeFilterChange = (filter: '24h' | '7d' | '30d' | 'all') => {
    setTimeFilter(filter);
    setHasManuallyChangedFilter(true);
  };

  return (
    <div className="space-y-6">
      <TemperatureTimeFilter
        timeFilter={timeFilter}
        isLoaded={isLoaded}
        onTimeFilterChange={handleTimeFilterChange}
      />
      {/* Equipment Status Overview - Smart Responsive Grid */}
      <div
        className={`grid gap-3 ${
          equipment.length <= 2
            ? 'tablet:grid-cols-2 grid-cols-1'
            : equipment.length <= 4
              ? 'tablet:grid-cols-3 desktop:grid-cols-4 grid-cols-1'
              : equipment.length <= 6
                ? 'tablet:grid-cols-3 desktop:grid-cols-4 large-desktop:grid-cols-6 grid-cols-1'
                : equipment.length <= 12
                  ? 'tablet:grid-cols-3 desktop:grid-cols-4 large-desktop:grid-cols-5 grid-cols-1 xl:grid-cols-6'
                  : 'tablet:grid-cols-3 desktop:grid-cols-4 large-desktop:grid-cols-5 grid-cols-1 xl:grid-cols-5 2xl:grid-cols-6'
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
                onHover={() => handleCardHover(item)}
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
        <TemperatureAnalyticsEmptyState
          isGenerating={isGenerating}
          onGenerateSampleData={handleGenerateSampleData}
        />
      )}
      {/* Generate Sample Data Button - Always visible when equipment exists */}
      {isLoaded && equipment.length > 0 && allLogs.length > 0 && (
        <GenerateSampleDataButton
          isGenerating={isGenerating}
          onGenerateSampleData={handleGenerateSampleData}
          variant="secondary"
        />
      )}
      {/* Equipment Detail Drawer */}
      <EquipmentDetailDrawer
        equipment={drawerEquipment!}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
