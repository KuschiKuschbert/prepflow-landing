'use client';

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
      <div className="flex space-x-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
        {(['grid', 'areas'] as const).map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex items-center rounded-xl px-6 py-3 font-semibold transition-all duration-200 ${
                isActive
                  ? 'border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-xl'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--button-active-text)]'
              }`}
            >
              {tab === 'grid' ? (
                <Icon icon={ClipboardCheck} size="sm" className="mr-2" aria-hidden={true} />
              ) : (
                <Icon icon={MapPin} size="sm" className="mr-2" aria-hidden />
              )}
              {tab === 'grid' ? 'Cleaning Grid' : 'Cleaning Areas'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
