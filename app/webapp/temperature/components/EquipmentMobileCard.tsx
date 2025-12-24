'use client';
import { Icon } from '@/components/ui/Icon';
import { Edit, Power, PowerOff, QrCode, Trash2, LucideIcon, MapPin } from 'lucide-react';
import React, { memo } from 'react';
import { TemperatureEquipment } from '../types';
import { EquipmentMobileCardEditForm } from './EquipmentMobileCardEditForm';

export interface EquipmentMobileCardProps {
  item: TemperatureEquipment;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  onQuickTempLog: (id: string, name: string, type: string) => Promise<void>;
  onToggleStatus: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TemperatureEquipment>) => void;
  onEquipmentClick?: (equipment: TemperatureEquipment) => void;
  onShowQRCode?: (equipment: TemperatureEquipment) => void;
  getTypeIcon: (type: string) => LucideIcon;
  getTypeLabel: (type: string) => string;
  getLastLogInfo?: (equipment: TemperatureEquipment) => {
    date: string;
    temperature: number;
    isInRange: boolean | null;
  } | null;
  formatDate?: (date: Date) => string;
}

function EquipmentMobileCardComponent({
  item,
  editingId,
  setEditingId,
  temperatureTypes,
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
}: EquipmentMobileCardProps) {
  return (
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
      className={`group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg transition-all duration-300 ${
        editingId === item.id
          ? 'border-[var(--primary)] bg-[var(--primary)]/10'
          : onEquipmentClick
            ? 'cursor-pointer hover:border-[var(--primary)]/30 hover:shadow-2xl'
            : 'hover:border-[var(--primary)]/30 hover:shadow-2xl'
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
          <div className="mb-2 text-base font-semibold text-[var(--foreground)]">{item.name}</div>
          <div className="mb-2 text-sm text-[var(--foreground-muted)]">
            {getTypeLabel(item.equipment_type)}
          </div>
          {item.location && (
            <div className="mb-2 flex items-center gap-1 text-xs text-[var(--foreground-subtle)]">
              <Icon
                icon={MapPin}
                size="xs"
                className="text-[var(--foreground-subtle)]"
                aria-hidden={true}
              />
              <span>{item.location}</span>
            </div>
          )}
          <div className="mb-2 text-sm font-medium text-[var(--primary)]">
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
                  <div className="text-xs text-[var(--foreground-muted)]">
                    Last log: {formattedDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--foreground-secondary)]">
                      {lastLogInfo.temperature.toFixed(1)}°C
                    </span>
                    {lastLogInfo.isInRange !== null && (
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${
                            lastLogInfo.isInRange
                              ? 'bg-[var(--color-success)]'
                              : 'bg-[var(--color-error)]'
                          }`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            lastLogInfo.isInRange
                              ? 'text-[var(--color-success)]'
                              : 'text-[var(--color-error)]'
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
            return (
              <div className="mb-2 text-xs text-[var(--foreground-subtle)]">Last log: Never</div>
            );
          })()}
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${item.is_active ? 'animate-pulse bg-[var(--color-success)]' : 'bg-gray-500'}`}
            />
            <span
              className={`text-xs font-semibold ${item.is_active ? 'text-[var(--color-success)]' : 'text-[var(--foreground-muted)]'}`}
            >
              {item.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <EquipmentMobileCardEditForm
          item={item}
          editingId={editingId}
          setEditingId={setEditingId}
          temperatureTypes={temperatureTypes}
          onUpdate={onUpdate}
        />
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onQuickTempLog(item.id, item.name, item.equipment_type)}
            disabled={!item.is_active}
            className="rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Quick Log
          </button>
          <div className="flex gap-1">
            {onShowQRCode && (
              <button
                onClick={() => onShowQRCode(item)}
                className="group relative rounded-lg border-2 border-[var(--primary)]/60 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 p-1.5 text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--primary)] hover:from-[var(--primary)]/20 hover:to-[var(--accent)]/20 hover:text-[var(--button-active-text)] hover:shadow-[var(--primary)]/20 hover:shadow-lg"
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
        </div>
      </div>
    </div>
  );
}

// Memoize card component to prevent unnecessary re-renders
export const EquipmentMobileCard = memo(EquipmentMobileCardComponent, (prevProps, nextProps) => {
  // Compare item properties that affect rendering
  const itemChanged =
    prevProps.item.id !== nextProps.item.id ||
    prevProps.item.name !== nextProps.item.name ||
    prevProps.item.equipment_type !== nextProps.item.equipment_type ||
    prevProps.item.location !== nextProps.item.location ||
    prevProps.item.min_temp_celsius !== nextProps.item.min_temp_celsius ||
    prevProps.item.max_temp_celsius !== nextProps.item.max_temp_celsius ||
    prevProps.item.is_active !== nextProps.item.is_active;

  // Compare editing state
  const editingStateChanged =
    (prevProps.editingId === prevProps.item.id) !== (nextProps.editingId === nextProps.item.id);

  // If item or editing state changed, allow re-render
  if (itemChanged || editingStateChanged) {
    return false; // Props changed, allow re-render
  }

  // Otherwise, prevent re-render (props are equal)
  return true; // Props are equal, prevent re-render
});
