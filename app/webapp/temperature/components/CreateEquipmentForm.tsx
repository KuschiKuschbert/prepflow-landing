'use client';

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { useAutosave } from '@/hooks/useAutosave';
import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { getDefaultTemperatureRange } from '../utils/getDefaultTemperatureRange';
import { Plus } from 'lucide-react';

interface CreateEquipmentFormProps {
  show: boolean;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  newEquipment: {
    name: string;
    equipmentType: string;
    location: string;
    minTemp: number | null;
    maxTemp: number | null;
  };
  setNewEquipment: (v: {
    name: string;
    equipmentType: string;
    location: string;
    minTemp: number | null;
    maxTemp: number | null;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function CreateEquipmentForm({
  show,
  temperatureTypes,
  newEquipment,
  setNewEquipment,
  onSubmit,
  onCancel,
}: CreateEquipmentFormProps) {
  const { t } = useTranslation();

  // Autosave integration
  const entityId = 'new';
  const canAutosave = Boolean(newEquipment.name && newEquipment.equipmentType);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'temperature_equipment',
    entityId: entityId,
    data: newEquipment,
    enabled: canAutosave && show,
  });

  if (!show) return null;

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
          <Icon icon={Plus} size="md" className="text-[var(--foreground)]" aria-hidden={true} />
          Add New Equipment
        </h3>
        <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
              Equipment Name
            </label>
            <input
              type="text"
              value={newEquipment.name}
              onChange={e => setNewEquipment({ ...newEquipment, name: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="e.g., Main Fridge, Freezer 1"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
              Equipment Type
            </label>
            <select
              value={newEquipment.equipmentType}
              onChange={e => {
                const selectedType = e.target.value;
                // Auto-set temperature range based on equipment type
                const defaultRange = getDefaultTemperatureRange(selectedType, newEquipment.name);
                setNewEquipment({
                  ...newEquipment,
                  equipmentType: selectedType,
                  minTemp: defaultRange.minTemp,
                  maxTemp: defaultRange.maxTemp,
                });
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">Select type...</option>
              {temperatureTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            {newEquipment.equipmentType && (
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Temperature range set automatically based on Queensland Food Safety Standards
              </p>
            )}
          </div>
        </div>
        <div className="desktop:grid-cols-3 grid grid-cols-1 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
              Location (Optional)
            </label>
            <input
              type="text"
              value={newEquipment.location}
              onChange={e => setNewEquipment({ ...newEquipment, location: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="e.g., Kitchen, Storage Room"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
              Min Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={newEquipment.minTemp || ''}
              onChange={e =>
                setNewEquipment({
                  ...newEquipment,
                  minTemp: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
              Max Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={newEquipment.maxTemp || ''}
              onChange={e =>
                setNewEquipment({
                  ...newEquipment,
                  maxTemp: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Optional"
            />
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
          >
            {t('temperature.addEquipment', 'Add Equipment')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-[var(--muted)] px-6 py-3 font-semibold text-[var(--foreground-secondary)] transition-all duration-200 hover:bg-[var(--surface-variant)]"
          >
            {t('common.cancel', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
