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
          className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
              <Icon
                icon={getTypeIcon(type.name)}
                size="md"
                className="text-[var(--primary)]"
                aria-hidden={true}
              />
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                type.is_active
                  ? 'border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 text-[var(--color-success)]'
                  : 'border border-gray-400/20 bg-gray-400/10 text-[var(--foreground-muted)]'
              }`}
            >
              {type.is_active
                ? t('compliance.active', 'Active')
                : t('compliance.inactive', 'Inactive')}
            </span>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-[var(--foreground)]">{type.name}</h3>
          <p className="mb-4 text-[var(--foreground-muted)]">
            {type.description || t('compliance.noDescription', 'No description provided')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--foreground-subtle)]">
              {type.renewal_frequency_days
                ? `${t('compliance.everyDays', 'Every')} ${type.renewal_frequency_days} ${t('compliance.days', 'days')}`
                : t('compliance.noFrequency', 'No renewal frequency set')}
            </span>
            <button className="text-[var(--primary)] transition-colors hover:text-[var(--primary)]/80">
              {t('compliance.edit', 'Edit')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
