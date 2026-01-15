'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertCircle, AlertTriangle, Settings } from 'lucide-react';
import { TemperatureEquipment, TemperatureLog } from '../types';

interface EquipmentStatusCardProps {
  equipment: TemperatureEquipment;
  status: { status: string; color: string; temperature?: number };
  logs: TemperatureLog[];
  timeFilter: string;
  isSelected: boolean;
  isCompact: boolean;
  onSelect: () => void;
  onHover?: () => void;
}

export function EquipmentStatusCard({
  equipment,
  status,
  logs,
  timeFilter,
  isSelected,
  isCompact,
  onSelect,
  onHover,
}: EquipmentStatusCardProps) {
  const isOutOfRange = status.status === 'out-of-range';
  const needsSetup = status.status === 'no-thresholds';

  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover ? () => onHover() : undefined}
      className={`group relative w-full overflow-hidden rounded-3xl border bg-[var(--surface)] text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] ${
        isCompact ? 'p-3' : 'p-5'
      } ${
        isSelected
          ? 'scale-[1.02] border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/5 ring-2 ring-[#29E7CD]/30'
          : isOutOfRange
            ? 'scale-100 border-[var(--color-error)]/50 ring-0 hover:border-[var(--color-error)]/70 hover:bg-[var(--color-error)]/5'
            : needsSetup
              ? 'scale-100 border-[var(--color-warning)]/50 ring-0 hover:border-[var(--color-warning)]/70 hover:bg-[var(--color-warning)]/5'
              : 'scale-100 border-[var(--border)] ring-0 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5'
      }`}
    >
      {/* Gradient accent on hover */}
      {!isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      <div className="relative">
        {/* Header with status indicator */}
        <div className={`flex items-center justify-between ${isCompact ? 'mb-3' : 'mb-4'}`}>
          <div className="min-w-0 flex-1">
            <h3
              className={`truncate font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)] ${
                isCompact ? 'text-sm' : 'text-base'
              }`}
            >
              {equipment.name}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full shadow-lg ${
                  isOutOfRange
                    ? 'animate-pulse bg-[var(--color-error)]'
                    : needsSetup
                      ? 'bg-[var(--color-warning)]'
                      : status.status === 'no-data'
                        ? 'bg-gray-500'
                        : 'bg-[var(--color-success)]'
                }`}
              />
              <span
                className={`text-xs font-semibold ${
                  isOutOfRange
                    ? 'text-[var(--color-error)]'
                    : needsSetup
                      ? 'text-[var(--color-warning)]'
                      : status.status === 'no-data'
                        ? 'text-[var(--foreground-muted)]'
                        : 'text-[var(--color-success)]'
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
            className={`font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)] ${
              isCompact ? 'mb-1 text-xl' : 'mb-2 text-3xl'
            }`}
          >
            {status.temperature ? `${status.temperature.toFixed(1)}°C` : '--'}
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
            <span>
              {logs.length} reading{logs.length !== 1 ? 's' : ''}
            </span>
            {!isCompact && (
              <>
                <span className="text-[var(--foreground-subtle)]">•</span>
                <span className="uppercase">{timeFilter}</span>
              </>
            )}
          </div>
        </div>

        {/* Action indicators - only show in non-compact mode or if critical */}
        {!isCompact && (isOutOfRange || needsSetup) && (
          <div className="border-t border-[var(--border)] pt-3">
            {isOutOfRange && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-error)]">
                <Icon
                  icon={AlertTriangle}
                  size="xs"
                  className="text-[var(--color-error)]"
                  aria-hidden={true}
                />
                <span>Attention required</span>
              </div>
            )}
            {needsSetup && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-warning)]">
                <Icon
                  icon={Settings}
                  size="xs"
                  className="text-[var(--color-warning)]"
                  aria-hidden={true}
                />
                <span>Configure thresholds</span>
              </div>
            )}
          </div>
        )}

        {/* Compact mode critical indicators */}
        {isCompact && isOutOfRange && (
          <div className="flex items-center justify-center text-xs text-[var(--color-error)]">
            <Icon
              icon={AlertCircle}
              size="xs"
              className="text-[var(--color-error)]"
              aria-hidden={true}
            />
          </div>
        )}
      </div>
    </button>
  );
}
