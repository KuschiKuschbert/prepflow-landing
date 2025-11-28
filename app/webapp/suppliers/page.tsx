'use client';

import { useState } from 'react';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { useSuppliersData } from './hooks/useSuppliersData';
import { useSuppliersForms } from './hooks/useSuppliersForms';
import { SuppliersTabs } from './components/SuppliersTabs';
import { SuppliersContent } from './components/SuppliersContent';

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
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              {t('suppliers.manageSuppliers', 'Manage Suppliers')}
            </h2>
            <button
              onClick={() => setShowAddSupplier(true)}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
            >
              ➕ {t('suppliers.addSupplier', 'Add Supplier')}
            </button>
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
      </div>
    </ResponsivePageContainer>
  );
}
