'use client';

import { Icon } from '@/components/ui/Icon';
import { Edit, Power, PowerOff, QrCode, Trash2, LucideIcon } from 'lucide-react';
import React from 'react';
import { TemperatureEquipment } from '../types';

interface EquipmentListTableRowProps {
  item: TemperatureEquipment;
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
}

export function EquipmentListTableRow({
  item,
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
}: EquipmentListTableRowProps) {
  return (
    <React.Fragment key={item.id}>
      <tr
        onClick={e => handleRowClick(e, item)}
        className={`group cursor-pointer transition-all duration-200 hover:bg-[#29E7CD]/5 ${
          editingId === item.id ? 'bg-[#29E7CD]/10' : ''
        }`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
              <Icon
                icon={getTypeIcon(item.equipment_type)}
                size="lg"
                className="text-[#29E7CD]"
                aria-hidden={true}
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white transition-colors group-hover:text-[#29E7CD]">
                {item.name}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-gray-300">{getTypeLabel(item.equipment_type)}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-gray-400">{item.location || '—'}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {item.min_temp_celsius !== null && item.max_temp_celsius !== null ? (
            <span className="text-sm font-medium text-[#29E7CD]">
              {item.min_temp_celsius}°C - {item.max_temp_celsius}°C
            </span>
          ) : item.min_temp_celsius !== null ? (
            <span className="text-sm font-medium text-[#29E7CD]">≥{item.min_temp_celsius}°C</span>
          ) : (
            <span className="text-sm text-gray-500">Not set</span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {(() => {
            const lastLogDate = getLastLogDate ? getLastLogDate(item) : null;
            if (!lastLogDate) {
              return <span className="text-sm text-gray-500">Never</span>;
            }
            if (formatDate) {
              const date = new Date(lastLogDate);
              return <span className="text-sm text-gray-300">{formatDate(date)}</span>;
            }
            return <span className="text-sm text-gray-300">{lastLogDate}</span>;
          })()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {(() => {
            const lastLogInfo = getLastLogInfo ? getLastLogInfo(item) : null;
            if (!lastLogInfo) {
              return <span className="text-sm text-gray-500">—</span>;
            }
            return (
              <span className="text-sm font-semibold text-gray-300">
                {lastLogInfo.temperature.toFixed(1)}°C
              </span>
            );
          })()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {(() => {
            const lastLogInfo = getLastLogInfo ? getLastLogInfo(item) : null;
            if (lastLogInfo && lastLogInfo.isInRange !== null) {
              return (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full shadow-lg ${
                      lastLogInfo.isInRange
                        ? 'animate-pulse bg-green-500'
                        : 'animate-pulse bg-red-500'
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold ${
                      lastLogInfo.isInRange ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {lastLogInfo.isInRange ? 'In Range' : 'Out of Range'}
                  </span>
                </div>
              );
            }
            return <span className="text-xs text-gray-500">—</span>;
          })()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => onQuickTempLog(item.id, item.name, item.equipment_type)}
              disabled={quickTempLoading[item.id] || !item.is_active}
              className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-3 py-1.5 text-xs font-semibold text-black transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Quick Log
            </button>
            {onShowQRCode && (
              <button
                onClick={() => onShowQRCode(item)}
                className="group relative rounded-lg border-2 border-[#29E7CD]/60 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-1.5 text-gray-300 transition-all duration-200 hover:border-[#29E7CD] hover:from-[#29E7CD]/20 hover:to-[#D925C7]/20 hover:text-white hover:shadow-lg hover:shadow-[#29E7CD]/20"
                title="Show QR Code"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <Icon icon={QrCode} size="sm" className="relative z-10" aria-hidden={true} />
              </button>
            )}
            <button
              onClick={() => onToggleStatus(item.id, item.is_active)}
              className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] p-1.5 text-gray-400 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white"
              title={item.is_active ? 'Deactivate' : 'Activate'}
            >
              <Icon icon={item.is_active ? PowerOff : Power} size="sm" aria-hidden={true} />
            </button>
            <button
              onClick={() => setEditingId(editingId === item.id ? null : item.id)}
              className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] p-1.5 text-gray-400 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white"
              title="Edit"
            >
              <Icon icon={Edit} size="sm" aria-hidden={true} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="rounded-lg border border-red-500/30 bg-red-500/10 p-1.5 text-red-400 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/20"
              title="Delete"
            >
              <Icon icon={Trash2} size="sm" aria-hidden={true} />
            </button>
          </div>
        </td>
      </tr>
      {editingId === item.id && (
        <tr>
          <td colSpan={8} className="bg-[#2a2a2a]/30 px-6 py-4">
            <form
              onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                const formData = new FormData(e.currentTarget);
                onUpdate(item.id, {
                  name: formData.get('name') as string,
                  equipment_type: formData.get('equipmentType') as string,
                  location: (formData.get('location') as string) || null,
                  min_temp_celsius: formData.get('minTemp')
                    ? parseFloat(formData.get('minTemp') as string)
                    : null,
                  max_temp_celsius: formData.get('maxTemp')
                    ? parseFloat(formData.get('maxTemp') as string)
                    : null,
                });
              }}
              onClick={e => e.stopPropagation()}
              className="space-y-4"
            >
              <div className="desktop:grid-cols-2 large-desktop:grid-cols-5 grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-300">
                    Equipment Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={item.name}
                    className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-300">Type</label>
                  <select
                    name="equipmentType"
                    defaultValue={item.equipment_type}
                    className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                    required
                  >
                    {temperatureTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-300">Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={item.location || ''}
                    className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-300">
                    Min Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="minTemp"
                    defaultValue={item.min_temp_celsius || ''}
                    className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-300">
                    Max Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="maxTemp"
                    defaultValue={item.max_temp_celsius || ''}
                    className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Update Equipment
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-[#3a3a3a] hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}
