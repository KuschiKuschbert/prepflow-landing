'use client';

import React from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { SupplierPriceList } from '../types';
import { getSupplierIcon } from '../utils';

interface PriceListsListProps {
  priceLists: SupplierPriceList[];
}

export function PriceListsList({ priceLists }: PriceListsListProps) {
  const { t } = useTranslation();

  if (priceLists.length === 0) {
    return (
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
          <span className="text-4xl">📄</span>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">
          {t('suppliers.noPriceLists', 'No Price Lists')}
        </h3>
        <p className="text-gray-400">
          {t('suppliers.noPriceListsDesc', 'Start uploading supplier price lists for easy access')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {priceLists.map(priceList => (
        <div
          key={priceList.id}
          className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                <span className="text-2xl">{getSupplierIcon(priceList.suppliers?.name)}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{priceList.document_name}</h3>
                <p className="text-gray-400">{priceList.suppliers?.name || 'Unknown Supplier'}</p>
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

          <div className="mb-4 grid grid-cols-1 gap-4 desktop:grid-cols-2">
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
      ))}
    </div>
  );
}
