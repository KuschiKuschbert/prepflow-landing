import type { ImportProgressState } from '@/components/ui/ImportProgress';
import { useNotification } from '@/contexts/NotificationContext';
import type { SupplierImportRow } from '@/lib/imports/supplier-import';
import { logger } from '@/lib/logger';
import { useCallback, useState } from 'react';
import type { Supplier } from '../types';
import {
  buildImportCompletionProgress,
  buildTempSupplierFromRow,
  finalizeSupplierImport,
  processSingleImportRow,
} from '../utils/import-helpers';

interface UseSupplierImportProcessorProps {
  suppliers: Supplier[];
  setSuppliers: (updater: (prev: Supplier[]) => Supplier[]) => void;
  setShowImportModal: (show: boolean) => void;
}

export function useSupplierImportProcessor({
  suppliers,
  setSuppliers,
  setShowImportModal,
}: UseSupplierImportProcessorProps) {
  const { showSuccess, showError } = useNotification();
  const [importProgress, setImportProgress] = useState<ImportProgressState | undefined>(undefined);

  const processImports = useCallback(
    async (importRows: SupplierImportRow[]) => {
      if (importRows.length === 0) {
        showError('No suppliers to import');
        return;
      }
      const originalSuppliers = [...suppliers];
      setImportProgress({
        total: importRows.length,
        processed: 0,
        successful: 0,
        failed: 0,
        isComplete: false,
      });

      const importedSuppliers: Supplier[] = [];
      const tempSuppliers: Array<{ tempId: number; supplier: Supplier }> = [];
      let successCount = 0;
      let failCount = 0;
      const errors: Array<{ row: number; error: string }> = [];

      try {
        for (let i = 0; i < importRows.length; i++) {
          const row = importRows[i];
          const tempId = -Date.now() - i;
          const tempSupplier = buildTempSupplierFromRow(row, tempId);
          tempSuppliers.push({ tempId, supplier: tempSupplier });

          setImportProgress({
            total: importRows.length,
            processed: i + 1,
            successful: successCount,
            failed: failCount,
            currentItem: row.name,
            isComplete: false,
            errors,
          });

          const result = await processSingleImportRow(row, i, tempId, tempSupplier, setSuppliers);
          if (result.success && result.supplier) {
            importedSuppliers.push(result.supplier);
            successCount++;
          } else {
            failCount++;
            errors.push({ row: i + 1, error: result.error || 'Failed to import supplier' });
          }
        }

        finalizeSupplierImport(importedSuppliers, tempSuppliers, originalSuppliers, setSuppliers);

        setImportProgress(
          buildImportCompletionProgress(importRows.length, successCount, failCount, errors),
        );
        if (successCount > 0)
          showSuccess(
            `Successfully imported ${successCount} supplier${successCount !== 1 ? 's' : ''}`,
          );
        if (failCount > 0)
          showError(`Failed to import ${failCount} supplier${failCount !== 1 ? 's' : ''}`);
        setTimeout(() => {
          setShowImportModal(false);
          setImportProgress(undefined);
        }, 2000);
      } catch (err) {
        // Error - revert all optimistic updates
        setSuppliers(() => originalSuppliers);
        logger.error('[Suppliers Import] Import error:', err);
        showError('Failed to import suppliers. Give it another go, chef.');
        setImportProgress(undefined);
      }
    },
    [suppliers, setSuppliers, showSuccess, showError, setShowImportModal],
  );

  return {
    importProgress,
    setImportProgress,
    processImports,
  };
}
