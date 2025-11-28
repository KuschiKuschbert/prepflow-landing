/**
 * Tab navigation component for compliance page.
 */

import { useTranslation } from '@/lib/useTranslation';

interface ComplianceTabsProps {
  activeTab: 'records' | 'types' | 'report' | 'allergens';
  onTabChange: (tab: 'records' | 'types' | 'report' | 'allergens') => void;
}

export function ComplianceTabs({ activeTab, onTabChange }: ComplianceTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <div className="flex space-x-1 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
        {(['records', 'types', 'report', 'allergens'] as const).map(tab => {
          const labels: Record<typeof tab, string> = {
            records: `📄 ${t('compliance.records', 'Compliance Records')}`,
            types: `🏷️ ${t('compliance.types', 'Compliance Types')}`,
            report: '📊 Health Inspector Report',
            allergens: '🥜 Allergen Overview',
          };
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
