'use client';

import React from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { SupplierFormData } from '../types';
import { useAutosave } from '@/hooks/useAutosave';
import { AutosaveStatus } from '@/components/ui/AutosaveStatus';

interface SupplierFormProps {
  formData: SupplierFormData;
  onChange: (data: SupplierFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function SupplierForm({ formData, onChange, onSubmit, onCancel }: SupplierFormProps) {
  const { t } = useTranslation();

  // Autosave integration
  const entityId = (formData as any).id || 'new';
  const canAutosave = entityId !== 'new' || Boolean(formData.name);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'suppliers',
    entityId: entityId,
    data: formData,
    enabled: canAutosave,
  });

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          {t('suppliers.addNewSupplier', 'Add New Supplier')}
        </h3>
        <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
      </div>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('suppliers.name', 'Supplier Name')}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => onChange({ ...formData, name: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder={String(t('suppliers.namePlaceholder', 'e.g., Fresh Produce Co.'))}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('suppliers.contactPerson', 'Contact Person')}
          </label>
          <input
            type="text"
            value={formData.contact_person}
            onChange={e => onChange({ ...formData, contact_person: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder={String(t('suppliers.contactPersonPlaceholder', 'e.g., John Smith'))}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('suppliers.email', 'Email')}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => onChange({ ...formData, email: e.target.value })}
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
            value={formData.phone}
            onChange={e => onChange({ ...formData, phone: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder={String(t('suppliers.phonePlaceholder', '+61 2 1234 5678'))}
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('suppliers.address', 'Address')}
          </label>
          <textarea
            value={formData.address}
            onChange={e => onChange({ ...formData, address: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder={String(t('suppliers.addressPlaceholder', 'Full business address'))}
            rows={2}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('suppliers.website', 'Website')}
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={e => onChange({ ...formData, website: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder={String(t('suppliers.websitePlaceholder', 'https://supplier.com'))}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('suppliers.paymentTerms', 'Payment Terms')}
          </label>
          <input
            type="text"
            value={formData.payment_terms}
            onChange={e => onChange({ ...formData, payment_terms: e.target.value })}
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
            value={formData.delivery_schedule}
            onChange={e => onChange({ ...formData, delivery_schedule: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder={String(
              t('suppliers.deliverySchedulePlaceholder', 'e.g., Monday, Wednesday, Friday'),
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
            value={formData.minimum_order_amount}
            onChange={e => onChange({ ...formData, minimum_order_amount: e.target.value })}
            className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            placeholder={String(t('suppliers.minimumOrderPlaceholder', 'e.g., 100.00'))}
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
