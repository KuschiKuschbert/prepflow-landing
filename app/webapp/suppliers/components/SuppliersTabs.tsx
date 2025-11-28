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
      <div className="flex space-x-1 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
        <button
          onClick={() => onTabChange('suppliers')}
          className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
            activeTab === 'suppliers'
              ? 'bg-[#29E7CD] text-black shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          👥 {t('suppliers.suppliers', 'Suppliers')}
        </button>
        <button
          onClick={() => onTabChange('priceLists')}
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
  );
}
