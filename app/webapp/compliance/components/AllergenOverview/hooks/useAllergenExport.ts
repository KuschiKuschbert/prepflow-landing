/**
 * Hook for handling allergen data export
 */

import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';

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
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
          showSuccess(
            "PDF export opened in new window. Use your browser's print dialog to save as PDF.",
          );
        } else {
          // Fallback to download if popup blocked
          const a = document.createElement('a');
          a.href = url;
          a.download = 'allergen_overview.html';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showSuccess('HTML file downloaded. Open it and use Print > Save as PDF.');
        }
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } else {
        // For CSV and HTML, download normally
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `allergen_overview.${format === 'csv' ? 'csv' : 'html'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showSuccess(`Allergen overview exported as ${format.toUpperCase()}`);
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

