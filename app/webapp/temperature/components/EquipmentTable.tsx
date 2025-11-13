'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertTriangle, Settings } from 'lucide-react';
import React from 'react';
import { TemperatureEquipment } from '../types';

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
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a] bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Equipment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Temperature
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Readings
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Range
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
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
                        ? 'bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/5 border-l-4 border-l-[#29E7CD]'
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
                          <div className="text-sm font-semibold text-white group-hover:text-[#29E7CD] transition-colors">
                            {item.name}
                          </div>
                          {item.location && (
                            <div className="text-xs text-gray-500 truncate">{item.location}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">{getTypeLabel(item.equipment_type)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full shadow-lg ${
                            isOutOfRange
                              ? 'bg-red-500 animate-pulse'
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
                          <Icon icon={AlertTriangle} size="xs" className="text-red-400" aria-hidden={true} />
                        )}
                        {needsSetup && (
                          <Icon icon={Settings} size="xs" className="text-yellow-400" aria-hidden={true} />
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
        <div className="block md:hidden divide-y divide-[#2a2a2a]">
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
                    ? 'bg-gradient-to-r from-[#29E7CD]/10 to-[#D925C7]/5 border-l-4 border-l-[#29E7CD]'
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
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 text-base font-semibold text-white">{item.name}</div>
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          isOutOfRange
                            ? 'bg-red-500 animate-pulse'
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
                      {logs.length} reading{logs.length !== 1 ? 's' : ''} • {getTypeLabel(item.equipment_type)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-6 py-4">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {endIndex} of {totalItems} equipment
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#2a2a2a] disabled:hover:bg-[#2a2a2a]"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, current page, and pages around current
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis if there's a gap
                  const showEllipsisBefore = index > 0 && array[index - 1] < page - 1;
                  return (
                    <React.Fragment key={`equipment-table-page-${page}`}>
                      {showEllipsisBefore && (
                        <span className="px-2 text-sm text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => onPageChange(page)}
                        className={`min-w-[40px] rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black'
                            : 'border border-[#2a2a2a] bg-[#2a2a2a] text-gray-300 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#2a2a2a] disabled:hover:bg-[#2a2a2a]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
