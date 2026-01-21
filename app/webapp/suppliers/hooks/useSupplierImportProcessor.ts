import type { ImportProgressState } from '@/components/ui/ImportProgress';
import { useNotification } from '@/contexts/NotificationContext';
import { cacheData } from '@/lib/cache/data-cache';
import type { SupplierImportRow } from '@/lib/imports/supplier-import';
import { logger } from '@/lib/logger';
import { useCallback, useState } from 'react';
import type { Supplier } from '../types';

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

      // Store original state for rollback
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
          // Use negative number for temp ID to match Supplier.id type (number)
          const tempId = -Date.now() - i;

          // Create temporary supplier for optimistic update
          const tempSupplier: Supplier = {
            id: tempId,
            name: row.name,
            contact_person: row.contact_person || null,
            email: row.email || null,
            phone: row.phone || null,
            address: row.address || null,
            website: row.website || null,
            payment_terms: row.payment_terms || null,
            delivery_schedule: row.delivery_schedule || null,
            minimum_order_amount: row.minimum_order_amount || null,
            is_active: row.is_active !== undefined ? row.is_active : true,
            notes: row.notes || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Optimistically add to UI immediately
          setSuppliers(prevSuppliers => [...prevSuppliers, tempSupplier]);
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

          try {
            // Map import row to API format
            const supplierData = {
              supplier_name: row.name,
              contact_person: row.contact_person || null,
              email: row.email || null,
              phone: row.phone || null,
              address: row.address || null,
              website: row.website || null,
              payment_terms: row.payment_terms || null,
              delivery_schedule: row.delivery_schedule || null,
              minimum_order_amount: row.minimum_order_amount || null,
              is_active: row.is_active !== undefined ? row.is_active : true,
              notes: row.notes || null,
            };

            const response = await fetch('/api/suppliers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(supplierData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
              // Transform API response (supplier_name -> name) to match Supplier interface
              const serverSupplier: Supplier = {
                ...result.data,
                name: result.data.supplier_name || result.data.name,
              };

              // Replace temp supplier with real supplier from server
              setSuppliers(prevSuppliers =>
                prevSuppliers.map(s => (s.id === tempId ? serverSupplier : s)),
              );

              importedSuppliers.push(serverSupplier);
              successCount++;
            } else {
              // Error - remove temp supplier
              setSuppliers(prevSuppliers => prevSuppliers.filter(s => s.id !== tempId));
              failCount++;
              errors.push({
                row: i + 1,
                error: result.error || result.message || 'Failed to import supplier',
              });
            }
          } catch (err) {
            // Error - remove temp supplier
            setSuppliers(prevSuppliers => prevSuppliers.filter(s => s.id !== tempId));
            const errorMessage = err instanceof Error ? err.message : 'Failed to import supplier';
            logger.error(`[Suppliers Import] Failed to import row ${i + 1}:`, {
              error: errorMessage,
              err,
            });
            failCount++;
            errors.push({
              row: i + 1,
              error: errorMessage,
            });
          }
        }

        // Cache final suppliers list
        if (importedSuppliers.length > 0) {
          setSuppliers(prevSuppliers => {
            const finalList = prevSuppliers.filter(
              s => !tempSuppliers.some(t => t.tempId === s.id),
            );
            const updatedList = [...finalList, ...importedSuppliers];
            cacheData('suppliers', updatedList);
            return updatedList;
          });
        } else {
          // No successful imports - revert all optimistic updates
          setSuppliers(() => originalSuppliers);
        }

        setImportProgress({
          total: importRows.length,
          processed: importRows.length,
          successful: successCount,
          failed: failCount,
          isComplete: true,
          errors: errors.length > 0 ? errors : undefined,
        });

        if (successCount > 0) {
          showSuccess(
            `Successfully imported ${successCount} supplier${successCount !== 1 ? 's' : ''}`,
          );
        }
        if (failCount > 0) {
          showError(`Failed to import ${failCount} supplier${failCount !== 1 ? 's' : ''}`);
        }

        // Close modal after a short delay to show completion
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
