'use client';
import { Icon } from '@/components/ui/Icon';
import { Lock } from 'lucide-react';

interface MenuLockButtonProps {
  lockLoading: boolean;
  onLock: () => void;
}

export function MenuLockButton({ lockLoading, onLock }: MenuLockButtonProps) {
  return (
    <div className="mb-4 flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onLock();
        }}
        disabled={lockLoading}
        className="flex items-center gap-2 rounded-lg border border-[var(--primary)]/50 bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
        title="Lock menu to finalize and show allergen matrix"
      >
        <Icon icon={Lock} size="sm" aria-hidden={true} />
        <span>{lockLoading ? 'Locking...' : 'Lock Menu'}</span>
      </button>
    </div>
  );
}
