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
        <TabButton
          label={t('suppliers.suppliers', 'Suppliers')}
          icon="👥"
          isActive={activeTab === 'suppliers'}
          onClick={() => onTabChange('suppliers')}
        />
        <TabButton
          label={t('suppliers.priceLists', 'Price Lists')}
          icon="📄"
          isActive={activeTab === 'priceLists'}
          onClick={() => onTabChange('priceLists')}
        />
      </div>
    </div>
  );
}

interface TabButtonProps {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, icon, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
        isActive
          ? 'bg-[var(--primary)] text-[var(--button-active-text)] shadow-lg'
          : 'text-[var(--foreground-muted)] hover:text-[var(--button-active-text)]'
      }`}
    >
      {icon} {label}
    </button>
  );
}
