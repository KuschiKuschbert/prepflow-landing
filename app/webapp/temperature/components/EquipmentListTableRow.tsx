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
        className={`group cursor-pointer transition-all duration-200 hover:bg-[var(--primary)]/5 ${
          editingId === item.id ? 'bg-[var(--primary)]/10' : ''
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
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-[var(--foreground-secondary)]">{getTypeLabel(item.equipment_type)}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-[var(--foreground-muted)]">{item.location || '—'}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {item.min_temp_celsius !== null && item.max_temp_celsius !== null ? (
            <span className="text-sm font-medium text-[var(--primary)]">
              {item.min_temp_celsius}°C - {item.max_temp_celsius}°C
            </span>
          ) : item.min_temp_celsius !== null ? (
            <span className="text-sm font-medium text-[var(--primary)]">≥{item.min_temp_celsius}°C</span>
          ) : (
            <span className="text-sm text-[var(--foreground-subtle)]">Not set</span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {(() => {
            const lastLogDate = getLastLogDate ? getLastLogDate(item) : null;
            if (!lastLogDate) {
              return <span className="text-sm text-[var(--foreground-subtle)]">Never</span>;
            }
            if (formatDate) {
              const date = new Date(lastLogDate);
              return <span className="text-sm text-[var(--foreground-secondary)]">{formatDate(date)}</span>;
            }
            return <span className="text-sm text-[var(--foreground-secondary)]">{lastLogDate}</span>;
          })()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {(() => {
            const lastLogInfo = getLastLogInfo ? getLastLogInfo(item) : null;
            if (!lastLogInfo) {
              return <span className="text-sm text-[var(--foreground-subtle)]">—</span>;
            }
            return (
              <span className="text-sm font-semibold text-[var(--foreground-secondary)]">
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
                        ? 'animate-pulse bg-[var(--color-success)]'
                        : 'animate-pulse bg-[var(--color-error)]'
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold ${
                      lastLogInfo.isInRange ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
                    }`}
                  >
                    {lastLogInfo.isInRange ? 'In Range' : 'Out of Range'}
                  </span>
                </div>
              );
            }
            return <span className="text-xs text-[var(--foreground-subtle)]">—</span>;
          })()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => onQuickTempLog(item.id, item.name, item.equipment_type)}
              disabled={quickTempLoading[item.id] || !item.is_active}
              className="rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Quick Log
            </button>
            {onShowQRCode && (
              <button
                onClick={() => onShowQRCode(item)}
                className="group relative rounded-lg border-2 border-[var(--primary)]/60 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 p-1.5 text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--primary)] hover:from-[var(--primary)]/20 hover:to-[var(--accent)]/20 hover:text-[var(--button-active-text)] hover:shadow-lg hover:shadow-[var(--primary)]/20"
                title="Show QR Code"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <Icon icon={QrCode} size="sm" className="relative z-10" aria-hidden={true} />
              </button>
            )}
            <button
              onClick={() => onToggleStatus(item.id, item.is_active)}
              className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-1.5 text-[var(--foreground-muted)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 hover:text-[var(--foreground)]"
              title={item.is_active ? 'Deactivate' : 'Activate'}
            >
              <Icon icon={item.is_active ? PowerOff : Power} size="sm" aria-hidden={true} />
            </button>
            <button
              onClick={() => setEditingId(editingId === item.id ? null : item.id)}
              className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-1.5 text-[var(--foreground-muted)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 hover:text-[var(--foreground)]"
              title="Edit"
            >
              <Icon icon={Edit} size="sm" aria-hidden={true} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-1.5 text-[var(--color-error)] transition-all duration-200 hover:border-[var(--color-error)]/50 hover:bg-[var(--color-error)]/20"
              title="Delete"
            >
              <Icon icon={Trash2} size="sm" aria-hidden={true} />
            </button>
          </div>
        </td>
      </tr>
      {editingId === item.id && (
        <tr>
          <td colSpan={8} className="bg-[var(--muted)]/30 px-6 py-4">
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
                  <label className="mb-2 block text-xs font-medium text-[var(--foreground-secondary)]">
                    Equipment Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={item.name}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-[var(--foreground-secondary)]">Type</label>
                  <select
                    name="equipmentType"
                    defaultValue={item.equipment_type}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
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
                  <label className="mb-2 block text-xs font-medium text-[var(--foreground-secondary)]">Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={item.location || ''}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-[var(--foreground-secondary)]">
                    Min Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="minTemp"
                    defaultValue={item.min_temp_celsius || ''}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-[var(--foreground-secondary)]">
                    Max Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="maxTemp"
                    defaultValue={item.max_temp_celsius || ''}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Update Equipment
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:bg-[var(--surface-variant)] hover:text-[var(--foreground)]"
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
