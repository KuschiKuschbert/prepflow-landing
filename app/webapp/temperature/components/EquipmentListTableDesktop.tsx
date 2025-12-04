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
    <div className="large-desktop:block hidden overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2a2a] bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
              <th className="px-6 py-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase transition-colors hover:text-white"
                >
                  Equipment
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="px-6 py-4">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center gap-2 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase transition-colors hover:text-white"
                >
                  Type
                  {getSortIcon('type')}
                </button>
              </th>
              <th className="px-6 py-4">
                <button
                  onClick={() => handleSort('location')}
                  className="flex items-center gap-2 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase transition-colors hover:text-white"
                >
                  Location
                  {getSortIcon('location')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Temperature Range
              </th>
              <th className="px-6 py-4">
                <button
                  onClick={() => handleSort('lastLogDate')}
                  className="flex items-center gap-2 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase transition-colors hover:text-white"
                >
                  Last Log Date
                  {getSortIcon('lastLogDate')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Last Temperature
              </th>
              <th className="px-6 py-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase transition-colors hover:text-white"
                >
                  Status
                  {getSortIcon('status')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
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
