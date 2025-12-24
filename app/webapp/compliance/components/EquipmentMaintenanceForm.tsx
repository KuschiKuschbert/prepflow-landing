'use client';

import React from 'react';
import { useAutosave } from '@/hooks/useAutosave';
import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { useNotification } from '@/contexts/NotificationContext';
import { useStaff } from '@/hooks/useStaff';

export interface EquipmentMaintenanceFormData {
  equipment_name: string;
  equipment_type: string;
  maintenance_date: string;
  maintenance_type: string;
  service_provider: string;
  description: string;
  cost: string;
  next_maintenance_date: string;
  is_critical: boolean;
  performed_by: string;
  notes: string;
  photo_url: string;
}

interface EquipmentMaintenanceFormProps {
  formData: EquipmentMaintenanceFormData;
  onChange: (data: EquipmentMaintenanceFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading?: boolean;
}

const EQUIPMENT_TYPES = [
  { value: 'fridge', label: 'Fridge' },
  { value: 'freezer', label: 'Freezer' },
  { value: 'oven', label: 'Oven' },
  { value: 'dishwasher', label: 'Dishwasher' },
  { value: 'fryer', label: 'Fryer' },
  { value: 'grill', label: 'Grill' },
  { value: 'mixer', label: 'Mixer' },
  { value: 'other', label: 'Other' },
];

const MAINTENANCE_TYPES = [
  { value: 'scheduled', label: 'Scheduled Maintenance' },
  { value: 'repair', label: 'Repair' },
  { value: 'calibration', label: 'Calibration' },
  { value: 'inspection', label: 'Inspection' },
];

export function EquipmentMaintenanceForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  loading = false,
}: EquipmentMaintenanceFormProps) {
  const { showError } = useNotification();
  const { staff, loading: staffLoading } = useStaff();

  // Autosave integration
  const entityId = (formData as any).id || 'new';
  const canAutosave =
    entityId !== 'new' ||
    Boolean(
      formData.equipment_name &&
      formData.maintenance_date &&
      formData.maintenance_type &&
      formData.description,
    );

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'equipment_maintenance',
    entityId: entityId,
    data: formData,
    enabled: canAutosave,
  });

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          Add Equipment Maintenance Record
        </h3>
        <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
      </div>
      <form onSubmit={onSubmit} className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Equipment Name <span className="text-[var(--color-error)]">*</span>
          </label>
          <input
            type="text"
            value={formData.equipment_name}
            onChange={e => onChange({ ...formData, equipment_name: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="e.g., Main Fridge"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Equipment Type
          </label>
          <select
            value={formData.equipment_type}
            onChange={e => onChange({ ...formData, equipment_type: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="">Select type...</option>
            {EQUIPMENT_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Maintenance Date <span className="text-[var(--color-error)]">*</span>
          </label>
          <input
            type="date"
            value={formData.maintenance_date}
            onChange={e => onChange({ ...formData, maintenance_date: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Maintenance Type <span className="text-[var(--color-error)]">*</span>
          </label>
          <select
            value={formData.maintenance_type}
            onChange={e => onChange({ ...formData, maintenance_type: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            required
          >
            <option value="">Select type...</option>
            {MAINTENANCE_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Service Provider
          </label>
          <input
            type="text"
            value={formData.service_provider}
            onChange={e => onChange({ ...formData, service_provider: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="e.g., ABC Maintenance Co"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Cost (AUD)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={e => onChange({ ...formData, cost: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="e.g., 150.00"
          />
        </div>
        <div className="desktop:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Description <span className="text-[var(--color-error)]">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={e => onChange({ ...formData, description: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Describe the maintenance work performed..."
            rows={3}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Next Maintenance Date
          </label>
          <input
            type="date"
            value={formData.next_maintenance_date}
            onChange={e => onChange({ ...formData, next_maintenance_date: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Performed By
          </label>
          <select
            value={formData.performed_by || ''}
            onChange={e => {
              const selectedStaff = staff.find(s => s.id === e.target.value);
              onChange({
                ...formData,
                performed_by: selectedStaff ? selectedStaff.full_name : e.target.value,
              });
            }}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            disabled={staffLoading}
          >
            <option value="">{staffLoading ? 'Loading staff...' : 'Select staff member'}</option>
            {staff.map(member => (
              <option key={member.id} value={member.id}>
                {member.full_name}
                {member.role ? ` (${member.role})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="desktop:col-span-2 flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_critical"
            checked={formData.is_critical}
            onChange={e => onChange({ ...formData, is_critical: e.target.checked })}
            className="h-4 w-4 rounded border-[var(--border)] bg-[var(--muted)] text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <label
            htmlFor="is_critical"
            className="text-sm font-medium text-[var(--foreground-secondary)]"
          >
            Critical for food safety
          </label>
        </div>
        <div className="desktop:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={e => onChange({ ...formData, notes: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Additional notes or observations"
            rows={2}
          />
        </div>
        <div className="desktop:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Photo URL (Optional)
          </label>
          <input
            type="url"
            value={formData.photo_url}
            onChange={e => onChange({ ...formData, photo_url: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="https://example.com/photo.jpg"
          />
        </div>
        <div className="desktop:col-span-2 flex space-x-4">
          <button
            type="submit"
            disabled={loading || status === 'saving'}
            className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading || status === 'saving' ? 'Saving...' : 'Save Maintenance Record'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl bg-[var(--muted)] px-6 py-3 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
