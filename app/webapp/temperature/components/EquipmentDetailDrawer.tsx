'use client';

import { useViewportHeight } from '@/hooks/useViewportHeight';
import { useTranslation } from '@/lib/useTranslation';
import { useRef, useState } from 'react';
import { useEquipmentLogs } from '../hooks/useEquipmentLogs';
import { useDrawerSwipeHandlers } from '../hooks/useDrawerSwipeHandlers';
import { useDrawerEffects } from '../hooks/useDrawerEffects';
import { TemperatureEquipment } from '../types';
import { EquipmentDrawerHeader } from './EquipmentDrawerHeader';
import { EquipmentDrawerTimeFilter } from './EquipmentDrawerTimeFilter';
import { EquipmentDrawerChartSection } from './EquipmentDrawerChartSection';
import { EquipmentDrawerStatisticsSection } from './EquipmentDrawerStatisticsSection';
import { EquipmentDrawerFooter } from './EquipmentDrawerFooter';
import { TrendCard } from './TrendCard';
import { calculateTemperatureStatistics } from './utils';

interface EquipmentDetailDrawerProps {
  equipment: TemperatureEquipment | null;
  isOpen: boolean;
  onClose: () => void;
}

const temperatureTypes = [
  { value: 'fridge', label: 'Fridge', icon: '🧊' },
  { value: 'freezer', label: 'Freezer', icon: '❄️' },
  { value: 'food_cooking', label: 'Food Cooking', icon: '🔥' },
  { value: 'food_hot_holding', label: 'Food Hot Holding', icon: '🍲' },
  { value: 'food_cold_holding', label: 'Food Cold Holding', icon: '🥗' },
  { value: 'storage', label: 'Storage', icon: '📦' },
];

const getTypeIcon = (type: string) => temperatureTypes.find(t => t.value === type)?.icon || '🌡️';
const getTypeLabel = (type: string) => temperatureTypes.find(t => t.value === type)?.label || type;

export function EquipmentDetailDrawer({ equipment, isOpen, onClose }: EquipmentDetailDrawerProps) {
  const { t } = useTranslation();
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('all');
  const drawerRef = useRef<HTMLDivElement>(null);

  // Calculate viewport heights
  const { chartHeight, isMobile } = useViewportHeight({
    headerHeight: 80, // Header with swipe indicator
    footerHeight: 80, // Done button footer
    filtersHeight: 60, // Time filter buttons
    padding: 48, // 24px top + 24px bottom
  });

  const { logs, isLoading } = useEquipmentLogs({
    equipmentName: equipment?.name || null,
    equipmentLocation: equipment?.location || null,
    timeFilter,
  });

  // Calculate statistics for Trend card
  const stats =
    equipment && logs.length > 0 ? calculateTemperatureStatistics(logs, equipment) : null;

  const { handleHeaderTouchStart, handleHeaderTouchMove, handleHeaderTouchEnd } =
    useDrawerSwipeHandlers({ isOpen, onClose });

  useDrawerEffects({ isOpen, onClose });

  if (!equipment) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[75] h-screen w-full transform bg-[#0a0a0a] shadow-2xl transition-transform duration-300 ease-out ${
          !isMobile ? 'desktop:w-[600px] large-desktop:w-[700px] xl:w-[800px]' : ''
        } ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ maxHeight: '100vh', overflow: 'hidden' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="equipment-detail-title"
      >
        <div className="flex h-full flex-col overflow-hidden">
          <EquipmentDrawerHeader
            equipment={equipment}
            isMobile={isMobile}
            onClose={onClose}
            onTouchStart={handleHeaderTouchStart}
            onTouchMove={handleHeaderTouchMove}
            onTouchEnd={handleHeaderTouchEnd}
            getTypeIcon={getTypeIcon}
            getTypeLabel={getTypeLabel}
          />

          {/* Content - Scrollable with proper spacing */}
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain">
            <div className="flex flex-1 flex-col p-6 pt-6">
              {/* Time Filter - Prominent and visible */}
              <div className="mb-6 flex-shrink-0">
                <label className="mb-3 block text-sm font-semibold text-gray-300">
                  {t('temperature.timeFilter', 'Time Period')}
                </label>
                <EquipmentDrawerTimeFilter
                  timeFilter={timeFilter}
                  onTimeFilterChange={setTimeFilter}
                />
              </div>

              {/* Chart and Statistics Container - Responsive Sidebar Layout */}
              <div className="desktop:flex-row desktop:gap-6 desktop:items-start flex flex-1 flex-col gap-6">
                {/* Graph Section - Responsive Height with minimum */}
                <div className="desktop:mb-0 desktop:min-w-0 desktop:flex-1 mb-6 flex-shrink-0">
                  <div className="mb-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-300">
                        {t('temperature.temperatureChart', 'Temperature Chart')}
                      </label>
                    </div>
                    {equipment.min_temp_celsius !== null && equipment.max_temp_celsius !== null && (
                      <div className="flex items-center gap-4 rounded-xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-[#29E7CD]" />
                          <span className="text-xs font-medium text-[#29E7CD]">
                            Safe Range: {equipment.min_temp_celsius}°C -{' '}
                            {equipment.max_temp_celsius}°C
                          </span>
                        </div>
                      </div>
                    )}
                    {(equipment.min_temp_celsius === null ||
                      equipment.max_temp_celsius === null) && (
                      <div className="flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2">
                        <span className="text-xs font-medium text-yellow-400">
                          ⚠️ Temperature thresholds not configured
                        </span>
                      </div>
                    )}
                  </div>
                  <EquipmentDrawerChartSection
                    logs={logs}
                    equipment={equipment}
                    timeFilter={timeFilter}
                    chartHeight={Math.max(chartHeight, 300)}
                    isLoading={isLoading}
                  />
                  {/* Trend Card - Under Graph */}
                  {stats && logs.length > 0 && (
                    <div className="mt-4">
                      <TrendCard
                        direction={stats.trend.direction}
                        percentageChange={stats.trend.percentageChange}
                      />
                    </div>
                  )}
                </div>

                {/* Statistics Dashboard - Sidebar */}
                <div className="desktop:w-[280px] large-desktop:w-[320px] desktop:flex-shrink-0 desktop:overflow-y-auto w-full xl:w-[360px]">
                  <div className="mb-3 flex-shrink-0">
                    <label className="text-sm font-semibold text-gray-300">
                      {t('temperature.statistics', 'Statistics')}
                    </label>
                  </div>
                  <EquipmentDrawerStatisticsSection
                    logs={logs}
                    equipment={equipment}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          <EquipmentDrawerFooter onClose={onClose} />
        </div>
      </div>
    </>
  );
}
