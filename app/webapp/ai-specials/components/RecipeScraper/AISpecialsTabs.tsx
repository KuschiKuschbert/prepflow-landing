/**
 * AI Specials Tabs Component
 * Tab navigation for Scraping and Formatting sections
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Download, Sparkles } from 'lucide-react';

interface AISpecialsTabsProps {
  activeTab: 'scraping' | 'formatting';
  onTabChange: (tab: 'scraping' | 'formatting') => void;
}

export function AISpecialsTabs({ activeTab, onTabChange }: AISpecialsTabsProps) {
  return (
    <div className="mb-6">
      <div className="flex space-x-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
        <button
          onClick={() => onTabChange('scraping')}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
            activeTab === 'scraping'
              ? 'border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-xl'
              : 'text-[var(--foreground-secondary)] hover:text-[var(--button-active-text)]'
          }`}
          aria-pressed={activeTab === 'scraping'}
          aria-label="View scraping interface"
        >
          <Icon icon={Download} size="sm" aria-hidden={true} />
          <span>Scraping</span>
        </button>
        <button
          onClick={() => onTabChange('formatting')}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
            activeTab === 'formatting'
              ? 'border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)] shadow-xl'
              : 'text-[var(--foreground-secondary)] hover:text-[var(--button-active-text)]'
          }`}
          aria-pressed={activeTab === 'formatting'}
          aria-label="View formatting interface"
        >
          <Icon icon={Sparkles} size="sm" aria-hidden={true} />
          <span>Formatting</span>
        </button>
      </div>
    </div>
  );
}
