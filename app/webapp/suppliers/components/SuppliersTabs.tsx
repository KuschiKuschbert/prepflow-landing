'use client';

/**
 * Tab navigation component for suppliers page.
 */

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { FileText, Users, type LucideIcon } from 'lucide-react';

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
          icon={Users}
          isActive={activeTab === 'suppliers'}
          onClick={() => onTabChange('suppliers')}
        />
        <TabButton
          label={t('suppliers.priceLists', 'Price Lists')}
          icon={FileText}
          isActive={activeTab === 'priceLists'}
          onClick={() => onTabChange('priceLists')}
        />
      </div>
    </div>
  );
}

interface TabButtonProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, icon, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
        isActive
          ? 'bg-[var(--primary)] text-[var(--button-active-text)] shadow-lg'
          : 'text-[var(--foreground-muted)] hover:text-[var(--button-active-text)]'
      }`}
    >
      <Icon icon={icon} size="sm" aria-hidden={true} />
      {label}
    </button>
  );
}
