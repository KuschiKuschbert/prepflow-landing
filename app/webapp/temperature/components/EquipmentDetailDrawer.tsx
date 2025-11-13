'use client';

import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { useTranslation } from '@/lib/useTranslation';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useEquipmentLogs } from '../hooks/useEquipmentLogs';
import { TemperatureEquipment } from '../types';
import { EquipmentStatistics } from './EquipmentStatistics';
import SimpleTemperatureChart from './SimpleTemperatureChart';

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

export function EquipmentDetailDrawer({
  equipment,
  isOpen,
  onClose,
}: EquipmentDetailDrawerProps) {
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

  const getTypeIcon = (type: string) => temperatureTypes.find(t => t.value === type)?.icon || '🌡️';
  const getTypeLabel = (type: string) =>
    temperatureTypes.find(t => t.value === type)?.label || type;

  // Handle swipe to close on mobile - only from header area
  const minSwipeDistance = 100; // Increased threshold to prevent accidental closes
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeStartY, setSwipeStartY] = useState<number | null>(null);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);

  const handleHeaderTouchStart = (e: React.TouchEvent) => {
    // Only allow swipe-to-close from the header area
    setSwipeStartY(e.targetTouches[0].clientY);
    setSwipeStartX(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const handleHeaderTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || swipeStartY === null || swipeStartX === null) return;

    const currentY = e.targetTouches[0].clientY;
    const currentX = e.targetTouches[0].clientX;
    const deltaY = currentY - swipeStartY;
    const deltaX = Math.abs(currentX - swipeStartX);

    // Only allow swipe if it's primarily vertical (not horizontal scrolling)
    // And only if swiping down
    if (deltaY > 0 && deltaY > deltaX * 1.5) {
      // Allow the swipe to continue
      e.preventDefault();
    } else {
      // Cancel swipe detection if it's horizontal or upward
      setIsSwiping(false);
    }
  };

  const handleHeaderTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping || swipeStartY === null) {
      setIsSwiping(false);
      setSwipeStartY(null);
      setSwipeStartX(null);
      return;
    }

    const endY = e.changedTouches[0].clientY;
    const distance = swipeStartY - endY;
    const isDownSwipe = distance > minSwipeDistance;

    if (isDownSwipe && isOpen) {
      onClose();
    }

    setIsSwiping(false);
    setSwipeStartY(null);
    setSwipeStartX(null);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
        className={`fixed right-0 top-0 z-[75] h-full w-full transform bg-[#0a0a0a] shadow-2xl transition-transform duration-300 ease-out ${
          !isMobile ? 'lg:w-[600px]' : ''
        } ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="equipment-detail-title"
      >
        <div className="flex h-full flex-col">
          {/* Header - Swipe to close only works from here */}
          <div
            className={`flex flex-shrink-0 flex-col border-b border-[#2a2a2a] bg-[#0a0a0a] ${
              isMobile ? 'touch-none' : 'lg:touch-auto'
            }`}
            onTouchStart={handleHeaderTouchStart}
            onTouchMove={handleHeaderTouchMove}
            onTouchEnd={handleHeaderTouchEnd}
          >
            {/* Swipe indicator for mobile */}
            {isMobile && (
              <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[#2a2a2a]" aria-hidden="true" />
            )}

            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                  <span className="text-2xl">{getTypeIcon(equipment.equipment_type)}</span>
                </div>
                <div>
                  <h2 id="equipment-detail-title" className="text-xl font-bold text-white">
                    {equipment.name}
                  </h2>
                  <p className="text-sm text-gray-400">{getTypeLabel(equipment.equipment_type)}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2a2a] text-gray-400 transition-all duration-200 hover:bg-[#3a3a3a] hover:text-white hover:scale-110 active:scale-95"
                aria-label="Close drawer"
                title="Close"
              >
                <Icon icon={X} size="md" aria-hidden={true} />
              </button>
            </div>
          </div>

          {/* Content - No scroll, uses calculated heights */}
          <div className="flex flex-1 flex-col overflow-hidden p-6">
            {/* Time Filter Buttons */}
            <div className="mb-6 flex flex-shrink-0 flex-wrap gap-2 rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 shadow-lg">
              {(['24h', '7d', '30d', 'all'] as const).map(filter => {
                const isActive = timeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
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
              })}
            </div>

            {/* Graph Section - Responsive Height */}
            <div className="mb-4 flex-shrink-0 sm:mb-6">
              {isLoading ? (
                <LoadingSkeleton variant="chart" height={`${chartHeight}px`} />
              ) : logs.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 text-center shadow-lg sm:h-[250px]">
                  <div>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 mx-auto sm:h-20 sm:w-20">
                      <svg
                        className="h-8 w-8 text-gray-400 sm:h-10 sm:w-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h4 className="mb-2 text-base font-medium text-white sm:text-lg">No Temperature Data</h4>
                    <p className="text-xs text-gray-400 sm:text-sm">
                      No temperature logs found for this equipment. Add some temperature readings to see the chart.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ height: `${chartHeight}px` }}>
                  <SimpleTemperatureChart
                    logs={logs}
                    equipment={equipment}
                    timeFilter={timeFilter}
                    height={chartHeight}
                  />
                </div>
              )}
            </div>

            {/* Statistics Dashboard */}
            <div className="flex-shrink-0">
              {isLoading ? (
                <div className="space-y-4">
                  <LoadingSkeleton variant="card" height="120px" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <LoadingSkeleton variant="card" height="180px" />
                    <LoadingSkeleton variant="card" height="180px" />
                    <LoadingSkeleton variant="card" height="180px" />
                    <LoadingSkeleton variant="card" height="180px" />
                  </div>
                </div>
              ) : logs.length === 0 ? (
                <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center shadow-lg">
                  <p className="text-gray-400">
                    {t('temperature.noLogsForEquipment', 'No temperature logs found for this equipment')}
                  </p>
                </div>
              ) : (
                <EquipmentStatistics logs={logs} equipment={equipment} />
              )}
            </div>
          </div>

          {/* Footer with Done Button */}
          <div className="flex flex-shrink-0 border-t border-[#2a2a2a] bg-[#0a0a0a] p-4 lg:p-6">
            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 text-base font-semibold text-black shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
              aria-label="Close drawer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
