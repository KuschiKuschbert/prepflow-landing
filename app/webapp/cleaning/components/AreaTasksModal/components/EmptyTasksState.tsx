'use client';

/**
 * Empty state component for area tasks modal
 */

import { Icon } from '@/components/ui/Icon';
import { Plus, Circle } from 'lucide-react';

interface EmptyTasksStateProps {
  onCreateTask: () => void;
}

export function EmptyTasksState({ onCreateTask }: EmptyTasksStateProps) {
  return (
    <div className="py-8 text-center">
      <div className="mb-3 flex justify-center">
        <div className="tablet:h-20 tablet:w-20 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20">
          <Icon
            icon={Circle}
            size="lg"
            className="tablet:size-xl text-[var(--primary)]"
            aria-hidden={true}
          />
        </div>
      </div>
      <h3 className="tablet:text-xl mb-1.5 text-lg font-semibold text-[var(--foreground)]">
        No tasks yet
      </h3>
      <p className="mb-4 text-[var(--foreground-muted)]">Create your first task for this area.</p>
      <button
        onClick={onCreateTask}
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
      >
        <Icon icon={Plus} size="sm" aria-hidden={true} />
        Create First Task
      </button>
    </div>
  );
}
