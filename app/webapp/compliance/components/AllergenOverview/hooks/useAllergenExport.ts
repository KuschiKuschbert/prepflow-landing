/**
 * Hook for handling allergen data export
 */

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useState } from 'react';
import { handleFileDownload, handlePdfExport } from './helpers/exportHelpers';

export function useAllergenExport(selectedAllergenFilter: string) {
  const { showSuccess, showError } = useNotification();
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  const handleExport = async (format: 'csv' | 'pdf' | 'html') => {
    setExportLoading(format);
    try {
      const params = new URLSearchParams();
      params.append('format', format);

      if (selectedAllergenFilter !== 'all') {
        params.append('exclude_allergen', selectedAllergenFilter);
      }

      const response = await fetch(`/api/compliance/allergens/export?${params.toString()}`);

      if (!response.ok) {
        let errorMessage = 'Failed to export allergen data';
        try {
          const data = await response.json();
          errorMessage = data.error || data.message || errorMessage;
        } catch {
          errorMessage = `Export failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // For PDF, open in new window for print-to-PDF functionality
      if (format === 'pdf') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        await handlePdfExport(url, showSuccess);
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } else {
        // For CSV and HTML, download normally
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        handleFileDownload(url, format, showSuccess);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      logger.error('[Allergen Overview] Export error:', err);
      showError(err instanceof Error ? err.message : 'Failed to export allergen overview');
    } finally {
      setExportLoading(null);
    }
  };

  return { exportLoading, handleExport };
}
