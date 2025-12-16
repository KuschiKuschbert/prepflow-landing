/**
 * Filter controls for compliance records.
 */

import { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { getTypeIconEmoji } from '../utils';
import type { ComplianceType, ComplianceRecord } from '../types';
import { PrintButton } from '@/components/ui/PrintButton';
import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';
import { printComplianceReport } from '../utils/printComplianceReport';
import {
  exportComplianceRecordsToCSV,
  exportComplianceRecordsToHTML,
  exportComplianceRecordsToPDF,
} from '../utils/exportComplianceRecords';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Icon } from '@/components/ui/Icon';
import { Plus, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ComplianceFiltersProps {
  types: ComplianceType[];
  selectedType: string;
  selectedStatus: string;
  onTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
  onAddRecord: () => void;
  records: ComplianceRecord[];
}

export function ComplianceFilters({
  types,
  selectedType,
  selectedStatus,
  onTypeChange,
  onStatusChange,
  onAddRecord,
  records,
}: ComplianceFiltersProps) {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const handlePrint = useCallback(() => {
    if (records.length === 0) {
      showError('No compliance records to print');
      return;
    }

    setPrintLoading(true);
    try {
      printComplianceReport({
        records,
        statusFilter:
          selectedStatus === 'all'
            ? 'all'
            : (selectedStatus as 'active' | 'expired' | 'pending_renewal'),
      });
      showSuccess('Compliance report opened for printing');
    } catch (error) {
      logger.error('Failed to print compliance report:', error);
      showError('Failed to print compliance report');
    } finally {
      setPrintLoading(false);
    }
  }, [records, selectedStatus, showSuccess, showError]);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (records.length === 0) {
        showError('No compliance records to export');
        return;
      }

      setExportLoading(format);
      try {
        switch (format) {
          case 'csv':
            exportComplianceRecordsToCSV(records);
            showSuccess('Compliance records exported to CSV');
            break;
          case 'html':
            exportComplianceRecordsToHTML(records);
            showSuccess('Compliance records exported to HTML');
            break;
          case 'pdf':
            await exportComplianceRecordsToPDF(records);
            showSuccess('Compliance records exported to PDF');
            break;
        }
      } catch (error) {
        logger.error(`Failed to export compliance records to ${format}:`, error);
        showError(`Failed to export compliance records to ${format.toUpperCase()}`);
      } finally {
        setExportLoading(null);
      }
    },
    [records, showSuccess, showError],
  );

  return (
    <div className="space-y-4">
      <div className="tablet:flex-row tablet:items-center flex flex-col items-start justify-between gap-4">
        <div className="tablet:flex-row flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
              {t('compliance.filterType', 'Filter by Type')}
            </label>
            <select
              value={selectedType}
              onChange={e => onTypeChange(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="all">{t('compliance.allTypes', 'All Types')}</option>
              {types.map(type => (
                <option key={type.id} value={type.id.toString()}>
                  {getTypeIconEmoji(type.name)} {type.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
              {t('compliance.filterStatus', 'Filter by Status')}
            </label>
            <select
              value={selectedStatus}
              onChange={e => onStatusChange(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="all">{t('compliance.allStatuses', 'All Statuses')}</option>
              <option value="active">{t('compliance.active', 'Active')}</option>
              <option value="pending_renewal">
                {t('compliance.pendingRenewal', 'Pending Renewal')}
              </option>
              <option value="expired">{t('compliance.expired', 'Expired')}</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onAddRecord}
            className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 flex items-center gap-2 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
          >
            <Icon icon={Plus} size="sm" className="text-[var(--button-active-text)]" aria-hidden={true} />
            {t('compliance.addRecord', 'Add Compliance Record')}
          </button>
          <PrintButton
            onClick={handlePrint}
            loading={printLoading}
            disabled={records.length === 0}
          />
          <ExportButton
            onExport={handleExport}
            loading={exportLoading}
            disabled={records.length === 0}
            availableFormats={['csv', 'pdf', 'html']}
          />
        </div>
      </div>
    </div>
  );
}
