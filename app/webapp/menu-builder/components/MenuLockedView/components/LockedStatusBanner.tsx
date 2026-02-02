'use client';

import { Icon } from '@/components/ui/Icon';
import { Lock } from 'lucide-react';
import type { Menu } from '@/lib/types/menu-builder';

interface LockedStatusBannerProps {
  menu: Menu;
  onUnlock: () => void;
}

export function LockedStatusBanner({ menu, onUnlock }: LockedStatusBannerProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-warning)]/50 bg-[var(--color-warning)]/10 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon icon={Lock} size="lg" className="text-[var(--color-warning)]" aria-hidden={true} />
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Menu Locked</h2>
            <p className="text-sm text-[var(--foreground-muted)]">
              This menu has been finalized. View the allergen matrix below or export it for
              printing.
              {menu.locked_at && (
                <span className="ml-2">
                  Locked on {new Date(menu.locked_at).toLocaleDateString()}
                  {menu.locked_by && ` by ${menu.locked_by}`}
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={onUnlock}
          className="rounded-lg border border-[var(--color-warning)]/50 bg-[var(--color-warning)]/10 px-4 py-2 text-sm font-medium text-[var(--color-warning)] transition-all hover:bg-[var(--color-warning)]/20"
        >
          Unlock Menu
        </button>
      </div>
    </div>
  );
}
