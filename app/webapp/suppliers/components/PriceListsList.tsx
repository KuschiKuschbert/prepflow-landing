'use client';

import React from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { SupplierPriceList } from '../types';
import { getSupplierIcon } from '../utils';
import { Icon } from '@/components/ui/Icon';
import { FileText, CheckCircle2, Camera, Edit } from 'lucide-react';

interface PriceListsListProps {
  priceLists: SupplierPriceList[];
}

export function PriceListsList({ priceLists }: PriceListsListProps) {
  const { t } = useTranslation();

  if (priceLists.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
          <Icon icon={FileText} size="xl" className="text-[var(--primary)]" aria-hidden={true} />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-[var(--button-active-text)]">
          {t('suppliers.noPriceLists', 'No Price Lists')}
        </h3>
        <p className="text-[var(--foreground-muted)]">
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
          className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
                <Icon
                  icon={getSupplierIcon(priceList.suppliers?.name)}
                  size="lg"
                  className="text-[var(--primary)]"
                  aria-hidden={true}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--foreground)]">
                  {priceList.document_name}
                </h3>
                <p className="text-[var(--foreground-muted)]">
                  {priceList.suppliers?.name || 'Unknown Supplier'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {priceList.is_current && (
                <span className="flex items-center gap-1 rounded-full border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 px-3 py-1 text-xs font-medium text-[var(--color-success)]">
                  <Icon
                    icon={CheckCircle2}
                    size="xs"
                    className="text-[var(--color-success)]"
                    aria-hidden={true}
                  />
                  {t('suppliers.current', 'Current')}
                </span>
              )}
              <a
                href={priceList.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-lg"
              >
                <Icon
                  icon={FileText}
                  size="sm"
                  className="text-[var(--primary-text)]"
                  aria-hidden={true}
                />
                {t('suppliers.viewDocument', 'View Document')}
              </a>
            </div>
          </div>

          <div className="desktop:grid-cols-2 mb-4 grid grid-cols-1 gap-4">
            {priceList.effective_date && (
              <div>
                <span className="text-sm text-[var(--foreground-muted)]">
                  {t('suppliers.effectiveDate', 'Effective Date')}:{' '}
                </span>
                <span className="text-[var(--foreground)]">
                  {new Date(priceList.effective_date).toLocaleDateString()}
                </span>
              </div>
            )}
            {priceList.expiry_date && (
              <div>
                <span className="text-sm text-[var(--foreground-muted)]">
                  {t('suppliers.expiryDate', 'Expiry Date')}:{' '}
                </span>
                <span className="text-[var(--foreground)]">
                  {new Date(priceList.expiry_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {priceList.notes && (
            <p className="mb-4 text-[var(--foreground-secondary)]">{priceList.notes}</p>
          )}

          <div className="flex space-x-4">
            <button className="flex items-center gap-2 rounded-xl bg-[var(--muted)] px-4 py-2 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]">
              <Icon icon={Edit} size="sm" className="text-[var(--foreground)]" aria-hidden={true} />
              {t('suppliers.edit', 'Edit')}
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-[var(--muted)] px-4 py-2 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]">
              <Icon
                icon={Camera}
                size="sm"
                className="text-[var(--foreground)]"
                aria-hidden={true}
              />
              {t('suppliers.addPhoto', 'Add Photo')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
