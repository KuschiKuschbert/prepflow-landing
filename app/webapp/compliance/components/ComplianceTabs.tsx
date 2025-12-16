/**
 * Tab navigation component for compliance page.
 */

import { useTranslation } from '@/lib/useTranslation';
import { Icon } from '@/components/ui/Icon';
import { FileText, Tag, BarChart3, Nut, Wrench } from 'lucide-react';

interface ComplianceTabsProps {
  activeTab: 'records' | 'types' | 'report' | 'allergens' | 'equipment';
  onTabChange: (tab: 'records' | 'types' | 'report' | 'allergens' | 'equipment') => void;
}

export function ComplianceTabs({ activeTab, onTabChange }: ComplianceTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <div className="flex space-x-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
        {(['records', 'types', 'report', 'allergens', 'equipment'] as const).map(tab => {
          const iconMap: Record<typeof tab, typeof FileText> = {
            records: FileText,
            types: Tag,
            report: BarChart3,
            allergens: Nut,
            equipment: Wrench,
          };
          const labelMap: Record<typeof tab, string> = {
            records: String(t('compliance.records', 'Compliance Records')),
            types: String(t('compliance.types', 'Compliance Types')),
            report: 'Health Inspector Report',
            allergens: 'Allergen Overview',
            equipment: 'Equipment Maintenance',
          };
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`rounded-xl px-6 py-3 flex items-center gap-2 font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-xl border border-[var(--primary)]/30'
                  : 'text-[var(--foreground-secondary)] hover:text-[var(--button-active-text)]'
              }`}
            >
              <Icon icon={iconMap[tab]} size="sm" className="flex-shrink-0" aria-hidden={true} />
              {labelMap[tab]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
