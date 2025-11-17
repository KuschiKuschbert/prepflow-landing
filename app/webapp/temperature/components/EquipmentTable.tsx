'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertTriangle, Settings } from 'lucide-react';
import React from 'react';
import { TemperatureEquipment } from '../types';
import { EquipmentTablePagination } from './EquipmentTablePagination';
import { EquipmentTableMobileCards } from './EquipmentTableMobileCards';

interface EquipmentTableProps {
  equipment: TemperatureEquipment[];
  equipmentStatuses: Map<string, { status: string; color: string; temperature?: number }>;
  equipmentLogs: Map<string, any[]>;
  timeFilter: string;
  selectedEquipmentId: string | null;
  onSelect: (equipment: TemperatureEquipment) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const temperatureTypes = [
  { value: 'fridge', label: 'Fridge', icon: '🧊' },
  { value: 'freezer', label: 'Freezer', icon: '❄️' },
  { value: 'food_cooking', label: 'Food Cooking', icon: '🔥' },
  { value: 'food_hot_holding', label: 'Food Hot Holding', icon: '🍲' },
  { value: 'food_cold_holding', label: 'Food Cold Holding', icon: '🥗' },
  { value: 'storage', label: 'Storage', icon: '📦' },
];

export function EquipmentTable({
  equipment,
  equipmentStatuses,
  equipmentLogs,
  timeFilter,
  selectedEquipmentId,
  onSelect,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: EquipmentTableProps) {
  const getTypeIcon = (type: string) => temperatureTypes.find(t => t.value === type)?.icon || '🌡️';
  const getTypeLabel = (type: string) =>
    temperatureTypes.find(t => t.value === type)?.label || type;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
        {/* Desktop Table */}
        <div className="large-desktop:block hidden overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a] bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Equipment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Temperature
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Readings
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Range
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
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
                  <tr
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className={`group cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-l-4 border-l-[#29E7CD] bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/5'
                        : isOutOfRange
                          ? 'hover:bg-red-500/5'
                          : needsSetup
                            ? 'hover:bg-yellow-500/5'
                            : 'hover:bg-[#29E7CD]/5'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                          <span className="text-xl">{getTypeIcon(item.equipment_type)}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white transition-colors group-hover:text-[#29E7CD]">
                            {item.name}
                          </div>
                          {item.location && (
                            <div className="truncate text-xs text-gray-500">{item.location}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">
                        {getTypeLabel(item.equipment_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full shadow-lg ${
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
                        {isOutOfRange && (
                          <Icon
                            icon={AlertTriangle}
                            size="xs"
                            className="text-red-400"
                            aria-hidden={true}
                          />
                        )}
                        {needsSetup && (
                          <Icon
                            icon={Settings}
                            size="xs"
                            className="text-yellow-400"
                            aria-hidden={true}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-white">
                        {status.temperature ? `${status.temperature.toFixed(1)}°C` : '--'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">
                        {logs.length} reading{logs.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.min_temp_celsius !== null && item.max_temp_celsius !== null ? (
                        <span className="text-sm text-gray-300">
                          {item.min_temp_celsius}°C - {item.max_temp_celsius}°C
                        </span>
                      ) : item.min_temp_celsius !== null ? (
                        <span className="text-sm text-gray-300">≥{item.min_temp_celsius}°C</span>
                      ) : (
                        <span className="text-sm text-gray-500">Not set</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <EquipmentTableMobileCards
          equipment={equipment}
          equipmentStatuses={equipmentStatuses}
          equipmentLogs={equipmentLogs}
          selectedEquipmentId={selectedEquipmentId}
          onSelect={onSelect}
          startIndex={startIndex}
          endIndex={endIndex}
          getTypeIcon={getTypeIcon}
          getTypeLabel={getTypeLabel}
        />
      </div>

      {/* Pagination */}
      <EquipmentTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
        onPageChange={onPageChange}
      />
    </div>
  );
}
