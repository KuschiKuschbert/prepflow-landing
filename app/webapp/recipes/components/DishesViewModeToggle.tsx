'use client';

import { Icon } from '@/components/ui/Icon';
import { ChefHat, List, Edit } from 'lucide-react';

type ViewMode = 'list' | 'editor' | 'builder';

interface DishesViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onEditorClick: () => void;
}

export function DishesViewModeToggle({
  viewMode,
  onViewModeChange,
  onEditorClick,
}: DishesViewModeToggleProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
        <button
          onClick={() => onViewModeChange('list')}
          className={`tablet:px-6 flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
            viewMode === 'list'
              ? 'bg-[var(--primary)] text-[var(--button-active-text)] shadow-lg'
              : 'text-[var(--foreground-muted)] hover:text-[var(--button-active-text)]'
          }`}
          aria-pressed={Boolean(viewMode === 'list')}
          aria-label="List view"
        >
          <Icon icon={List} size="sm" />
          <span>List View</span>
        </button>
        <button
          onClick={onEditorClick}
          className={`tablet:px-6 flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
            viewMode === 'editor'
              ? 'bg-[var(--primary)] text-[var(--button-active-text)] shadow-lg'
              : 'text-[var(--foreground-muted)] hover:text-[var(--button-active-text)]'
          }`}
          aria-pressed={viewMode === 'editor'}
          aria-label="Editor view"
        >
          <Icon icon={Edit} size="sm" />
          <span>Editor</span>
        </button>
        <button
          onClick={() => onViewModeChange('builder')}
          className={`tablet:px-6 flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:outline-none ${
            viewMode === 'builder'
              ? 'bg-[var(--primary)] text-[var(--button-active-text)] shadow-lg'
              : 'text-[var(--foreground-muted)] hover:text-[var(--button-active-text)]'
          }`}
          aria-pressed={viewMode === 'builder'}
          aria-label="Builder view"
        >
          <Icon icon={ChefHat} size="sm" />
          <span>Builder</span>
        </button>
      </div>
    </div>
  );
}
