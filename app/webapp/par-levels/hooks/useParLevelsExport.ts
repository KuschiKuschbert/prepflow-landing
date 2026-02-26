'use client';

import { type ExportFormat } from '@/components/ui/ExportButton';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useCallback, useState } from 'react';
import {
  exportParLevelsToCSV,
  exportParLevelsToHTML,
  exportParLevelsToPDF,
} from '../utils/exportParLevels';
import { printParLevels } from '../utils/printParLevels';
import type { ParLevel } from '../types';

interface UseParLevelsExportProps {
  parLevels: ParLevel[];
}

export function useParLevelsExport({ parLevels }: UseParLevelsExportProps) {
  const { showSuccess, showError } = useNotification();
  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const handlePrint = useCallback(() => {
    if (parLevels.length === 0) {
      showError('No par levels to print');
      return;
    }

    setPrintLoading(true);
    try {
      printParLevels({ parLevels });
      showSuccess('Par levels report opened for printing');
    } catch (error) {
      logger.error('Failed to print par levels:', error);
      showError('Failed to print par levels');
    } finally {
      setPrintLoading(false);
    }
  }, [parLevels, showSuccess, showError]);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (parLevels.length === 0) {
        showError('No par levels to export');
        return;
      }

      setExportLoading(format);
      try {
        switch (format) {
          case 'csv':
            exportParLevelsToCSV(parLevels);
            showSuccess('Par levels exported to CSV');
            break;
          case 'html':
            exportParLevelsToHTML(parLevels);
            showSuccess('Par levels exported to HTML');
            break;
          case 'pdf':
            await exportParLevelsToPDF(parLevels);
            showSuccess('Par levels exported to PDF');
            break;
        }
      } catch (error) {
        logger.error(`Failed to export par levels to ${format}:`, error);
        showError(`Failed to export par levels to ${format.toUpperCase()}`);
      } finally {
        setExportLoading(null);
      }
    },
    [parLevels, showSuccess, showError],
  );

  return {
    exportLoading,
    printLoading,
    handlePrint,
    handleExport,
  };
}
