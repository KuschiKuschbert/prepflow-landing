'use client';

import React from 'react';
import { useTranslation } from '@/lib/useTranslation';
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

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-semibold text-white">
        {t('compliance.addNewType', 'Add New Compliance Type')}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('compliance.typeName', 'Type Name')}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => onChange({ ...formData, name: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., Pest Control, Council Inspection"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('compliance.description', 'Description')}
          </label>
          <textarea
            value={formData.description}
            onChange={e => onChange({ ...formData, description: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="Describe this compliance type"
            rows={3}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('compliance.renewalFrequency', 'Renewal Frequency (days)')}
          </label>
          <input
            type="number"
            value={formData.renewal_frequency_days}
            onChange={e => onChange({ ...formData, renewal_frequency_days: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder="e.g., 365 for annual"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="rounded-2xl bg-[#29E7CD] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
          >
            {t('compliance.save', 'Save Type')}
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
