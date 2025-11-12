'use client';

import React from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { ComplianceRecordFormData, ComplianceType } from '../types';
import { getTypeIconEmoji } from '../utils';
import { useAutosave } from '@/hooks/useAutosave';
import { AutosaveStatus } from '@/components/ui/AutosaveStatus';

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
  const entityId = (formData as any).id || 'new';
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
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          {t('compliance.addNewRecord', 'Add New Compliance Record')}
        </h3>
        <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
      </div>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('compliance.complianceType', 'Compliance Type')}
          </label>
          <select
            value={formData.compliance_type_id}
            onChange={e => onChange({ ...formData, compliance_type_id: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
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
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('compliance.documentName', 'Document Name')}
          </label>
          <input
            type="text"
            value={formData.document_name}
            onChange={e => onChange({ ...formData, document_name: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., Annual Pest Control Certificate"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('compliance.issueDate', 'Issue Date')}
          </label>
          <input
            type="date"
            value={formData.issue_date}
            onChange={e => onChange({ ...formData, issue_date: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('compliance.expiryDate', 'Expiry Date')}
          </label>
          <input
            type="date"
            value={formData.expiry_date}
            onChange={e => onChange({ ...formData, expiry_date: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('compliance.documentUrl', 'Document URL')}
          </label>
          <input
            type="url"
            value={formData.document_url}
            onChange={e => onChange({ ...formData, document_url: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="Link to digital document"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
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
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            min="1"
            max="365"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('compliance.notes', 'Notes')}
          </label>
          <textarea
            value={formData.notes}
            onChange={e => onChange({ ...formData, notes: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="Additional notes or observations"
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-4 md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.reminder_enabled}
              onChange={e => onChange({ ...formData, reminder_enabled: e.target.checked })}
              className="h-4 w-4 rounded border-[#2a2a2a] bg-[#2a2a2a] text-[#29E7CD] focus:ring-[#29E7CD]"
            />
            <span className="text-gray-300">
              {t('compliance.enableReminders', 'Enable automated reminders')}
            </span>
          </label>
        </div>
        <div className="flex space-x-4 md:col-span-2">
          <button
            type="submit"
            className="rounded-2xl bg-[#29E7CD] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
          >
            {t('compliance.save', 'Save Record')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
          >
            {t('compliance.cancel', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
