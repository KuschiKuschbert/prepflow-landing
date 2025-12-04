'use client';

import { Calendar } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { DateRange, DateRangePreset } from '../types';
import { useEffect, useState } from 'react';

interface PerformanceDateRangeProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const PRESETS = [
  { value: '7d' as const, label: 'Last 7 Days' },
  { value: '30d' as const, label: 'Last 30 Days' },
  { value: '90d' as const, label: 'Last 90 Days' },
  { value: 'all' as const, label: 'All Time' },
  { value: 'custom' as const, label: 'Custom Range' },
] as const;

export default function PerformanceDateRange({
  dateRange,
  onDateRangeChange,
}: PerformanceDateRangeProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handlePresetChange = (preset: DateRangePreset) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let startDate: Date | null = null;
    let endDate: Date = today;

    switch (preset) {
      case '7d':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;
      case '30d':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
        break;
      case '90d':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 89);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'all':
        startDate = null;
        break;
      case 'custom':
        // Keep existing dates when switching to custom
        return;
    }

    onDateRangeChange({
      startDate,
      endDate,
      preset,
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (date: Date) => {
    if (!isHydrated) return '';
    // Use consistent formatting that works on both server and client
    const day = date.getDate();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    if (date) date.setHours(0, 0, 0, 0);
    onDateRangeChange({
      ...dateRange,
      startDate: date,
      preset: 'custom',
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    if (date) date.setHours(23, 59, 59, 999);
    onDateRangeChange({
      ...dateRange,
      endDate: date || new Date(),
      preset: 'custom',
    });
  };

  return (
    <div className="tablet:mb-3 tablet:p-3 desktop:mb-4 desktop:p-4 mb-2 rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-2.5">
      <div className="tablet:mb-2 mb-1.5 flex items-center gap-2">
        <Icon icon={Calendar} size="sm" className="text-[#29E7CD]" />
        <h3 className="text-sm font-semibold text-white">Time Period</h3>
      </div>

      {/* Preset Buttons */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        {PRESETS.map(preset => (
          <button
            key={preset.value}
            onClick={() => handlePresetChange(preset.value)}
            className={`tablet:px-3 tablet:py-1.5 rounded-full px-2 py-1 text-xs font-medium transition-all ${
              dateRange.preset === preset.value
                ? 'border-2 border-[#29E7CD] bg-[#29E7CD]/20 text-[#29E7CD] shadow-lg shadow-[#29E7CD]/20'
                : 'border border-[#2a2a2a] bg-[#2a2a2a] text-gray-400 hover:border-[#29E7CD]/50 hover:text-[#29E7CD]'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Date Range Inputs */}
      {dateRange.preset === 'custom' && (
        <div className="tablet:grid-cols-2 grid grid-cols-1 gap-3">
          <div className="flex flex-col">
            <label className="mb-1.5 text-xs font-medium text-gray-300">Start Date</label>
            <input
              type="date"
              value={formatDate(dateRange.startDate)}
              onChange={handleStartDateChange}
              max={formatDate(dateRange.endDate || new Date())}
              className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1.5 text-xs font-medium text-gray-300">End Date</label>
            <input
              type="date"
              value={formatDate(dateRange.endDate)}
              onChange={handleEndDateChange}
              max={formatDate(new Date())}
              min={formatDate(dateRange.startDate)}
              className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Display Current Range */}
      {isHydrated && dateRange.preset !== 'custom' && dateRange.startDate && dateRange.endDate && (
        <div className="mt-2 text-xs text-gray-400">
          {dateRange.preset === 'all' ? (
            <span>Showing all available data</span>
          ) : (
            <span>
              {formatDateForDisplay(dateRange.startDate)} to{' '}
              {formatDateForDisplay(dateRange.endDate)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
