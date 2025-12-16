'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { TemperatureEquipment } from '../types';
import { EquipmentListTableRow } from './EquipmentListTableRow';

interface EquipmentListTableDesktopProps {
  paginatedEquipment: TemperatureEquipment[];
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  quickTempLoading: Record<string, boolean>;
  onQuickTempLog: (id: string, name: string, type: string) => Promise<void>;
  onToggleStatus: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TemperatureEquipment>) => void;
  onEquipmentClick?: (equipment: TemperatureEquipment) => void;
  onShowQRCode?: (equipment: TemperatureEquipment) => void;
  getTypeIcon: (type: string) => LucideIcon;
  getTypeLabel: (type: string) => string;
  getLastLogDate?: (equipment: TemperatureEquipment) => string | null;
  getLastLogInfo?: (equipment: TemperatureEquipment) => {
    date: string;
    temperature: number;
    isInRange: boolean | null;
  } | null;
  formatDate?: (date: Date) => string;
  handleRowClick: (e: React.MouseEvent, item: TemperatureEquipment) => void;
  handleSort: (field: 'name' | 'type' | 'location' | 'lastLogDate' | 'status') => void;
  getSortIcon: (field: 'name' | 'type' | 'location' | 'lastLogDate' | 'status') => React.ReactNode;
}

export function EquipmentListTableDesktop({
  paginatedEquipment,
  editingId,
  setEditingId,
  temperatureTypes,
  quickTempLoading,
  onQuickTempLog,
  onToggleStatus,
  onDelete,
  onUpdate,
  onEquipmentClick,
  onShowQRCode,
  getTypeIcon,
  getTypeLabel,
  getLastLogDate,
  getLastLogInfo,
  formatDate,
  handleRowClick,
  handleSort,
  getSortIcon,
}: EquipmentListTableDesktopProps) {
  return (
    <div className="large-desktop:block hidden overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20">
              <th className="px-6 py-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase transition-colors hover:text-[var(--foreground)]"
                >
                  Equipment
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="px-6 py-4">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center gap-2 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase transition-colors hover:text-[var(--foreground)]"
                >
                  Type
                  {getSortIcon('type')}
                </button>
              </th>
              <th className="px-6 py-4">
                <button
                  onClick={() => handleSort('location')}
                  className="flex items-center gap-2 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase transition-colors hover:text-[var(--foreground)]"
                >
                  Location
                  {getSortIcon('location')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
                Temperature Range
              </th>
              <th className="px-6 py-4">
                <button
                  onClick={() => handleSort('lastLogDate')}
                  className="flex items-center gap-2 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase transition-colors hover:text-[var(--foreground)]"
                >
                  Last Log Date
                  {getSortIcon('lastLogDate')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
                Last Temperature
              </th>
              <th className="px-6 py-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase transition-colors hover:text-[var(--foreground)]"
                >
                  Status
                  {getSortIcon('status')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--muted)]">
            {paginatedEquipment.map(item => (
              <EquipmentListTableRow
                key={item.id}
                item={item}
                editingId={editingId}
                setEditingId={setEditingId}
                temperatureTypes={temperatureTypes}
                quickTempLoading={quickTempLoading}
                onQuickTempLog={onQuickTempLog}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onEquipmentClick={onEquipmentClick}
                onShowQRCode={onShowQRCode}
                getTypeIcon={getTypeIcon}
                getTypeLabel={getTypeLabel}
                getLastLogDate={getLastLogDate}
                getLastLogInfo={getLastLogInfo}
                formatDate={formatDate}
                handleRowClick={handleRowClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
