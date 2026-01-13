import { useCallback } from 'react';
import type { QRCodeEntity } from '../types';
import { generatePrintHTML } from '../utils/generatePrintHTML';

/**
 * Hook for QR code printing functionality
 */
export function useQRCodePrint(showError?: (message: string) => void) {
  const handlePrint = useCallback(
    (entitiesToPrint: QRCodeEntity[]) => {
      if (entitiesToPrint.length === 0) return;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        if (showError) {
          showError('Please allow popups for printing');
        }
        return;
      }

      printWindow.document.write(generatePrintHTML(entitiesToPrint)); // auditor:ignore
      printWindow.document.close();
    },
    [showError],
  );

  return {
    handlePrint,
  };
}
