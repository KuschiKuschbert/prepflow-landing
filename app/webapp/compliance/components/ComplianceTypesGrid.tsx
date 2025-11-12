'use client';

import React from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { ComplianceType } from '../types';
import { getTypeIcon } from '../utils';
import { Icon } from '@/components/ui/Icon';

interface ComplianceTypesGridProps {
  types: ComplianceType[];
}

export function ComplianceTypesGrid({ types }: ComplianceTypesGridProps) {
  const { t } = useTranslation();

  return (
    <div className="adaptive-grid">
      {types.map(type => (
        <div
          key={type.id}
          className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
              <Icon icon={getTypeIcon(type.name)} size="md" className="text-[#29E7CD]" aria-hidden="true" />
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                type.is_active
                  ? 'border border-green-400/20 bg-green-400/10 text-green-400'
                  : 'border border-gray-400/20 bg-gray-400/10 text-gray-400'
              }`}
            >
              {type.is_active
                ? t('compliance.active', 'Active')
                : t('compliance.inactive', 'Inactive')}
            </span>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-white">{type.name}</h3>
          <p className="mb-4 text-gray-400">
            {type.description || t('compliance.noDescription', 'No description provided')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {type.renewal_frequency_days
                ? `${t('compliance.everyDays', 'Every')} ${type.renewal_frequency_days} ${t('compliance.days', 'days')}`
                : t('compliance.noFrequency', 'No renewal frequency set')}
            </span>
            <button className="text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80">
              {t('compliance.edit', 'Edit')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
