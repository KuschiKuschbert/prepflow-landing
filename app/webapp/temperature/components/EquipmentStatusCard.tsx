'use client';

import { TemperatureEquipment } from '../types';
import { AlertTriangle, Settings } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { AlertCircle } from 'lucide-react';

interface EquipmentStatusCardProps {
  equipment: TemperatureEquipment;
  status: { status: string; color: string; temperature?: number };
  logs: any[];
  timeFilter: string;
  isSelected: boolean;
  isCompact: boolean;
  onSelect: () => void;
}

export function EquipmentStatusCard({
  equipment,
  status,
  logs,
  timeFilter,
  isSelected,
  isCompact,
  onSelect,
}: EquipmentStatusCardProps) {
  const isOutOfRange = status.status === 'out-of-range';
  const needsSetup = status.status === 'no-thresholds';

  return (
    <button
      onClick={onSelect}
      className={`group w-full rounded-xl border bg-[#1f1f1f] text-left shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
        isCompact ? 'p-3' : 'p-4'
      } ${
        isSelected
          ? 'border-[#29E7CD] bg-[#29E7CD]/5 ring-2 ring-[#29E7CD]/20'
          : isOutOfRange
            ? 'border-red-500/50 hover:border-red-500'
            : needsSetup
              ? 'border-yellow-500/50 hover:border-yellow-500'
              : 'border-[#2a2a2a] hover:border-[#29E7CD]/50'
      }`}
    >
      {/* Header with status indicator */}
      <div className={`flex items-center justify-between ${isCompact ? 'mb-2' : 'mb-3'}`}>
        <div className="min-w-0 flex-1">
          <h3
            className={`truncate font-semibold text-white transition-colors group-hover:text-[#29E7CD] ${
              isCompact ? 'text-xs' : 'text-sm'
            }`}
          >
            {equipment.name}
          </h3>
          <div className="mt-0.5 flex items-center space-x-1.5">
            <div
              className={`rounded-full ${isCompact ? 'h-1 w-1' : 'h-1.5 w-1.5'} ${
                isOutOfRange ? 'bg-red-500' : needsSetup ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            ></div>
            <span
              className={`font-medium ${isCompact ? 'text-xs' : 'text-xs'} ${
                isOutOfRange ? 'text-red-400' : needsSetup ? 'text-yellow-400' : 'text-green-400'
              }`}
            >
              {status.status === 'no-data'
                ? 'No Data'
                : status.status === 'no-thresholds'
                  ? 'Setup Required'
                  : status.status === 'in-range'
                    ? 'In Range'
                    : 'Out of Range'}
            </span>
          </div>
        </div>
      </div>

      {/* Temperature display */}
      <div className={isCompact ? 'mb-2' : 'mb-3'}>
        <div className={`font-bold text-white ${isCompact ? 'mb-1 text-lg' : 'mb-1 text-2xl'}`}>
          {status.temperature ? `${status.temperature.toFixed(1)}°C` : '--'}
        </div>
        <div className="text-xs text-gray-400">
          {logs.length} readings {isCompact ? '' : `• ${timeFilter.toUpperCase()}`}
        </div>
      </div>

      {/* Action indicators - only show in non-compact mode or if critical */}
      {!isCompact && (isOutOfRange || needsSetup) && (
        <div className="border-t border-[#2a2a2a] pt-3">
          {isOutOfRange && (
            <div className="flex items-center space-x-1.5 text-xs text-red-400">
              <Icon icon={AlertTriangle} size="xs" className="text-yellow-400" aria-hidden={true} />
              <span>Attention required</span>
            </div>
          )}
          {needsSetup && (
            <div className="flex items-center space-x-1.5 text-xs text-yellow-400">
              <Icon icon={Settings} size="xs" className="text-yellow-400" aria-hidden={true} />
              <span>Configure thresholds</span>
            </div>
          )}
        </div>
      )}

      {/* Compact mode critical indicators */}
      {isCompact && isOutOfRange && (
        <div className="flex items-center justify-center text-xs text-red-400">
          <Icon icon={AlertCircle} size="xs" className="text-red-400" aria-hidden={true} />
        </div>
      )}
    </button>
  );
}
