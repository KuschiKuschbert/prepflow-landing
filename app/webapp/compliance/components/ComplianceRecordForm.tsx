'use client';

import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { useAutosave } from '@/hooks/useAutosave';
import { useTranslation } from '@/lib/useTranslation';
import React from 'react';
import { ComplianceRecordFormData, ComplianceType } from '../types';
import { getTypeIconEmoji } from '../utils';

interface ComplianceRecordFormProps {
  formData: ComplianceRecordFormData;
  types: ComplianceType[];
  onChange: (data: ComplianceRecordFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ComplianceRecordForm({
  formData,
  types,
  onChange,
  onSubmit,
  onCancel,
}: ComplianceRecordFormProps) {
  const { t } = useTranslation();

  // Autosave integration
  const entityId = formData.id || 'new';
  const canAutosave =
    entityId !== 'new' || Boolean(formData.compliance_type_id && formData.document_name);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'compliance_records',
    entityId: entityId,
    data: formData,
    enabled: canAutosave,
  });

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          {t('compliance.addNewRecord', 'Add New Compliance Record')}
        </h3>
        <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
      </div>
      <form onSubmit={onSubmit} className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('compliance.complianceType', 'Compliance Type')}
          </label>
          <select
            value={formData.compliance_type_id}
            onChange={e => onChange({ ...formData, compliance_type_id: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            required
          >
            <option value="">{t('compliance.selectType', 'Choose a compliance type')}</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>
                {getTypeIconEmoji(type.name)} {type.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('compliance.documentName', 'Document Name')}
          </label>
          <input
            type="text"
            value={formData.document_name}
            onChange={e => onChange({ ...formData, document_name: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="e.g., Annual Pest Control Certificate"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('compliance.issueDate', 'Issue Date')}
          </label>
          <input
            type="date"
            value={formData.issue_date}
            onChange={e => onChange({ ...formData, issue_date: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('compliance.expiryDate', 'Expiry Date')}
          </label>
          <input
            type="date"
            value={formData.expiry_date}
            onChange={e => onChange({ ...formData, expiry_date: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('compliance.documentUrl', 'Document URL')}
          </label>
          <input
            type="url"
            value={formData.document_url}
            onChange={e => onChange({ ...formData, document_url: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Link to digital document"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('compliance.reminderDays', 'Reminder Days Before')}
          </label>
          <input
            type="number"
            value={formData.reminder_days_before}
            onChange={e =>
              onChange({
                ...formData,
                reminder_days_before: parseInt(e.target.value),
              })
            }
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            min="1"
            max="365"
          />
        </div>
        <div className="desktop:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('compliance.notes', 'Notes')}
          </label>
          <textarea
            value={formData.notes}
            onChange={e => onChange({ ...formData, notes: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Additional notes or observations"
            rows={3}
          />
        </div>
        <div className="desktop:col-span-2 flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.reminder_enabled}
              onChange={e => onChange({ ...formData, reminder_enabled: e.target.checked })}
              className="h-4 w-4 rounded border-[var(--border)] bg-[var(--muted)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="text-[var(--foreground-secondary)]">
              {t('compliance.enableReminders', 'Enable automated reminders')}
            </span>
          </label>
        </div>
        <div className="desktop:col-span-2 flex space-x-4">
          <button
            type="submit"
            className="rounded-2xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary-text)] transition-all duration-200 hover:shadow-xl"
          >
            {t('compliance.save', 'Save Record')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl bg-[var(--muted)] px-6 py-3 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]"
          >
            {t('compliance.cancel', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
