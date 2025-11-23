'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';
import { useCallback, useEffect, useState } from 'react';
import { PriceListForm } from './components/PriceListForm';
import { PriceListsList } from './components/PriceListsList';
import { SupplierForm } from './components/SupplierForm';
import { SuppliersGrid } from './components/SuppliersGrid';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { PriceListFormData, Supplier, SupplierFormData, SupplierPriceList } from './types';

import { logger } from '@/lib/logger';
import { cacheData, getCachedData, prefetchApis } from '@/lib/cache/data-cache';
export default function SuppliersPage() {
  const { t } = useTranslation();
  // Initialize with empty arrays to avoid hydration mismatch
  // Cached data will be loaded in useEffect after mount
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [priceLists, setPriceLists] = useState<SupplierPriceList[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'suppliers' | 'priceLists'>('suppliers');
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showAddPriceList, setShowAddPriceList] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [newSupplier, setNewSupplier] = useState<SupplierFormData>({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    payment_terms: '',
    delivery_schedule: '',
    minimum_order_amount: '',
    notes: '',
  });
  const [newPriceList, setNewPriceList] = useState<PriceListFormData>({
    supplier_id: '',
    document_name: '',
    document_url: '',
    effective_date: '',
    expiry_date: '',
    notes: '',
    is_current: true,
  });

  // Prefetch APIs on mount
  useEffect(() => {
    prefetchApis(['/api/suppliers', '/api/supplier-price-lists']);
  }, []);

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await fetch('/api/suppliers');
      const data = await response.json();
      if (data.success) {
        setSuppliers(data.data);
        cacheData('suppliers', data.data);
      }
    } catch (error) {
      logger.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPriceLists = useCallback(async () => {
    try {
      let url = '/api/supplier-price-lists';
      if (selectedSupplier !== 'all') {
        url += `?supplier_id=${selectedSupplier}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setPriceLists(data.data);
        // Cache price lists (only cache when no filter applied for instant display)
        if (selectedSupplier === 'all') {
          cacheData('supplier_price_lists', data.data);
        }
      }
    } catch (error) {
      logger.error('Error fetching price lists:', error);
    }
  }, [selectedSupplier]);

  useEffect(() => {
    // Load cached data for instant display (client-only)
    const cachedSuppliers = getCachedData<Supplier[]>('suppliers');
    if (cachedSuppliers && cachedSuppliers.length > 0) {
      setSuppliers(cachedSuppliers);
    }

    const cachedPriceLists = getCachedData<SupplierPriceList[]>('supplier_price_lists');
    if (cachedPriceLists && cachedPriceLists.length > 0) {
      setPriceLists(cachedPriceLists);
    }

    // Fetch fresh data
    fetchSuppliers();
    fetchPriceLists();
  }, [fetchSuppliers, fetchPriceLists]);

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier),
      });
      const data = await response.json();
      if (data.success) {
        const updatedSuppliers = [...suppliers, data.data];
        setSuppliers(updatedSuppliers);
        cacheData('suppliers', updatedSuppliers);
        setNewSupplier({
          name: '',
          contact_person: '',
          email: '',
          phone: '',
          address: '',
          website: '',
          payment_terms: '',
          delivery_schedule: '',
          minimum_order_amount: '',
          notes: '',
        });
        setShowAddSupplier(false);
      }
    } catch (error) {
      logger.error('Error adding supplier:', error);
    }
  };

  const handleAddPriceList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/supplier-price-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPriceList,
          supplier_id: parseInt(newPriceList.supplier_id),
        }),
      });
      const data = await response.json();
      if (data.success) {
        const updatedPriceLists = [data.data, ...priceLists];
        setPriceLists(updatedPriceLists);
        if (selectedSupplier === 'all') {
          cacheData('supplier_price_lists', updatedPriceLists);
        }
        setNewPriceList({
          supplier_id: '',
          document_name: '',
          document_url: '',
          effective_date: '',
          expiry_date: '',
          notes: '',
          is_current: true,
        });
        setShowAddPriceList(false);
      }
    } catch (error) {
      logger.error('Error adding price list:', error);
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <ResponsivePageContainer>
      <div className="tablet:py-6 min-h-screen bg-transparent py-4">
        {/* Header */}
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

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === 'suppliers'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              👥 {t('suppliers.suppliers', 'Suppliers')}
            </button>
            <button
              onClick={() => setActiveTab('priceLists')}
              className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === 'priceLists'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📄 {t('suppliers.priceLists', 'Price Lists')}
            </button>
          </div>
        </div>

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            {/* Add Supplier Button */}
            <div className="flex items-center justify-between">
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

            {/* Add Supplier Form */}
            {showAddSupplier && (
              <SupplierForm
                formData={newSupplier}
                onChange={setNewSupplier}
                onSubmit={handleAddSupplier}
                onCancel={() => setShowAddSupplier(false)}
              />
            )}

            {/* Suppliers Grid */}
            <SuppliersGrid suppliers={suppliers} />
          </div>
        )}

        {/* Price Lists Tab */}
        {activeTab === 'priceLists' && (
          <div className="space-y-6">
            {/* Filter and Add Button */}
            <div className="tablet:flex-row tablet:items-center flex flex-col items-start justify-between gap-4">
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

            {/* Add Price List Form */}
            {showAddPriceList && (
              <PriceListForm
                formData={newPriceList}
                suppliers={suppliers}
                onChange={setNewPriceList}
                onSubmit={handleAddPriceList}
                onCancel={() => setShowAddPriceList(false)}
              />
            )}

            {/* Price Lists List */}
            <PriceListsList priceLists={priceLists} />
          </div>
        )}
      </div>
    </ResponsivePageContainer>
  );
}
