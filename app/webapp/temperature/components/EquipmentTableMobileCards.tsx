'use client';

import { Icon } from '@/components/ui/Icon';
import { LucideIcon } from 'lucide-react';
import { TemperatureEquipment } from '../types';

interface EquipmentTableMobileCardsProps {
  equipment: TemperatureEquipment[];
  equipmentStatuses: Map<string, { status: string; color: string; temperature?: number }>;
  equipmentLogs: Map<string, unknown[]>;
  selectedEquipmentId: string | null;
  onSelect: (equipment: TemperatureEquipment) => void;
  startIndex: number;
  endIndex: number;
  getTypeIcon: (type: string) => LucideIcon;
  getTypeLabel: (type: string) => string;
}

export function EquipmentTableMobileCards({
  equipment,
  equipmentStatuses,
  equipmentLogs,
  selectedEquipmentId,
  onSelect,
  startIndex,
  endIndex,
  getTypeIcon,
  getTypeLabel,
}: EquipmentTableMobileCardsProps) {
  return (
    <div className="large-desktop:hidden block divide-y divide-[var(--muted)]">
      {equipment.slice(startIndex, endIndex).map(item => {
        const status = equipmentStatuses.get(item.id) || {
          status: 'no-data',
          color: 'text-[var(--foreground-muted)]',
        };
        const logs = equipmentLogs.get(item.id) || [];
        const isSelected = selectedEquipmentId === item.id;
        const isOutOfRange = status.status === 'out-of-range';
        const needsSetup = status.status === 'no-thresholds';
        const hasNoData = status.status === 'no-data';

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`w-full p-4 text-left transition-all duration-200 ${
              isSelected
                ? 'border-l-4 border-l-[#29E7CD] bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/5'
                : isOutOfRange
                  ? 'hover:bg-[var(--color-error)]/5'
                  : needsSetup
                    ? 'hover:bg-[var(--color-warning)]/5'
                    : 'hover:bg-[var(--primary)]/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
                <Icon
                  icon={getTypeIcon(item.equipment_type)}
                  size="lg"
                  className="text-[var(--primary)]"
                  aria-hidden={true}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 text-base font-semibold text-[var(--foreground)]">
                  {item.name}
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isOutOfRange
                        ? 'animate-pulse bg-[var(--color-error)]'
                        : needsSetup
                          ? 'bg-[var(--color-warning)]'
                          : hasNoData
                            ? 'bg-[var(--foreground-subtle)]'
                            : 'bg-[var(--color-success)]'
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold ${
                      isOutOfRange
                        ? 'text-[var(--color-error)]'
                        : needsSetup
                          ? 'text-[var(--color-warning)]'
                          : hasNoData
                            ? 'text-[var(--foreground-muted)]'
                            : 'text-[var(--color-success)]'
                    }`}
                  >
                    {hasNoData
                      ? 'No Data'
                      : needsSetup
                        ? 'Setup Required'
                        : status.status === 'in-range'
                          ? 'In Range'
                          : 'Out of Range'}
                  </span>
                </div>
                <div className="text-xl font-bold text-[var(--foreground)]">
                  {status.temperature ? `${status.temperature.toFixed(1)}°C` : '--'}
                </div>
                <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                  {logs.length} reading{logs.length !== 1 ? 's' : ''} •{' '}
                  {getTypeLabel(item.equipment_type)}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
