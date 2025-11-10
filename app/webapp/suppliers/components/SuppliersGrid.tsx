'use client';

import React from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { Supplier } from '../types';
import { getSupplierIcon } from '../utils';

interface SuppliersGridProps {
  suppliers: Supplier[];
}

export function SuppliersGrid({ suppliers }: SuppliersGridProps) {
  const { t } = useTranslation();

  return (
    <div className="adaptive-grid">
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
  );
}
