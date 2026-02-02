'use client';

import { Menu } from '@/lib/types/menu-builder';
import { Icon } from '@/components/ui/Icon';
import { Loader2, Plus, X } from 'lucide-react';

export interface BulkAddToMenuDialogProps {
  show: boolean;
  menus: Menu[];
  loadingMenus: boolean;
  onClose: () => void;
  onSelectMenu: (menuId: string) => void;
  onCreateNew: () => void;
}

export function BulkAddToMenuDialog({
  show,
  menus,
  loadingMenus,
  onClose,
  onSelectMenu,
  onCreateNew,
}: BulkAddToMenuDialogProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl">
        <div className="rounded-2xl bg-[var(--surface)]/95">
          <div className="border-b border-[var(--border)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">Add to Menu</h3>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Select a menu to add selected items
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                aria-label="Close dialog"
              >
                <Icon icon={X} size="sm" aria-hidden={true} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto p-6">
            {loadingMenus ? (
              <div className="flex items-center justify-center py-8">
                <Icon
                  icon={Loader2}
                  size="lg"
                  className="animate-spin text-[var(--primary)]"
                  aria-hidden={true}
                />
                <span className="ml-3 text-[var(--foreground-muted)]">Loading menus...</span>
              </div>
            ) : menus.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[var(--foreground-muted)]">No menus available</p>
                <button
                  onClick={onCreateNew}
                  className="mt-4 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 font-medium text-[var(--button-active-text)] transition-all duration-200 hover:shadow-lg"
                >
                  Create New Menu
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={onCreateNew}
                  className="flex w-full items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-left transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
                    <Icon
                      icon={Plus}
                      size="sm"
                      className="text-[var(--button-active-text)]"
                      aria-hidden={true}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-[var(--foreground)]">Create New Menu</div>
                    <div className="text-sm text-[var(--foreground-muted)]">
                      Start a new menu from scratch
                    </div>
                  </div>
                </button>

                <div className="border-t border-[var(--border)] pt-2">
                  <div className="mb-2 px-2 text-xs font-medium tracking-wider text-[var(--foreground-muted)] uppercase">
                    Existing Menus
                  </div>
                  {menus.map(menu => (
                    <button
                      key={menu.id}
                      onClick={() => onSelectMenu(menu.id)}
                      className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-left transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-[var(--foreground)]">{menu.menu_name}</div>
                        {menu.description && (
                          <div className="mt-1 text-sm text-[var(--foreground-muted)]">
                            {menu.description}
                          </div>
                        )}
                        <div className="mt-1 text-xs text-[var(--foreground-subtle)]">
                          {menu.items_count || 0} item{(menu.items_count || 0) !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="ml-4 text-[var(--primary)]">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
