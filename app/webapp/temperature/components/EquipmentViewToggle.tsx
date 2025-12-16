'use client';

import { Icon } from '@/components/ui/Icon';
import { Grid3x3, Table2 } from 'lucide-react';

interface EquipmentViewToggleProps {
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
}

export function EquipmentViewToggle({ viewMode, onViewModeChange }: EquipmentViewToggleProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
      <button
        onClick={() => onViewModeChange('table')}
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
          viewMode === 'table'
            ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)]'
            : 'text-[var(--foreground-muted)] hover:text-[var(--button-active-text)]'
        }`}
        title="Table View"
      >
        <Icon icon={Table2} size="sm" aria-hidden={true} />
        <span className="tablet:inline hidden">Table</span>
      </button>
      <button
        onClick={() => onViewModeChange('cards')}
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
          viewMode === 'cards'
            ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)]'
            : 'text-[var(--foreground-muted)] hover:text-[var(--button-active-text)]'
        }`}
        title="Card View"
      >
        <Icon icon={Grid3x3} size="sm" aria-hidden={true} />
        <span className="tablet:inline hidden">Cards</span>
      </button>
    </div>
  );
}
