'use client';

import React from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { ClipboardCheck } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import { ComplianceRecord } from '../types';
import { getTypeIcon, getStatusColor, getStatusIcon, getDaysUntilExpiry } from '../utils';
import { Icon } from '@/components/ui/Icon';

interface ComplianceRecordsListProps {
  records: ComplianceRecord[];
}

export function ComplianceRecordsList({ records }: ComplianceRecordsListProps) {
  const { t } = useTranslation();

  if (records.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
          <Icon
            icon={ClipboardCheck}
            size="xl"
            className="text-[var(--primary)]"
            aria-hidden={true}
          />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-[var(--button-active-text)]">
          {t('compliance.noRecords', 'No Compliance Records')}
        </h3>
        <p className="text-[var(--foreground-muted)]">
          {t('compliance.noRecordsDesc', 'Start tracking your compliance documents and licenses')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map(record => {
        const daysUntilExpiry = getDaysUntilExpiry(record.expiry_date);
        return (
          <div
            key={record.id}
            className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
                  <Icon
                    icon={getTypeIcon(record.compliance_types.name)}
                    size="md"
                    className="text-[var(--primary)]"
                    aria-hidden={true}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">
                    {record.document_name}
                  </h3>
                  <p className="text-[var(--foreground-muted)]">{record.compliance_types.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(record.status)}`}
                >
                  <Icon icon={getStatusIcon(record.status)} size="xs" aria-hidden={true} />
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('_', ' ')}
                </span>
                {daysUntilExpiry !== null && (
                  <span
                    className={`text-sm font-semibold ${
                      daysUntilExpiry < 0
                        ? 'text-[var(--color-error)]'
                        : daysUntilExpiry < 30
                          ? 'text-[var(--color-warning)]'
                          : 'text-[var(--color-success)]'
                    }`}
                  >
                    {daysUntilExpiry < 0
                      ? `${Math.abs(daysUntilExpiry)} days overdue`
                      : daysUntilExpiry === 0
                        ? 'Expires today'
                        : `${daysUntilExpiry} days left`}
                  </span>
                )}
              </div>
            </div>

            <div className="desktop:grid-cols-2 mb-4 grid grid-cols-1 gap-4">
              {record.issue_date && (
                <div>
                  <span className="text-sm text-[var(--foreground-muted)]">
                    {t('compliance.issueDate', 'Issue Date')}:{' '}
                  </span>
                  <span className="text-[var(--foreground)]">
                    {new Date(record.issue_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              {record.expiry_date && (
                <div>
                  <span className="text-sm text-[var(--foreground-muted)]">
                    {t('compliance.expiryDate', 'Expiry Date')}:{' '}
                  </span>
                  <span className="text-[var(--foreground)]">
                    {new Date(record.expiry_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {record.notes && (
              <p className="mb-4 text-[var(--foreground-secondary)]">{record.notes}</p>
            )}

            {(record.document_url || record.photo_url) && (
              <div className="mb-4 flex space-x-4">
                {record.document_url && (
                  <a
                    href={record.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-[var(--primary)] px-4 py-2 font-semibold text-[var(--primary-text)] transition-all duration-200 hover:shadow-lg"
                  >
                    📄 {t('compliance.viewDocument', 'View Document')}
                  </a>
                )}
                {record.photo_url && (
                  <OptimizedImage
                    src={record.photo_url}
                    alt="Compliance document"
                    width={128}
                    height={128}
                    className="h-32 w-32 rounded-2xl border border-[var(--border)] object-cover"
                  />
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    record.reminder_enabled ? 'bg-[var(--color-success)]' : 'bg-gray-400'
                  }`}
                ></span>
                <span className="text-sm text-[var(--foreground-muted)]">
                  {record.reminder_enabled
                    ? t('compliance.remindersEnabled', 'Reminders enabled')
                    : t('compliance.remindersDisabled', 'Reminders disabled')}
                </span>
              </div>
              <div className="flex space-x-4">
                <button className="rounded-xl bg-[var(--muted)] px-4 py-2 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]">
                  📷 {t('compliance.addPhoto', 'Add Photo')}
                </button>
                <button className="rounded-xl bg-[var(--muted)] px-4 py-2 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]">
                  ✏️ {t('compliance.edit', 'Edit')}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
