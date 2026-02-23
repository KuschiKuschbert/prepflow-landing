'use client';

import { Icon } from '@/components/ui/Icon';
import { PageTipsCard } from '@/components/ui/PageTipsCard';
import { CSVImportModal } from '@/components/ui/CSVImportModal';
import { type ExportFormat } from '@/components/ui/ExportButton';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { useNotification } from '@/contexts/NotificationContext';
import { PAGE_TIPS_CONFIG } from '@/lib/page-help/page-tips-content';
import { supplierImportConfig } from '@/lib/imports/supplier-import';
import { logger } from '@/lib/logger';
import { useTranslation } from '@/lib/useTranslation';
import { Truck } from 'lucide-react';
import { useCallback, useState } from 'react';
import { SuppliersActionHeader } from './components/SuppliersActionHeader';
import { SuppliersContent } from './components/SuppliersContent';
import { SuppliersTabs } from './components/SuppliersTabs';
import { useSupplierImport } from './hooks/useSupplierImport';
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

  const { importProgress, setImportProgress, handleImport } = useSupplierImport({
    suppliers,
    setSuppliers,
    setShowImportModal,
  });

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

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <ResponsivePageContainer>
      <div className="tablet:py-6 min-h-screen bg-transparent py-4">
        <div className="mb-8">
          <h1 className="mb-2 flex items-center gap-3 text-4xl font-bold text-[var(--foreground)]">
            <Icon icon={Truck} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
            {t('suppliers.title', 'Supplier Management')}
          </h1>
          <p className="text-[var(--foreground-muted)]">
            {t(
              'suppliers.subtitle',
              'Manage supplier contacts, price lists, and delivery schedules',
            )}
          </p>
        </div>

        {PAGE_TIPS_CONFIG.suppliers && (
          <div className="mb-6">
            <PageTipsCard config={PAGE_TIPS_CONFIG.suppliers} />
          </div>
        )}

        <SuppliersTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <SuppliersActionHeader
          activeTab={activeTab}
          suppliers={suppliers}
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
          setShowAddSupplier={setShowAddSupplier}
          setShowAddPriceList={setShowAddPriceList}
          setShowImportModal={setShowImportModal}
          handlePrint={handlePrint}
          handleExport={handleExport}
          printLoading={printLoading}
          exportLoading={exportLoading}
        />

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
          progress={importProgress}
        />
      </div>
    </ResponsivePageContainer>
  );
}
