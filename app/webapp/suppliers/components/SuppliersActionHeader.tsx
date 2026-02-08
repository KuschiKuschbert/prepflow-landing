'use client';

import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';
import { ImportButton } from '@/components/ui/ImportButton';
import { PrintButton } from '@/components/ui/PrintButton';
import { useTranslation } from '@/lib/useTranslation';
import type { Supplier } from '../types';

interface SuppliersActionHeaderProps {
  activeTab: 'suppliers' | 'priceLists';
  suppliers: Supplier[];
  selectedSupplier: string;
  setSelectedSupplier: (id: string) => void;
  setShowAddSupplier: (show: boolean) => void;
  setShowAddPriceList: (show: boolean) => void;
  setShowImportModal: (show: boolean) => void;
  handlePrint: () => void;
  handleExport: (format: ExportFormat) => void;
  printLoading: boolean;
  exportLoading: ExportFormat | null;
}

export function SuppliersActionHeader({
  activeTab,
  suppliers,
  selectedSupplier,
  setSelectedSupplier,
  setShowAddSupplier,
  setShowAddPriceList,
  setShowImportModal,
  handlePrint,
  handleExport,
  printLoading,
  exportLoading,
}: SuppliersActionHeaderProps) {
  const { t } = useTranslation();

  if (activeTab === 'suppliers') {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-fluid-xl tablet:text-fluid-2xl font-semibold text-[var(--foreground)]">
          {t('suppliers.manageSuppliers', 'Manage Suppliers')}
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAddSupplier(true)}
            className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
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
    );
  }

  return (
    <div className="tablet:flex-row tablet:items-center mb-6 flex flex-col items-start justify-between gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          {t('suppliers.filterSupplier', 'Filter by Supplier')}
        </label>
        <select
          value={selectedSupplier}
          onChange={e => setSelectedSupplier(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">{t('suppliers.allSuppliers', 'All Suppliers')}</option>
          {suppliers.map((supplier: Supplier) => (
            <option key={supplier.id} value={supplier.id.toString()}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => setShowAddPriceList(true)}
        className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
      >
        ➕ {t('suppliers.addPriceList', 'Add Price List')}
      </button>
    </div>
  );
}
