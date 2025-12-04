'use client';

import { useViewportHeight } from '@/hooks/useViewportHeight';
import { useTranslation } from '@/lib/useTranslation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useEquipmentLogs } from '../hooks/useEquipmentLogs';
import { useDrawerSwipeHandlers } from '../hooks/useDrawerSwipeHandlers';
import { useDrawerEffects } from '../hooks/useDrawerEffects';
import { TemperatureEquipment } from '../types';
import { EquipmentDrawerHeader } from './EquipmentDrawerHeader';
import { EquipmentDrawerTimeFilter } from './EquipmentDrawerTimeFilter';
import { EquipmentDrawerChartSection } from './EquipmentDrawerChartSection';
import { EquipmentDrawerStatisticsSection } from './EquipmentDrawerStatisticsSection';
import { EquipmentDrawerFooter } from './EquipmentDrawerFooter';
import { calculateTemperatureStatistics } from './utils';
import { Icon } from '@/components/ui/Icon';
import { getTypeIconComponent, getTypeLabel } from '../utils/temperatureUtils';
import { AlertTriangle } from 'lucide-react';

interface EquipmentDetailDrawerProps {
  equipment: TemperatureEquipment;
  isOpen: boolean;
  onClose: () => void;
}

export function EquipmentDetailDrawer({ equipment, isOpen, onClose }: EquipmentDetailDrawerProps) {
  const { t } = useTranslation();
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('all');
  const drawerRef = useRef<HTMLDivElement>(null);

  // Calculate viewport heights
  const { chartHeight, isMobile } = useViewportHeight({
    headerHeight: 80, // Header with swipe indicator
    footerHeight: 80, // Done button footer
    filtersHeight: 140, // Time filter + statistics section (2 columns)
    padding: 24, // 12px top + 12px bottom
  });

  const { logs, isLoading } = useEquipmentLogs({
    equipmentName: equipment?.name || null,
    equipmentLocation: equipment?.location || null,
    timeFilter,
  });

  // Calculate statistics for display
  const stats =
    equipment && logs.length > 0 ? calculateTemperatureStatistics(logs, equipment) : null;

  const { handleHeaderTouchStart, handleHeaderTouchMove, handleHeaderTouchEnd } =
    useDrawerSwipeHandlers({ isOpen, onClose });

  useDrawerEffects({ isOpen, onClose });

  // Use portal to render drawer at root level, outside any parent containers
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll drawer content to top when opened
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Small delay to ensure drawer is fully rendered
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      }, 100);
    }
  }, [isOpen]);

  if (!equipment || !mounted) return null;

  const drawerContent = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={true}
      />

      {/* Drawer with gradient border */}
      <div
        ref={drawerRef}
        className={`fixed right-0 z-[75] w-full transform rounded-l-3xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl transition-transform duration-200 ease-out ${
          !isMobile ? 'desktop:w-[600px] large-desktop:w-[700px] xl:w-[800px]' : ''
        } ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          top: isMobile
            ? 'calc(var(--header-height-mobile) + var(--safe-area-inset-top))'
            : 'calc(var(--header-height-desktop) + var(--safe-area-inset-top))',
          height: isMobile
            ? 'calc(100vh - var(--header-height-mobile) - var(--safe-area-inset-top))'
            : 'calc(100vh - var(--header-height-desktop) - var(--safe-area-inset-top))',
          maxHeight: '100vh',
          overflow: 'hidden',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="equipment-detail-title"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-l-3xl bg-[#0a0a0a]">
          <EquipmentDrawerHeader
            equipment={equipment}
            isMobile={isMobile}
            onClose={onClose}
            onTouchStart={handleHeaderTouchStart}
            onTouchMove={handleHeaderTouchMove}
            onTouchEnd={handleHeaderTouchEnd}
            getTypeIcon={getTypeIconComponent}
            getTypeLabel={getTypeLabel}
          />

          {/* Content - Scrollable with proper spacing */}
          <div
            ref={contentRef}
            className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain"
          >
            <div className="flex flex-1 flex-col p-4">
              {/* Time Filter - One Line */}
              <div className="mb-3 flex-shrink-0">
                <label className="mb-2 block text-xs font-semibold text-gray-300">
                  {t('temperature.timeFilter', 'Time Period')}
                </label>
                <EquipmentDrawerTimeFilter
                  timeFilter={timeFilter}
                  onTimeFilterChange={setTimeFilter}
                />
              </div>

              {/* Statistics Section - 2 Columns Below Time Filter */}
              <div className="mb-3 flex-shrink-0">
                <label className="mb-2 block text-xs font-semibold text-gray-300">
                  {t('temperature.statistics', 'Statistics')}
                </label>
                <EquipmentDrawerStatisticsSection
                  logs={logs}
                  equipment={equipment}
                  isLoading={isLoading}
                />
              </div>

              {/* Chart Section - Full Width Below */}
              <div className="mb-4 flex-shrink-0">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-300">
                    {t('temperature.temperatureChart', 'Temperature Chart')}
                  </label>
                  {(equipment.min_temp_celsius === null || equipment.max_temp_celsius === null) && (
                    <div className="flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2">
                      <Icon
                        icon={AlertTriangle}
                        size="sm"
                        className="text-yellow-400"
                        aria-hidden={true}
                      />
                      <span className="text-xs font-medium text-yellow-400">
                        Temperature thresholds not configured
                      </span>
                    </div>
                  )}
                </div>
                <EquipmentDrawerChartSection
                  logs={logs}
                  equipment={equipment}
                  timeFilter={timeFilter}
                  chartHeight={Math.max(chartHeight, 200)}
                  isLoading={isLoading}
                  statistics={stats}
                />
              </div>
            </div>
          </div>

          <EquipmentDrawerFooter onClose={onClose} />
        </div>
      </div>
    </>
  );

  // Render drawer using portal to ensure it's at root level, outside any parent containers
  return createPortal(drawerContent, document.body);
}
