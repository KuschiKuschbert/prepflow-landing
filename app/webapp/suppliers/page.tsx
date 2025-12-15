'use client';

import { CSVImportModal } from '@/components/ui/CSVImportModal';
import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';
import { ImportButton } from '@/components/ui/ImportButton';
import type { ImportProgressState } from '@/components/ui/ImportProgress';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { PrintButton } from '@/components/ui/PrintButton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { useNotification } from '@/contexts/NotificationContext';
import { cacheData } from '@/lib/cache/data-cache';
import { supplierImportConfig, type SupplierImportRow } from '@/lib/imports/supplier-import';
import { logger } from '@/lib/logger';
import { useTranslation } from '@/lib/useTranslation';
import { useCallback, useState } from 'react';
import { SuppliersContent } from './components/SuppliersContent';
import { SuppliersTabs } from './components/SuppliersTabs';
import { useSuppliersData } from './hooks/useSuppliersData';
import { useSuppliersForms } from './hooks/useSuppliersForms';
import {
    exportSuppliersToCSV,
    exportSuppliersToHTML,
    exportSuppliersToPDF,
} from './utils/exportSuppliers';
import { printSuppliers } from './utils/printSuppliers';

export default function SuppliersPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'suppliers' | 'priceLists'>('suppliers');
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showAddPriceList, setShowAddPriceList] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('all');

  const { suppliers, priceLists, loading, setSuppliers, setPriceLists } =
    useSuppliersData(selectedSupplier);

  const {
    newSupplier,
    setNewSupplier,
    newPriceList,
    setNewPriceList,
    handleAddSupplier,
    handleAddPriceList,
  } = useSuppliersForms({
    suppliers,
    priceLists,
    selectedSupplier,
    setSuppliers,
    setPriceLists,
    setShowAddSupplier,
    setShowAddPriceList,
  });

  const { showSuccess, showError } = useNotification();
  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null);
  const [printLoading, setPrintLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgressState | undefined>(undefined);

  const handlePrint = useCallback(() => {
    if (suppliers.length === 0) {
      showError('No suppliers to print');
      return;
    }

    setPrintLoading(true);
    try {
      printSuppliers({ suppliers });
      showSuccess('Suppliers list opened for printing');
    } catch (error) {
      logger.error('Failed to print suppliers:', error);
      showError('Failed to print suppliers');
    } finally {
      setPrintLoading(false);
    }
  }, [suppliers, showSuccess, showError]);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (suppliers.length === 0) {
        showError('No suppliers to export');
        return;
      }

      setExportLoading(format);
      try {
        switch (format) {
          case 'csv':
            exportSuppliersToCSV(suppliers);
            showSuccess('Suppliers exported to CSV');
            break;
          case 'html':
            exportSuppliersToHTML(suppliers);
            showSuccess('Suppliers exported to HTML');
            break;
          case 'pdf':
            await exportSuppliersToPDF(suppliers);
            showSuccess('Suppliers exported to PDF');
            break;
        }
      } catch (error) {
        logger.error(`Failed to export suppliers to ${format}:`, error);
        showError(`Failed to export suppliers to ${format.toUpperCase()}`);
      } finally {
        setExportLoading(null);
      }
    },
    [suppliers, showSuccess, showError],
  );

  const handleImport = useCallback(
    async (importRows: SupplierImportRow[]) => {
      if (importRows.length === 0) {
        showError('No suppliers to import');
        return;
      }

      setImportLoading(true);
      setImportProgress({
        total: importRows.length,
        processed: 0,
        successful: 0,
        failed: 0,
        isComplete: false,
      });

      const importedSuppliers: any[] = [];
      let successCount = 0;
      let failCount = 0;
      const errors: Array<{ row: number; error: string }> = [];

      try {
        for (let i = 0; i < importRows.length; i++) {
          const row = importRows[i];
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
              importedSuppliers.push(result.data);
              successCount++;
            } else {
              failCount++;
              errors.push({
                row: i + 1,
                error: result.error || result.message || 'Failed to import supplier',
              });
            }
          } catch (err) {
            failCount++;
            errors.push({
              row: i + 1,
              error: err instanceof Error ? err.message : 'Failed to import supplier',
            });
            logger.error(`[Suppliers Import] Failed to import row ${i + 1}:`, err);
          }
        }

        // Update suppliers list
        if (importedSuppliers.length > 0) {
          const updatedSuppliers = [...suppliers, ...importedSuppliers];
          setSuppliers(updatedSuppliers);
          cacheData('suppliers', updatedSuppliers);
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
        logger.error('[Suppliers Import] Import error:', err);
        showError("Failed to import suppliers. Give it another go, chef.");
        setImportProgress(undefined);
      } finally {
        setImportLoading(false);
      }
    },
    [suppliers, setSuppliers, showSuccess, showError],
  );

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <ResponsivePageContainer>
      <div className="tablet:py-6 min-h-screen bg-transparent py-4">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">
            🚚 {t('suppliers.title', 'Supplier Management')}
          </h1>
          <p className="text-gray-400">
            {t(
              'suppliers.subtitle',
              'Manage supplier contacts, price lists, and delivery schedules',
            )}
          </p>
        </div>

        <SuppliersTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'suppliers' && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-white">
              {t('suppliers.manageSuppliers', 'Manage Suppliers')}
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAddSupplier(true)}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
              >
                ➕ {t('suppliers.addSupplier', 'Add Supplier')}
              </button>
              <ImportButton onClick={() => setShowImportModal(true)} />
              <PrintButton
                onClick={handlePrint}
                loading={printLoading}
                disabled={suppliers.length === 0}
              />
              <ExportButton
                onExport={handleExport}
                loading={exportLoading}
                disabled={suppliers.length === 0}
                availableFormats={['csv', 'pdf', 'html']}
              />
            </div>
          </div>
        )}

        {activeTab === 'priceLists' && (
          <div className="tablet:flex-row tablet:items-center mb-6 flex flex-col items-start justify-between gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t('suppliers.filterSupplier', 'Filter by Supplier')}
              </label>
              <select
                value={selectedSupplier}
                onChange={e => setSelectedSupplier(e.target.value)}
                className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              >
                <option value="all">{t('suppliers.allSuppliers', 'All Suppliers')}</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id.toString()}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddPriceList(true)}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
            >
              ➕ {t('suppliers.addPriceList', 'Add Price List')}
            </button>
          </div>
        )}

        <SuppliersContent
          activeTab={activeTab}
          suppliers={suppliers}
          priceLists={priceLists}
          showAddSupplier={showAddSupplier}
          showAddPriceList={showAddPriceList}
          selectedSupplier={selectedSupplier}
          newSupplier={newSupplier}
          newPriceList={newPriceList}
          onSupplierFormChange={setNewSupplier}
          onPriceListFormChange={setNewPriceList}
          onSupplierSubmit={handleAddSupplier}
          onPriceListSubmit={handleAddPriceList}
          onSupplierCancel={() => setShowAddSupplier(false)}
          onPriceListCancel={() => setShowAddPriceList(false)}
          onSupplierFilterChange={setSelectedSupplier}
        />

        {/* Import Modal */}
        <CSVImportModal
          isOpen={showImportModal}
          onClose={() => {
            setShowImportModal(false);
            setImportProgress(undefined);
          }}
          onImport={handleImport}
          config={supplierImportConfig}
          loading={importLoading}
          progress={importProgress}
        />
      </div>
    </ResponsivePageContainer>
  );
}
