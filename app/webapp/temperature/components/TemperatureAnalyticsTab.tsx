'use client';

import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { getCachedData, prefetchApi } from '@/lib/cache/data-cache';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEquipmentAnalyticsSummaries } from '../hooks/useEquipmentAnalyticsSummaries';
import { useSampleDataGeneration } from '../hooks/useSampleDataGeneration';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { EquipmentDetailDrawer } from './EquipmentDetailDrawer';
import { EquipmentStatusCard } from './EquipmentStatusCard';
import { GenerateSampleDataButton } from './GenerateSampleDataButton';
import { TemperatureAnalyticsEmptyState } from './TemperatureAnalyticsEmptyState';
import { TemperatureTimeFilter } from './TemperatureTimeFilter';

interface TemperatureAnalyticsTabProps {
  equipment: TemperatureEquipment[];
  isLoading?: boolean;
  onRefreshLogs?: () => void;
  /**
   * @deprecated allLogs is no longer used – analytics data is fetched
   * server-side per equipment.  The prop is kept for backward compatibility
   * with the parent page.tsx but has no effect on this tab.
   */
  allLogs?: TemperatureLog[];
}

/**
 * TemperatureAnalyticsTab
 *
 * Shows a status card per equipment piece using server-aggregated analytics.
 * No large "allLogs" array is held in memory.  Each equipment's data is fetched
 * via the analytics API which returns pre-aggregated daily summaries and at most
 * 200 chart points – efficient regardless of how many years of data are stored.
 */
export default function TemperatureAnalyticsTab({
  equipment,
  isLoading: externalLoading = false,
  onRefreshLogs,
}: TemperatureAnalyticsTabProps) {
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [drawerEquipment, setDrawerEquipment] = useState<TemperatureEquipment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const hasInitialized = useRef(false);

  const { summaryMap, isLoading: analyticsLoading } = useEquipmentAnalyticsSummaries(
    equipment,
    timeFilter,
  );

  const { isGenerating, handleGenerateSampleData } = useSampleDataGeneration({ onRefreshLogs });

  // Mark as loaded once equipment is available and not externally loading
  useEffect(() => {
    if (externalLoading) {
      setIsLoaded(false);
      return;
    }

    if (equipment.length > 0 && !hasInitialized.current) {
      const id = setTimeout(() => {
        setIsLoaded(true);
        if (!selectedEquipmentId && equipment.length > 0) {
          // Auto-select any out-of-range equipment first, otherwise first equipment
          const outOfRange = equipment.find(eq => {
            const summary = summaryMap.get(eq.id);
            if (!summary || summary.summary.totalReadings === 0) return false;
            return summary.summary.outOfRangeCount > 0;
          });
          setSelectedEquipmentId(outOfRange?.id ?? equipment[0].id);
        }
        hasInitialized.current = true;
      }, 0);
      return () => clearTimeout(id);
    } else if (equipment.length > 0 && hasInitialized.current) {
      setIsLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipment.length, externalLoading, selectedEquipmentId]);

  const handleEquipmentCardClick = (eq: TemperatureEquipment) => {
    setDrawerEquipment(eq);
    setIsDrawerOpen(true);
    setSelectedEquipmentId(eq.id);
  };

  // Prefetch equipment logs on hover for instant drawer opening
  const handleCardHover = useCallback(
    (eq: TemperatureEquipment) => {
      const cacheKey = `equipment_logs_${eq.id}_${timeFilter}`;
      const cached = getCachedData(cacheKey);
      if (!cached) {
        const params = new URLSearchParams({
          equipment_id: eq.id,
          period: timeFilter,
        });
        prefetchApi(`/api/temperature-logs/analytics?${params.toString()}`);
      }
    },
    [timeFilter],
  );

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerEquipment(null);
  };

  const handleTimeFilterChange = (filter: '24h' | '7d' | '30d' | '90d' | '1y' | 'all') => {
    setTimeFilter(filter);
  };

  if (!isLoaded || externalLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
          {['24h', '7d', '30d', '90d', '1y', 'all'].map(f => (
            <div key={f} className="h-8 w-20 rounded-xl bg-[var(--muted)] px-4 py-2" />
          ))}
        </div>
        <div className="tablet:grid-cols-3 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-3 xl:grid-cols-6">
          <LoadingSkeleton variant="card" count={6} height="80px" />
        </div>
      </div>
    );
  }

  const hasAnyData = Array.from(summaryMap.values()).some(s => s.summary.totalReadings > 0);

  return (
    <div className="space-y-6">
      {/* Extended time filter – includes 90d and 1y for historical data */}
      <TemperatureTimeFilter
        timeFilter={timeFilter}
        isLoaded={isLoaded}
        onTimeFilterChange={handleTimeFilterChange}
        extendedOptions
      />

      {/* Loading overlay while fetching analytics per equipment */}
      {analyticsLoading && (
        <div className="tablet:grid-cols-3 desktop:grid-cols-4 large-desktop:grid-cols-5 grid grid-cols-1 gap-3 xl:grid-cols-6">
          <LoadingSkeleton variant="card" count={equipment.length || 6} height="80px" />
        </div>
      )}

      {/* Equipment status cards */}
      {!analyticsLoading && (
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
          {equipment.map(item => {
            const summary = summaryMap.get(item.id);
            const totalReadings = summary?.summary.totalReadings ?? 0;
            const outOfRangeCount = summary?.summary.outOfRangeCount ?? 0;
            const lastTemp = summary?.summary.avgTemp ?? null;

            // Derive status from server summary (no raw logs needed)
            let statusInfo: { status: string; color: string; temperature?: number };
            if (totalReadings === 0) {
              statusInfo = { status: 'no-data', color: 'text-[var(--foreground-muted)]' };
            } else if (item.min_temp_celsius === null || item.max_temp_celsius === null) {
              statusInfo = { status: 'no-thresholds', color: 'text-[var(--color-info)]' };
            } else if (outOfRangeCount > 0) {
              statusInfo = {
                status: 'out-of-range',
                color: 'text-[var(--color-error)]',
                temperature: lastTemp ?? undefined,
              };
            } else {
              statusInfo = {
                status: 'in-range',
                color: 'text-[var(--color-success)]',
                temperature: lastTemp ?? undefined,
              };
            }

            return (
              <EquipmentStatusCard
                key={item.id}
                equipment={item}
                status={statusInfo}
                logs={[]}
                readingCount={totalReadings}
                timeFilter={timeFilter}
                isSelected={selectedEquipmentId === item.id}
                isCompact={equipment.length > 6}
                onSelect={() => handleEquipmentCardClick(item)}
                onHover={() => handleCardHover(item)}
              />
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {isLoaded && equipment.length > 0 && !hasAnyData && !analyticsLoading && (
        <TemperatureAnalyticsEmptyState
          isGenerating={isGenerating}
          onGenerateSampleData={handleGenerateSampleData}
        />
      )}

      {isLoaded && equipment.length > 0 && hasAnyData && (
        <GenerateSampleDataButton
          isGenerating={isGenerating}
          onGenerateSampleData={handleGenerateSampleData}
          variant="secondary"
        />
      )}

      <EquipmentDetailDrawer
        equipment={drawerEquipment!}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
