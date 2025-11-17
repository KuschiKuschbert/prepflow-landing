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
      className={`group relative w-full overflow-hidden rounded-3xl border bg-[#1f1f1f] text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isCompact ? 'p-3' : 'p-5'
      } ${
        isSelected
          ? 'border-[#29E7CD] bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/5 ring-2 ring-[#29E7CD]/30'
          : isOutOfRange
            ? 'border-red-500/50 hover:border-red-500/70 hover:bg-red-500/5'
            : needsSetup
              ? 'border-yellow-500/50 hover:border-yellow-500/70 hover:bg-yellow-500/5'
              : 'border-[#2a2a2a] hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/5'
      }`}
    >
      {/* Gradient accent on hover */}
      {!isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#29E7CD]/5 to-[#D925C7]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      <div className="relative">
        {/* Header with status indicator */}
        <div className={`flex items-center justify-between ${isCompact ? 'mb-3' : 'mb-4'}`}>
          <div className="min-w-0 flex-1">
            <h3
              className={`truncate font-bold text-white transition-colors group-hover:text-[#29E7CD] ${
                isCompact ? 'text-sm' : 'text-base'
              }`}
            >
              {equipment.name}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full shadow-lg ${
                  isOutOfRange
                    ? 'animate-pulse bg-red-500'
                    : needsSetup
                      ? 'bg-yellow-500'
                      : status.status === 'no-data'
                        ? 'bg-gray-500'
                        : 'bg-green-500'
                }`}
              />
              <span
                className={`text-xs font-semibold ${
                  isOutOfRange
                    ? 'text-red-400'
                    : needsSetup
                      ? 'text-yellow-400'
                      : status.status === 'no-data'
                        ? 'text-gray-400'
                        : 'text-green-400'
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
        <div className={isCompact ? 'mb-3' : 'mb-4'}>
          <div
            className={`font-bold text-white transition-colors group-hover:text-[#29E7CD] ${
              isCompact ? 'mb-1 text-xl' : 'mb-2 text-3xl'
            }`}
          >
            {status.temperature ? `${status.temperature.toFixed(1)}°C` : '--'}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>
              {logs.length} reading{logs.length !== 1 ? 's' : ''}
            </span>
            {!isCompact && (
              <>
                <span className="text-gray-600">•</span>
                <span className="uppercase">{timeFilter}</span>
              </>
            )}
          </div>
        </div>

        {/* Action indicators - only show in non-compact mode or if critical */}
        {!isCompact && (isOutOfRange || needsSetup) && (
          <div className="border-t border-[#2a2a2a] pt-3">
            {isOutOfRange && (
              <div className="flex items-center gap-2 text-xs text-red-400">
                <Icon icon={AlertTriangle} size="xs" className="text-red-400" aria-hidden={true} />
                <span>Attention required</span>
              </div>
            )}
            {needsSetup && (
              <div className="flex items-center gap-2 text-xs text-yellow-400">
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
      </div>
    </button>
  );
}
