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
      <div className="flex gap-2 rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-1.5 shadow-lg">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group relative flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium transition-all duration-300 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none tablet:px-6 ${
                isActive
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black shadow-xl scale-[1.02]'
                  : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
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
              <span className="hidden tablet:inline">{tab.label}</span>
              {isActive && (
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 blur-xl" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
