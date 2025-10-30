'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';

interface Supplier {
  id: number;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  payment_terms: string | null;
  delivery_schedule: string | null;
  minimum_order_amount: number | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface SupplierPriceList {
  id: number;
  supplier_id: number;
  document_name: string;
  document_url: string;
  effective_date: string | null;
  expiry_date: string | null;
  is_current: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  suppliers: Supplier;
}

export default function SuppliersPage() {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [priceLists, setPriceLists] = useState<SupplierPriceList[]>([]);
  const [loading, setLoading] = useState(false); // Start with false to prevent skeleton flash
  const [activeTab, setActiveTab] = useState<'suppliers' | 'priceLists'>('suppliers');
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showAddPriceList, setShowAddPriceList] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [newSupplier, setNewSupplier] = useState({
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
  const [newPriceList, setNewPriceList] = useState({
    supplier_id: '',
    document_name: '',
    document_url: '',
    effective_date: '',
    expiry_date: '',
    notes: '',
    is_current: true,
  });

  useEffect(() => {
    fetchSuppliers();
    fetchPriceLists();
  }, [selectedSupplier]);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers');
      const data = await response.json();
      if (data.success) {
        setSuppliers(data.data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceLists = async () => {
    try {
      let url = '/api/supplier-price-lists';
      if (selectedSupplier !== 'all') {
        url += `?supplier_id=${selectedSupplier}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setPriceLists(data.data);
      }
    } catch (error) {
      console.error('Error fetching price lists:', error);
    }
  };

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
        setSuppliers([...suppliers, data.data]);
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
      console.error('Error adding supplier:', error);
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
        setPriceLists([data.data, ...priceLists]);
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
      console.error('Error adding price list:', error);
    }
  };

  const getSupplierIcon = (supplierName: string) => {
    const name = supplierName.toLowerCase();
    if (name.includes('meat') || name.includes('butcher')) return '🥩';
    if (name.includes('fish') || name.includes('seafood')) return '🐟';
    if (name.includes('vegetable') || name.includes('produce')) return '🥬';
    if (name.includes('dairy') || name.includes('milk')) return '🥛';
    if (name.includes('bakery') || name.includes('bread')) return '🍞';
    if (name.includes('wine') || name.includes('beverage')) return '🍷';
    return '🚚';
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
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
              <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-white">
                  {t('suppliers.addNewSupplier', 'Add New Supplier')}
                </h3>
                <form
                  onSubmit={handleAddSupplier}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.name', 'Supplier Name')}
                    </label>
                    <input
                      type="text"
                      value={newSupplier.name}
                      onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(
                        t('suppliers.namePlaceholder', 'e.g., Fresh Produce Co.'),
                      )}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.contactPerson', 'Contact Person')}
                    </label>
                    <input
                      type="text"
                      value={newSupplier.contact_person}
                      onChange={e =>
                        setNewSupplier({ ...newSupplier, contact_person: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(
                        t('suppliers.contactPersonPlaceholder', 'e.g., John Smith'),
                      )}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.email', 'Email')}
                    </label>
                    <input
                      type="email"
                      value={newSupplier.email}
                      onChange={e => setNewSupplier({ ...newSupplier, email: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(t('suppliers.emailPlaceholder', 'contact@supplier.com'))}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.phone', 'Phone')}
                    </label>
                    <input
                      type="tel"
                      value={newSupplier.phone}
                      onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(t('suppliers.phonePlaceholder', '+61 2 1234 5678'))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.address', 'Address')}
                    </label>
                    <textarea
                      value={newSupplier.address}
                      onChange={e => setNewSupplier({ ...newSupplier, address: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(
                        t('suppliers.addressPlaceholder', 'Full business address'),
                      )}
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.website', 'Website')}
                    </label>
                    <input
                      type="url"
                      value={newSupplier.website}
                      onChange={e => setNewSupplier({ ...newSupplier, website: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(
                        t('suppliers.websitePlaceholder', 'https://supplier.com'),
                      )}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.paymentTerms', 'Payment Terms')}
                    </label>
                    <input
                      type="text"
                      value={newSupplier.payment_terms}
                      onChange={e =>
                        setNewSupplier({ ...newSupplier, payment_terms: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(
                        t('suppliers.paymentTermsPlaceholder', 'e.g., Net 30, Cash on Delivery'),
                      )}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.deliverySchedule', 'Delivery Schedule')}
                    </label>
                    <input
                      type="text"
                      value={newSupplier.delivery_schedule}
                      onChange={e =>
                        setNewSupplier({ ...newSupplier, delivery_schedule: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(
                        t(
                          'suppliers.deliverySchedulePlaceholder',
                          'e.g., Monday, Wednesday, Friday',
                        ),
                      )}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.minimumOrder', 'Minimum Order Amount')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newSupplier.minimum_order_amount}
                      onChange={e =>
                        setNewSupplier({ ...newSupplier, minimum_order_amount: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(t('suppliers.minimumOrderPlaceholder', 'e.g., 100.00'))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.notes', 'Notes')}
                    </label>
                    <textarea
                      value={newSupplier.notes}
                      onChange={e => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(
                        t('suppliers.notesPlaceholder', 'Additional notes or special instructions'),
                      )}
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-4 md:col-span-2">
                    <button
                      type="submit"
                      className="rounded-2xl bg-[#29E7CD] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
                    >
                      {t('suppliers.save', 'Save Supplier')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddSupplier(false)}
                      className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
                    >
                      {t('suppliers.cancel', 'Cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Suppliers Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {suppliers.map(supplier => (
                <div
                  key={supplier.id}
                  className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                      <span className="text-2xl">{getSupplierIcon(supplier.name)}</span>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        supplier.is_active
                          ? 'border border-green-400/20 bg-green-400/10 text-green-400'
                          : 'border border-gray-400/20 bg-gray-400/10 text-gray-400'
                      }`}
                    >
                      {supplier.is_active
                        ? t('suppliers.active', 'Active')
                        : t('suppliers.inactive', 'Inactive')}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">{supplier.name}</h3>

                  <div className="mb-4 space-y-2">
                    {supplier.contact_person && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">👤</span>
                        <span className="text-sm text-gray-300">{supplier.contact_person}</span>
                      </div>
                    )}
                    {supplier.email && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">📧</span>
                        <a
                          href={`mailto:${supplier.email}`}
                          className="text-sm text-[#29E7CD] hover:underline"
                        >
                          {supplier.email}
                        </a>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">📞</span>
                        <a
                          href={`tel:${supplier.phone}`}
                          className="text-sm text-[#29E7CD] hover:underline"
                        >
                          {supplier.phone}
                        </a>
                      </div>
                    )}
                    {supplier.website && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">🌐</span>
                        <a
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#29E7CD] hover:underline"
                        >
                          {supplier.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {supplier.payment_terms && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-400">
                        {t('suppliers.paymentTerms', 'Payment Terms')}:{' '}
                      </span>
                      <span className="text-sm text-white">{supplier.payment_terms}</span>
                    </div>
                  )}

                  {supplier.delivery_schedule && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-400">
                        {t('suppliers.deliverySchedule', 'Delivery Schedule')}:{' '}
                      </span>
                      <span className="text-sm text-white">{supplier.delivery_schedule}</span>
                    </div>
                  )}

                  {supplier.minimum_order_amount && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-400">
                        {t('suppliers.minimumOrder', 'Minimum Order')}:{' '}
                      </span>
                      <span className="text-sm text-white">${supplier.minimum_order_amount}</span>
                    </div>
                  )}

                  {supplier.notes && <p className="mb-4 text-sm text-gray-300">{supplier.notes}</p>}

                  <div className="flex space-x-4">
                    <button className="rounded-xl bg-[#29E7CD] px-4 py-2 font-semibold text-black transition-all duration-200 hover:shadow-lg">
                      ✏️ {t('suppliers.edit', 'Edit')}
                    </button>
                    <button className="rounded-xl bg-[#2a2a2a] px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]">
                      📄 {t('suppliers.addPriceList', 'Add Price List')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Lists Tab */}
        {activeTab === 'priceLists' && (
          <div className="space-y-6">
            {/* Filter and Add Button */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
                      {getSupplierIcon(supplier.name)} {supplier.name}
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
              <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-white">
                  {t('suppliers.addNewPriceList', 'Add New Price List')}
                </h3>
                <form
                  onSubmit={handleAddPriceList}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.selectSupplier', 'Select Supplier')}
                    </label>
                    <select
                      value={newPriceList.supplier_id}
                      onChange={e =>
                        setNewPriceList({ ...newPriceList, supplier_id: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      required
                    >
                      <option value="">
                        {t('suppliers.selectSupplierPlaceholder', 'Choose a supplier')}
                      </option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {getSupplierIcon(supplier.name)} {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.documentName', 'Document Name')}
                    </label>
                    <input
                      type="text"
                      value={newPriceList.document_name}
                      onChange={e =>
                        setNewPriceList({ ...newPriceList, document_name: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(
                        t('suppliers.documentNamePlaceholder', 'e.g., January 2024 Price List'),
                      )}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.documentUrl', 'Document URL')}
                    </label>
                    <input
                      type="url"
                      value={newPriceList.document_url}
                      onChange={e =>
                        setNewPriceList({ ...newPriceList, document_url: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(
                        t('suppliers.documentUrlPlaceholder', 'Link to price list document'),
                      )}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.effectiveDate', 'Effective Date')}
                    </label>
                    <input
                      type="date"
                      value={newPriceList.effective_date}
                      onChange={e =>
                        setNewPriceList({ ...newPriceList, effective_date: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.expiryDate', 'Expiry Date')}
                    </label>
                    <input
                      type="date"
                      value={newPriceList.expiry_date}
                      onChange={e =>
                        setNewPriceList({ ...newPriceList, expiry_date: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      {t('suppliers.notes', 'Notes')}
                    </label>
                    <textarea
                      value={newPriceList.notes}
                      onChange={e => setNewPriceList({ ...newPriceList, notes: e.target.value })}
                      className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder={String(
                        t('suppliers.notesPlaceholder', 'Additional notes about this price list'),
                      )}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-4 md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newPriceList.is_current}
                        onChange={e =>
                          setNewPriceList({ ...newPriceList, is_current: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-[#2a2a2a] bg-[#2a2a2a] text-[#29E7CD] focus:ring-[#29E7CD]"
                      />
                      <span className="text-gray-300">
                        {t('suppliers.setAsCurrent', 'Set as current price list')}
                      </span>
                    </label>
                  </div>
                  <div className="flex space-x-4 md:col-span-2">
                    <button
                      type="submit"
                      className="rounded-2xl bg-[#29E7CD] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
                    >
                      {t('suppliers.save', 'Save Price List')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddPriceList(false)}
                      className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
                    >
                      {t('suppliers.cancel', 'Cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Price Lists List */}
            <div className="space-y-4">
              {priceLists.length === 0 ? (
                <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center shadow-lg">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                    <span className="text-4xl">📄</span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {t('suppliers.noPriceLists', 'No Price Lists')}
                  </h3>
                  <p className="text-gray-400">
                    {t(
                      'suppliers.noPriceListsDesc',
                      'Start uploading supplier price lists for easy access',
                    )}
                  </p>
                </div>
              ) : (
                priceLists.map(priceList => (
                  <div
                    key={priceList.id}
                    className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                          <span className="text-2xl">
                            {getSupplierIcon(priceList.suppliers.name)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {priceList.document_name}
                          </h3>
                          <p className="text-gray-400">{priceList.suppliers.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {priceList.is_current && (
                          <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-medium text-green-400">
                            ✅ {t('suppliers.current', 'Current')}
                          </span>
                        )}
                        <a
                          href={priceList.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl bg-[#29E7CD] px-4 py-2 font-semibold text-black transition-all duration-200 hover:shadow-lg"
                        >
                          📄 {t('suppliers.viewDocument', 'View Document')}
                        </a>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      {priceList.effective_date && (
                        <div>
                          <span className="text-sm text-gray-400">
                            {t('suppliers.effectiveDate', 'Effective Date')}:{' '}
                          </span>
                          <span className="text-white">
                            {new Date(priceList.effective_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {priceList.expiry_date && (
                        <div>
                          <span className="text-sm text-gray-400">
                            {t('suppliers.expiryDate', 'Expiry Date')}:{' '}
                          </span>
                          <span className="text-white">
                            {new Date(priceList.expiry_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {priceList.notes && <p className="mb-4 text-gray-300">{priceList.notes}</p>}

                    <div className="flex space-x-4">
                      <button className="rounded-xl bg-[#2a2a2a] px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]">
                        ✏️ {t('suppliers.edit', 'Edit')}
                      </button>
                      <button className="rounded-xl bg-[#2a2a2a] px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]">
                        📷 {t('suppliers.addPhoto', 'Add Photo')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
