'use client';

/**
 * Tab navigation component for suppliers page.
 */

import { useTranslation } from '@/lib/useTranslation';

interface SuppliersTabsProps {
  activeTab: 'suppliers' | 'priceLists';
  onTabChange: (tab: 'suppliers' | 'priceLists') => void;
}

export function SuppliersTabs({ activeTab, onTabChange }: SuppliersTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <div className="flex space-x-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
        <button
          onClick={() => onTabChange('suppliers')}
          className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
            activeTab === 'suppliers'
              ? 'bg-[var(--primary)] text-[var(--button-active-text)] shadow-lg'
              : 'text-[var(--foreground-muted)] hover:text-[var(--button-active-text)]'
          }`}
        >
          👥 {t('suppliers.suppliers', 'Suppliers')}
        </button>
        <button
          onClick={() => onTabChange('priceLists')}
          className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
            activeTab === 'priceLists'
              ? 'bg-[var(--primary)] text-[var(--button-active-text)] shadow-lg'
              : 'text-[var(--foreground-muted)] hover:text-[var(--button-active-text)]'
          }`}
        >
          📄 {t('suppliers.priceLists', 'Price Lists')}
        </button>
      </div>
    </div>
  );
}
