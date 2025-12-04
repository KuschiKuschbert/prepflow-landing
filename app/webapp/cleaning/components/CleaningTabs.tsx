/**
 * Tab navigation component for cleaning page
 */

import { Icon } from '@/components/ui/Icon';
import { ClipboardCheck, MapPin } from 'lucide-react';

interface CleaningTabsProps {
  activeTab: 'grid' | 'areas';
  onTabChange: (tab: 'grid' | 'areas') => void;
}

export function CleaningTabs({ activeTab, onTabChange }: CleaningTabsProps) {
  return (
    <div className="mb-8">
      <div className="flex space-x-1 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
        {(['grid', 'areas'] as const).map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex items-center rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                isActive ? 'bg-[#29E7CD] text-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'grid' ? (
                <Icon icon={ClipboardCheck} size="sm" className="mr-2" aria-hidden={true} />
              ) : (
                <MapPin className="mr-2 inline h-4 w-4" />
              )}
              {tab === 'grid' ? 'Cleaning Grid' : 'Cleaning Areas'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
