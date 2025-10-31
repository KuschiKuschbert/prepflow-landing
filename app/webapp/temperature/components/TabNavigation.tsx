'use client';

import { useTranslation } from '@/lib/useTranslation';

interface TabNavigationProps {
  activeTab: 'logs' | 'equipment' | 'analytics';
  onTabChange: (tab: 'logs' | 'equipment' | 'analytics') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <div className="flex space-x-1 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
        <button
          onClick={() => onTabChange('logs')}
          className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none ${
            activeTab === 'logs'
              ? 'bg-[#29E7CD] text-black shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
          aria-pressed={activeTab === 'logs'}
          aria-label="View temperature logs"
        >
          📝 {t('temperature.logs', 'Logs')}
        </button>
        <button
          onClick={() => onTabChange('equipment')}
          className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none ${
            activeTab === 'equipment'
              ? 'bg-[#29E7CD] text-black shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
          aria-pressed={activeTab === 'equipment'}
          aria-label="View temperature equipment"
        >
          🏭 {t('temperature.equipment', 'Equipment')}
        </button>
        <button
          onClick={() => onTabChange('analytics')}
          className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none ${
            activeTab === 'analytics'
              ? 'bg-[#29E7CD] text-black shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
          aria-pressed={activeTab === 'analytics'}
          aria-label="View temperature analytics"
        >
          📊 {t('temperature.analytics', 'Analytics')}
        </button>
      </div>
    </div>
  );
}
