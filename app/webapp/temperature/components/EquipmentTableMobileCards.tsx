'use client';

import { TemperatureEquipment } from '../types';

interface EquipmentTableMobileCardsProps {
  equipment: TemperatureEquipment[];
  equipmentStatuses: Map<string, { status: string; color: string; temperature?: number }>;
  equipmentLogs: Map<string, any[]>;
  selectedEquipmentId: string | null;
  onSelect: (equipment: TemperatureEquipment) => void;
  startIndex: number;
  endIndex: number;
  getTypeIcon: (type: string) => string;
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
    <div className="large-desktop:hidden block divide-y divide-[#2a2a2a]">
      {equipment.slice(startIndex, endIndex).map(item => {
        const status = equipmentStatuses.get(item.id) || {
          status: 'no-data',
          color: 'text-gray-400',
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
                ? 'border-l-4 border-l-[#29E7CD] bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/5'
                : isOutOfRange
                  ? 'hover:bg-red-500/5'
                  : needsSetup
                    ? 'hover:bg-yellow-500/5'
                    : 'hover:bg-[#29E7CD]/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                <span className="text-2xl">{getTypeIcon(item.equipment_type)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 text-base font-semibold text-white">{item.name}</div>
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isOutOfRange
                        ? 'animate-pulse bg-red-500'
                        : needsSetup
                          ? 'bg-yellow-500'
                          : hasNoData
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
                          : hasNoData
                            ? 'text-gray-400'
                            : 'text-green-400'
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
                <div className="text-xl font-bold text-white">
                  {status.temperature ? `${status.temperature.toFixed(1)}°C` : '--'}
                </div>
                <div className="mt-1 text-xs text-gray-400">
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
