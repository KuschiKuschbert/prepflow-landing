'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { Icon } from '@/components/ui/Icon';
import { getSavedExportTheme } from '@/lib/exports/utils/themeUtils';
import { Download, Printer } from 'lucide-react';
import { useState } from 'react';

interface AllergenConflict {
  requirement: string;
  offendingItems: string[];
}

interface ExportErrorResponse {
  error?: string;
  conflicts?: AllergenConflict[];
  message?: string;
}

interface ExportDayButtonProps {
  functionId: string;
  /** When undefined, exports full runsheet (all days) */
  dayNumber?: number;
}

function buildConflictMessage(conflicts: AllergenConflict[]): string {
  const parts = conflicts.map(
    c =>
      `${c.requirement}: ${c.offendingItems.slice(0, 5).join(', ')}${c.offendingItems.length > 5 ? '…' : ''}`,
  );
  return parts.join('. ') + '. Please update your notes or change the runsheet to comply.';
}

export function ExportDayButton({ functionId, dayNumber }: ExportDayButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { showError } = useNotification();

  const buildUrl = () => {
    const theme = getSavedExportTheme();
    const params = new URLSearchParams({ theme });
    if (dayNumber != null) params.set('day', String(dayNumber));
    return `/api/functions/${functionId}/export?${params.toString()}`;
  };

  const handleExportError = async (res: Response): Promise<boolean> => {
    if (res.ok) return false;
    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      try {
        const data: ExportErrorResponse = await res.json();
        if (data.error === 'allergen_notes_conflict' && data.conflicts?.length) {
          showError(buildConflictMessage(data.conflicts));
          return true;
        }
        if (data.message) {
          showError(data.message);
          return true;
        }
      } catch {
        // Fall through to generic error
      }
    }
    showError('Export hit a snag, chef. Give it another go.');
    return true;
  };

  const handlePrint = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(buildUrl());
      if (!res.ok) {
        await handleExportError(res);
        return;
      }

      const html = await res.text();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html); // auditor:ignore - controlled print flow from our API
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 300);
      }
    } catch (err) {
      logger.error('[ExportDayButton] Print failed:', { error: err });
      showError('Export hit a snag, chef. Give it another go.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(buildUrl());
      if (!res.ok) {
        await handleExportError(res);
        return;
      }

      const html = await res.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = dayNumber != null ? `runsheet-day-${dayNumber}.html` : 'runsheet-full.html';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      logger.error('[ExportDayButton] Download failed:', { error: err });
      showError('Export hit a snag, chef. Give it another go.');
    } finally {
      setIsExporting(false);
    }
  };

  const label = dayNumber != null ? `Day ${dayNumber}` : 'Full runsheet';

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handlePrint}
        disabled={isExporting}
        className="rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label={`Print ${label} runsheet`}
        title={`Print ${label}`}
      >
        <Icon icon={Printer} size="sm" />
      </button>
      <button
        onClick={handleDownload}
        disabled={isExporting}
        className="rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label={`Download ${label} runsheet`}
        title={`Download ${label}`}
      >
        <Icon icon={Download} size="sm" />
      </button>
    </div>
  );
}
