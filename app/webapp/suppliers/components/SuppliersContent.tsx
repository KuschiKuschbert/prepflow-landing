'use client';

/**
 * Content rendering component for suppliers page based on active tab.
 */

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';
import dynamic from 'next/dynamic';
import type { PriceListFormData, Supplier, SupplierFormData, SupplierPriceList } from '../types';

// Lazy load supplier components to reduce initial bundle size
const PriceListForm = dynamic(
  () => import('./PriceListForm').then(mod => ({ default: mod.PriceListForm })),
  {
    ssr: false,
    loading: () => null, // Forms handle their own loading states
  },
);

const PriceListsList = dynamic(
  () => import('./PriceListsList').then(mod => ({ default: mod.PriceListsList })),
  {
    ssr: false,
    loading: () => <PageSkeleton />,
  },
);

const SupplierForm = dynamic(
  () => import('./SupplierForm').then(mod => ({ default: mod.SupplierForm })),
  {
    ssr: false,
    loading: () => null, // Forms handle their own loading states
  },
);

const SuppliersGrid = dynamic(
  () => import('./SuppliersGrid').then(mod => ({ default: mod.SuppliersGrid })),
  {
    ssr: false,
    loading: () => <PageSkeleton />,
  },
);

interface SuppliersContentProps {
  activeTab: 'suppliers' | 'priceLists';
  suppliers: Supplier[];
  priceLists: SupplierPriceList[];
  showAddSupplier: boolean;
  showAddPriceList: boolean;
  selectedSupplier: string;
  newSupplier: SupplierFormData;
  newPriceList: PriceListFormData;
  onSupplierFormChange: (data: SupplierFormData) => void;
  onPriceListFormChange: (data: PriceListFormData) => void;
  onSupplierSubmit: (e: React.FormEvent) => void;
  onPriceListSubmit: (e: React.FormEvent) => void;
  onSupplierCancel: () => void;
  onPriceListCancel: () => void;
  onSupplierFilterChange: (supplierId: string) => void;
}

export function SuppliersContent({
  activeTab,
  suppliers,
  priceLists,
  showAddSupplier,
  showAddPriceList,
  selectedSupplier,
  newSupplier,
  newPriceList,
  onSupplierFormChange,
  onPriceListFormChange,
  onSupplierSubmit,
  onPriceListSubmit,
  onSupplierCancel,
  onPriceListCancel,
  onSupplierFilterChange,
}: SuppliersContentProps) {
  const { t } = useTranslation();

  const renderSuppliersView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">
          {t('suppliers.manageSuppliers', 'Manage Suppliers')}
        </h2>
        {/* Add Supplier button is handled by parent */}
      </div>

      {showAddSupplier && (
        <SupplierForm
          formData={newSupplier}
          onChange={onSupplierFormChange}
          onSubmit={onSupplierSubmit}
          onCancel={onSupplierCancel}
        />
      )}

      <SuppliersGrid suppliers={suppliers} />
    </div>
  );

  const renderPriceListsView = () => (
    <div className="space-y-6">
      <div className="tablet:flex-row tablet:items-center flex flex-col items-start justify-between gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('suppliers.filterSupplier', 'Filter by Supplier')}
          </label>
          <select
            value={selectedSupplier}
            onChange={e => onSupplierFilterChange(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          >
            <option value="all">{t('suppliers.allSuppliers', 'All Suppliers')}</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id.toString()}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
        {/* Add Price List button is handled by parent */}
      </div>

      {showAddPriceList && (
        <PriceListForm
          formData={newPriceList}
          suppliers={suppliers}
          onChange={onPriceListFormChange}
          onSubmit={onPriceListSubmit}
          onCancel={onPriceListCancel}
        />
      )}

      <PriceListsList priceLists={priceLists} />
    </div>
  );

  if (activeTab === 'suppliers') {
    return renderSuppliersView();
  }

  if (activeTab === 'priceLists') {
    return renderPriceListsView();
  }

  return null;
}
