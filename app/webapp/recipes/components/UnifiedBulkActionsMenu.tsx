'use client';

import { Icon } from '@/components/ui/Icon';
import { Share2, Trash2, UtensilsCrossed, Zap } from 'lucide-react';

interface UnifiedBulkActionsMenuProps {
  selectedCount: number;
  selectedRecipeCount: number;
  bulkActionLoading: boolean;
  onBulkDelete: () => void;
  onBulkShare: () => void;
  onBulkAddToMenu: () => void;
  showBulkMenu: boolean;
  onToggleBulkMenu: () => void;
  variant?: 'desktop' | 'mobile';
}

export function UnifiedBulkActionsMenu({
  selectedCount,
  selectedRecipeCount,
  bulkActionLoading,
  onBulkDelete,
  onBulkShare,
  onBulkAddToMenu,
  showBulkMenu,
  onToggleBulkMenu,
  variant = 'desktop',
}: UnifiedBulkActionsMenuProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={`relative z-[60] ${variant === 'desktop' ? 'large-desktop:block hidden' : 'large-desktop:hidden'}`}
    >
      <button
        onClick={onToggleBulkMenu}
        disabled={bulkActionLoading}
        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 text-sm font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-orange-500/80 hover:to-red-500/80 hover:shadow-xl disabled:opacity-50"
      >
        <Icon icon={Zap} size="xs" className="text-current" aria-hidden={true} />
        <span>{variant === 'desktop' ? `Bulk Actions (${selectedCount})` : 'Actions'}</span>
      </button>

      {showBulkMenu && (
        <>
          <div className="fixed inset-0 z-[55]" onClick={onToggleBulkMenu} aria-hidden={true} />
          <div
            className={`absolute top-full ${variant === 'desktop' ? 'left-0' : 'right-0'} z-[60] mt-1.5 w-64 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl`}
          >
            <div className="p-1.5">
              <div className="border-b border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--foreground-muted)]">
                {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
                {selectedRecipeCount > 0 && (
                  <span className="ml-1">
                    ({selectedRecipeCount} recipe{selectedRecipeCount > 1 ? 's' : ''})
                  </span>
                )}
              </div>

              <div className="mt-1.5 space-y-0.5">
                <button
                  onClick={onBulkDelete}
                  disabled={bulkActionLoading}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/10 disabled:opacity-50"
                >
                  <Icon
                    icon={Trash2}
                    size="xs"
                    className="text-[var(--color-error)]"
                    aria-hidden={true}
                  />
                  <span>Delete Selected</span>
                </button>

                {selectedRecipeCount > 0 && (
                  <button
                    onClick={onBulkShare}
                    disabled={bulkActionLoading}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
                  >
                    <Icon icon={Share2} size="xs" className="text-current" aria-hidden={true} />
                    <span>Share Selected ({selectedRecipeCount})</span>
                  </button>
                )}

                <button
                  onClick={onBulkAddToMenu}
                  disabled={bulkActionLoading}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10 disabled:opacity-50"
                >
                  <Icon
                    icon={UtensilsCrossed}
                    size="xs"
                    className="text-[var(--primary)]"
                    aria-hidden={true}
                  />
                  <span>Add to Menu</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
