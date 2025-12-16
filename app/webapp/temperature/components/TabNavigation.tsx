'use client';

import { useTranslation } from '@/lib/useTranslation';
import { FileText, Factory, BarChart3 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface TabNavigationProps {
  activeTab: 'logs' | 'equipment' | 'analytics';
  onTabChange: (tab: 'logs' | 'equipment' | 'analytics') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { t } = useTranslation();

  const tabs = [
    {
      id: 'logs' as const,
      icon: FileText,
      label: t('temperature.logs', 'Logs'),
      ariaLabel: 'View temperature logs',
    },
    {
      id: 'equipment' as const,
      icon: Factory,
      label: t('temperature.equipment', 'Equipment'),
      ariaLabel: 'View temperature equipment',
    },
    {
      id: 'analytics' as const,
      icon: BarChart3,
      label: t('temperature.analytics', 'Analytics'),
      ariaLabel: 'View temperature analytics',
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex gap-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-lg">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group tablet:px-6 relative flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold transition-all duration-300 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
                isActive
                  ? 'scale-[1.02] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-xl border border-[var(--primary)]/30'
                  : 'text-[var(--foreground-secondary)] hover:bg-[var(--muted)] hover:text-[var(--button-active-text)]'
              }`}
              aria-pressed={isActive}
              aria-label={tab.ariaLabel}
            >
              <Icon
                icon={tab.icon}
                size="md"
                className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                aria-hidden={true}
              />
              <span className="tablet:inline hidden">{tab.label}</span>
              {isActive && (
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 blur-xl" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
