'use client';

import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { useAutosave } from '@/hooks/useAutosave';
import { useTranslation } from '@/lib/useTranslation';
import React from 'react';
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

  // Autosave integration
  const entityId = String(formData.id || 'new');
  const canAutosave = entityId !== 'new' || Boolean(formData.supplier_id && formData.document_name);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'supplier_price_lists',
    entityId: entityId,
    data: formData,
    enabled: canAutosave,
  });

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          {t('suppliers.addNewPriceList', 'Add New Price List')}
        </h3>
        <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
      </div>
      <form onSubmit={onSubmit} className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('suppliers.selectSupplier', 'Select Supplier')}
          </label>
          <select
            value={formData.supplier_id}
            onChange={e => onChange({ ...formData, supplier_id: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            required
          >
            <option value="">
              {t('suppliers.selectSupplierPlaceholder', 'Choose a supplier')}
            </option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {getSupplierIcon(supplier.name || '')} {supplier.name || ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('suppliers.documentName', 'Document Name')}
          </label>
          <input
            type="text"
            value={formData.document_name}
            onChange={e => onChange({ ...formData, document_name: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder={String(
              t('suppliers.documentNamePlaceholder', 'e.g., January 2024 Price List'),
            )}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('suppliers.documentUrl', 'Document URL')}
          </label>
          <input
            type="url"
            value={formData.document_url}
            onChange={e => onChange({ ...formData, document_url: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder={String(
              t('suppliers.documentUrlPlaceholder', 'Link to price list document'),
            )}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('suppliers.effectiveDate', 'Effective Date')}
          </label>
          <input
            type="date"
            value={formData.effective_date}
            onChange={e => onChange({ ...formData, effective_date: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('suppliers.expiryDate', 'Expiry Date')}
          </label>
          <input
            type="date"
            value={formData.expiry_date}
            onChange={e => onChange({ ...formData, expiry_date: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div className="desktop:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('suppliers.notes', 'Notes')}
          </label>
          <textarea
            value={formData.notes}
            onChange={e => onChange({ ...formData, notes: e.target.value })}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder={String(
              t('suppliers.notesPlaceholder', 'Additional notes about this price list'),
            )}
            rows={3}
          />
        </div>
        <div className="desktop:col-span-2 flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_current}
              onChange={e => onChange({ ...formData, is_current: e.target.checked })}
              className="h-4 w-4 rounded border-[var(--border)] bg-[var(--muted)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="text-[var(--foreground-secondary)]">
              {t('suppliers.setAsCurrent', 'Set as current price list')}
            </span>
          </label>
        </div>
        <div className="desktop:col-span-2 flex space-x-4">
          <button
            type="submit"
            className="rounded-2xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary-text)] transition-all duration-200 hover:shadow-xl"
          >
            {t('suppliers.save', 'Save Price List')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl bg-[var(--muted)] px-6 py-3 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]"
          >
            {t('suppliers.cancel', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
