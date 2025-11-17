'use client';

import { Icon } from '@/components/ui/Icon';
import { Edit, Power, PowerOff, QrCode, Trash2 } from 'lucide-react';
import React from 'react';
import { TemperatureEquipment } from '../types';

interface EquipmentListTableMobileCardsProps {
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
  getTypeIcon: (type: string) => string;
  getTypeLabel: (type: string) => string;
  getLastLogInfo?: (equipment: TemperatureEquipment) => {
    date: string;
    temperature: number;
    isInRange: boolean | null;
  } | null;
  formatDate?: (date: Date) => string;
}

export function EquipmentListTableMobileCards({
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
  getLastLogInfo,
  formatDate,
}: EquipmentListTableMobileCardsProps) {
  return (
    <div className="large-desktop:hidden block space-y-4">
      {paginatedEquipment.map(item => (
        <div
          key={item.id}
          onClick={e => {
            if (
              !(e.target as HTMLElement).closest('button') &&
              editingId !== item.id &&
              onEquipmentClick
            ) {
              onEquipmentClick(item);
            }
          }}
          className={`group relative overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-300 ${
            editingId === item.id
              ? 'border-[#29E7CD] bg-[#29E7CD]/10'
              : onEquipmentClick
                ? 'cursor-pointer hover:border-[#29E7CD]/30 hover:shadow-2xl'
                : 'hover:border-[#29E7CD]/30 hover:shadow-2xl'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
              <span className="text-2xl">{getTypeIcon(item.equipment_type)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 text-base font-semibold text-white">{item.name}</div>
              <div className="mb-2 text-sm text-gray-400">{getTypeLabel(item.equipment_type)}</div>
              {item.location && (
                <div className="mb-2 text-xs text-gray-500">📍 {item.location}</div>
              )}
              <div className="mb-2 text-sm font-medium text-[#29E7CD]">
                {item.min_temp_celsius !== null && item.max_temp_celsius !== null
                  ? `${item.min_temp_celsius}°C - ${item.max_temp_celsius}°C`
                  : item.min_temp_celsius !== null
                    ? `≥${item.min_temp_celsius}°C`
                    : 'Not set'}
              </div>
              {(() => {
                const lastLogInfo = getLastLogInfo ? getLastLogInfo(item) : null;
                if (lastLogInfo) {
                  const date = new Date(lastLogInfo.date);
                  const formattedDate = formatDate ? formatDate(date) : lastLogInfo.date;
                  return (
                    <div className="mb-2 space-y-1">
                      <div className="text-xs text-gray-400">Last log: {formattedDate}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-300">
                          {lastLogInfo.temperature.toFixed(1)}°C
                        </span>
                        {lastLogInfo.isInRange !== null && (
                          <div className="flex items-center gap-1">
                            <div
                              className={`h-1.5 w-1.5 rounded-full ${
                                lastLogInfo.isInRange ? 'bg-green-500' : 'bg-red-500'
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
                        )}
                      </div>
                    </div>
                  );
                }
                return <div className="mb-2 text-xs text-gray-500">Last log: Never</div>;
              })()}
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${item.is_active ? 'animate-pulse bg-green-500' : 'bg-gray-500'}`}
                />
                <span
                  className={`text-xs font-semibold ${item.is_active ? 'text-green-400' : 'text-gray-400'}`}
                >
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            {editingId === item.id && (
              <div className="mt-4 rounded-2xl border-t border-[#2a2a2a] bg-[#2a2a2a]/30 pt-4">
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
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-300">
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
                      <label className="mb-1 block text-xs font-medium text-gray-300">Type</label>
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
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-300">
                          Min Temp
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
                        <label className="mb-1 block text-xs font-medium text-gray-300">
                          Max Temp
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
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onQuickTempLog(item.id, item.name, item.equipment_type)}
                disabled={quickTempLoading[item.id] || !item.is_active}
                className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-3 py-1.5 text-xs font-semibold text-black transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Quick Log
              </button>
              <div className="flex gap-1">
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
