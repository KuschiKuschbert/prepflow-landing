'use client';

import { Icon } from '@/components/ui/Icon';
import { Keyboard, LucideIcon, MousePointerClick, Move } from 'lucide-react';

interface Action {
  type: 'click' | 'type' | 'scroll';
  target: string;
  value?: string;
}

interface ActionButtonProps {
  action: Action;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

function getActionIcon(type: 'click' | 'type' | 'scroll'): LucideIcon {
  switch (type) {
    case 'click':
      return MousePointerClick;
    case 'type':
      return Keyboard;
    case 'scroll':
      return Move;
  }
}

function getActionLabel(action: Action): string {
  switch (action.type) {
    case 'click':
      return `Click on ${action.target}`;
    case 'type':
      return `Type "${action.value}" into ${action.target}`;
    case 'scroll':
      return `Scroll to ${action.target}`;
  }
}

/** Renders a single action step button in the interactive demo */
export function ActionButton({ action, index, isActive, onClick }: ActionButtonProps) {
  const ActionIcon = getActionIcon(action.type);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-3 text-left transition-all ${
        isActive
          ? 'border-[var(--primary)] bg-[var(--primary)]/10'
          : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--border)] hover:bg-[var(--surface)]'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
            isActive
              ? 'bg-[var(--primary)] text-[var(--primary-text)]'
              : 'bg-[var(--primary)]/20 text-[var(--primary)]'
          }`}
        >
          {index + 1}
        </span>
        <Icon icon={ActionIcon} size="sm" className="text-[var(--foreground-muted)]" aria-hidden />
        <div className="flex-1">
          <span className="text-sm text-[var(--foreground-secondary)]">
            {getActionLabel(action)}
          </span>
        </div>
        {isActive && <span className="text-xs text-[var(--primary)]">Executed</span>}
      </div>
    </button>
  );
}
