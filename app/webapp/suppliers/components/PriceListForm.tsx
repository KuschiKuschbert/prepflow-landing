'use client';

import React from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { PriceListFormData, Supplier } from '../types';
import { getSupplierIcon } from '../utils';

interface PriceListFormProps {
  formData: PriceListFormData;
  suppliers: Supplier[];
  onChange: (data: PriceListFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function PriceListForm({
  formData,
  suppliers,
  onChange,
  onSubmit,
  onCancel,
}: PriceListFormProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-semibold text-white">
        {t('suppliers.addNewPriceList', 'Add New Price List')}
      </h3>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('suppliers.selectSupplier', 'Select Supplier')}
          </label>
          <select
            value={formData.supplier_id}
            onChange={e => onChange({ ...formData, supplier_id: e.target.value })}
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
            value={formData.document_name}
            onChange={e => onChange({ ...formData, document_name: e.target.value })}
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
            value={formData.document_url}
            onChange={e => onChange({ ...formData, document_url: e.target.value })}
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
            value={formData.effective_date}
            onChange={e => onChange({ ...formData, effective_date: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('suppliers.expiryDate', 'Expiry Date')}
          </label>
          <input
            type="date"
            value={formData.expiry_date}
            onChange={e => onChange({ ...formData, expiry_date: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('suppliers.notes', 'Notes')}
          </label>
          <textarea
            value={formData.notes}
            onChange={e => onChange({ ...formData, notes: e.target.value })}
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
              checked={formData.is_current}
              onChange={e => onChange({ ...formData, is_current: e.target.checked })}
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
            onClick={onCancel}
            className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
          >
            {t('suppliers.cancel', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
