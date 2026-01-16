'use client';

import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { useAutosave } from '@/hooks/useAutosave';
import { useTranslation } from '@/lib/useTranslation';
import React from 'react';
import { ComplianceTypeFormData } from '../types';

interface ComplianceTypeFormProps {
  formData: ComplianceTypeFormData;
  onChange: (data: ComplianceTypeFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ComplianceTypeForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
}: ComplianceTypeFormProps) {
  const { t } = useTranslation();

  // Autosave integration
  const entityId = (formData as any).id || 'new';
  const canAutosave = entityId !== 'new' || Boolean(formData.name);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'compliance_types',
    entityId: entityId,
    data: formData,
    enabled: canAutosave,
  });

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          {t('compliance.addNewType', 'Add New Compliance Type')}
        </h3>
        <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('compliance.typeName', 'Type Name')}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => onChange({ ...formData, name: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="e.g., Pest Control, Council Inspection"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('compliance.description', 'Description')}
          </label>
          <textarea
            value={formData.description}
            onChange={e => onChange({ ...formData, description: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Describe this compliance type"
            rows={3}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('compliance.renewalFrequency', 'Renewal Frequency (days)')}
          </label>
          <input
            type="number"
            value={formData.renewal_frequency_days}
            onChange={e => onChange({ ...formData, renewal_frequency_days: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="e.g., 365 for annual"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="rounded-2xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary-text)] transition-all duration-200 hover:shadow-xl"
          >
            {t('compliance.save', 'Save Type')}
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
