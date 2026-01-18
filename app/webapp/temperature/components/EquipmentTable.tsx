'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertTriangle, Settings } from 'lucide-react';
import React from 'react';
import { TemperatureEquipment } from '../types';
import { EquipmentTablePagination } from './EquipmentTablePagination';
import { EquipmentTableMobileCards } from './EquipmentTableMobileCards';
import { getTypeIconComponent, getTypeLabel } from '../utils/temperatureUtils';

interface EquipmentTableProps {
  equipment: TemperatureEquipment[];
  equipmentStatuses: Map<string, { status: string; color: string; temperature?: number }>;
  equipmentLogs: Map<string, unknown[]>;
  timeFilter: string;
  selectedEquipmentId: string | null;
  onSelect: (equipment: TemperatureEquipment) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function EquipmentTable({
  equipment,
  equipmentStatuses,
  equipmentLogs,
  timeFilter: _timeFilter,
  selectedEquipmentId,
  onSelect,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: EquipmentTableProps) {
  const getTypeIcon = (type: string) => getTypeIconComponent(type);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
        {/* Desktop Table */}
        <div className="large-desktop:block hidden overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20">
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
                  Equipment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
                  Temperature
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
                  Readings
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
                  Range
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--muted)] bg-[var(--surface)]">
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
                  <tr
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className={`group cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-l-4 border-l-[#29E7CD] bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/5'
                        : isOutOfRange
                          ? 'hover:bg-[var(--color-error)]/5'
                          : needsSetup
                            ? 'hover:bg-[var(--color-warning)]/5'
                            : 'hover:bg-[var(--primary)]/5'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
                          <Icon
                            icon={getTypeIcon(item.equipment_type)}
                            size="lg"
                            className="text-[var(--primary)]"
                            aria-hidden={true}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
                            {item.name}
                          </div>
                          {item.location && (
                            <div className="truncate text-xs text-[var(--foreground-subtle)]">
                              {item.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[var(--foreground-secondary)]">
                        {getTypeLabel(item.equipment_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full shadow-lg ${
                            isOutOfRange
                              ? 'animate-pulse bg-[var(--color-error)]'
                              : needsSetup
                                ? 'bg-[var(--color-warning)]'
                                : hasNoData
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
                        {isOutOfRange && (
                          <Icon
                            icon={AlertTriangle}
                            size="xs"
                            className="text-[var(--color-error)]"
                            aria-hidden={true}
                          />
                        )}
                        {needsSetup && (
                          <Icon
                            icon={Settings}
                            size="xs"
                            className="text-[var(--color-warning)]"
                            aria-hidden={true}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-[var(--foreground)]">
                        {status.temperature ? `${status.temperature.toFixed(1)}°C` : '--'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[var(--foreground-muted)]">
                        {logs.length} reading{logs.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.min_temp_celsius !== null && item.max_temp_celsius !== null ? (
                        <span className="text-sm text-[var(--foreground-secondary)]">
                          {item.min_temp_celsius}°C - {item.max_temp_celsius}°C
                        </span>
                      ) : item.min_temp_celsius !== null ? (
                        <span className="text-sm text-[var(--foreground-secondary)]">
                          ≥{item.min_temp_celsius}°C
                        </span>
                      ) : (
                        <span className="text-sm text-[var(--foreground-subtle)]">Not set</span>
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
