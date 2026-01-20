'use client';

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { ClipboardCheck } from 'lucide-react';
import { ComplianceRecord } from '../types';
import { ComplianceRecordCard } from './ComplianceRecordCard';

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
      {records.map(record => (
        <ComplianceRecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}
