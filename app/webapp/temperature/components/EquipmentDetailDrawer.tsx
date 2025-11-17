'use client';

import { useViewportHeight } from '@/hooks/useViewportHeight';
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

  const { handleHeaderTouchStart, handleHeaderTouchMove, handleHeaderTouchEnd } =
    useDrawerSwipeHandlers({ isOpen, onClose });

  useDrawerEffects({ isOpen, onClose });

  if (!equipment) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[75] h-full w-full transform bg-[#0a0a0a] shadow-2xl transition-transform duration-300 ease-out ${
          !isMobile ? 'desktop:w-[500px] large-desktop:w-[600px]' : ''
        } ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="equipment-detail-title"
      >
        <div className="flex h-full flex-col">
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

          {/* Content - No scroll, uses calculated heights */}
          <div className="flex flex-1 flex-col overflow-hidden p-6">
            <EquipmentDrawerTimeFilter timeFilter={timeFilter} onTimeFilterChange={setTimeFilter} />

            {/* Chart and Statistics Container - Responsive Sidebar Layout */}
            <div className="desktop:flex-row desktop:gap-6 flex flex-1 flex-col">
              {/* Graph Section - Responsive Height */}
              <div className="desktop:mb-0 desktop:min-w-0 mb-4 flex-1 flex-shrink-0">
                <EquipmentDrawerChartSection
                  logs={logs}
                  equipment={equipment}
                  timeFilter={timeFilter}
                  chartHeight={chartHeight}
                  isLoading={isLoading}
                />
              </div>

              {/* Statistics Dashboard - Sidebar */}
              <div className="desktop:w-[400px] large-desktop:w-[450px] w-full flex-shrink-0 xl:w-[500px]">
                <EquipmentDrawerStatisticsSection
                  logs={logs}
                  equipment={equipment}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>

          <EquipmentDrawerFooter onClose={onClose} />
        </div>
      </div>
    </>
  );
}
