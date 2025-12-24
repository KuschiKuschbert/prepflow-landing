'use client';

/**
 * Header component for area tasks modal
 */

import { Icon } from '@/components/ui/Icon';
import { X, Plus } from 'lucide-react';

interface CleaningArea {
  id: string;
  area_name: string;
  description?: string;
}

interface AreaTasksModalHeaderProps {
  area: CleaningArea;
  onClose: () => void;
  onCreateTask: () => void;
}

export function AreaTasksModalHeader({ area, onClose, onCreateTask }: AreaTasksModalHeaderProps) {
  return (
    <div className="tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-0 tablet:p-5 flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="min-w-0 flex-1">
        <h2
          id="area-tasks-modal-title"
          className="tablet:text-xl desktop:text-2xl truncate text-lg font-bold text-[var(--foreground)]"
        >
          {area.area_name}
        </h2>
        {area.description && (
          <p className="tablet:text-sm mt-0.5 line-clamp-2 text-xs text-[var(--foreground-muted)]">
            {area.description}
          </p>
        )}
      </div>
      <div className="tablet:gap-3 flex shrink-0 items-center gap-2">
        <button
          onClick={onCreateTask}
          className="tablet:gap-2 tablet:px-4 tablet:text-sm flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-lg"
        >
          <Icon icon={Plus} size="sm" aria-hidden={true} />
          <span className="tablet:inline hidden">Add Task</span>
          <span className="tablet:hidden">Add</span>
        </button>
        <button
          onClick={onClose}
          className="shrink-0 p-2 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          aria-label="Close"
        >
          <Icon icon={X} size="md" className="tablet:size-lg" aria-hidden={true} />
        </button>
      </div>
    </div>
  );
}
